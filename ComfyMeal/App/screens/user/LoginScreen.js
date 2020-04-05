import * as React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk';
import AsyncStorage from '@react-native-community/async-storage';

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      tokens: {},
      wallet: {walletId: 0, walletBalance: 0},
    };
  }

  componentDidMount = () => {
    GoogleSignin.configure({
      webClientId:
        '618274547090-det3na3qsjhkamt2u82omfbgjesonea7.apps.googleusercontent.com',
      offlineAccess: true,
      forceConsentPrompt: true,
      androidClientId:
        '618274547090-aejif9us2mkdrmhrg151jc0930im3k1r.apps.googleusercontent.com',
    });
  };

  signInGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      console.log('tokens', tokens);
      this.setState({user: user, tokens: tokens});
      const provider = {provider: 'Google'};
      console.log('GOOGLE: ' + tokens.accessToken);
      //call api here
      fetch(
        'http://foodcout.ap-southeast-1.elasticbeanstalk.com/user/customer/social-account?accessToken=' +
          tokens.accessToken +
          '&provider=Google',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
        .then((Response) => Response.json())
        .then((wallet) => {
          this.setState({
            wallet: {
              walletId: wallet.id,
              walletBalance: wallet.balances,
            },
          });
        })
        .catch((error) => {
          console.log(error);
        });
      await AsyncStorage.setItem('user-info', JSON.stringify(user.user));
      await AsyncStorage.setItem('provider', JSON.stringify(provider));
      this.props.navigation.navigate('CustomerHome');
      await AsyncStorage.setItem(
        'customer-wallet',
        JSON.stringify(this.state.wallet),
      );
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User has cancelled');
      } else if (error.code == statusCodes.IN_PROGRESS) {
        console.log('navigate to HomeScreen');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play service is not available');
      } else {
        console.log('Another error', error);
      }
    }
  };

  signInFacebook = async () => {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
    if (result.isCancelled) {
      console.log('login is cancelled.');
    } else if (result.error) {
      console.log('login has error: ' + error);
    } else {
      const data = await AccessToken.getCurrentAccessToken();
      const {accessToken} = data;
      console.log('accessToken', accessToken);
      fetch(
        'http://192.168.1.102:8080/user/customer/social-account?accessToken=' +
          accessToken +
          '&provider=Facebook',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
        .then((Response) => Response.json())
        .then((wallet) => {
          this.setState({
            wallet: {
              walletId: wallet.id,
              walletBalance: wallet.balances,
            },
          });
        })
        .catch((error) => {
          console.log(error);
        });
      const infoRequest = new GraphRequest(
        '/me?fields=id,name,email,picture',
        null,
        async (error, result) => {
          if (error) {
            console.log('error', error);
          } else {
            const {picture} = result;
            const mappedInfo = {photo: picture.data.url, ...result};
            await AsyncStorage.setItem('user-info', JSON.stringify(mappedInfo));
          }
        },
      );
      new GraphRequestManager().addRequest(infoRequest).start();
      const provider = {provider: 'facebook'};
      await AsyncStorage.setItem('provider', JSON.stringify(provider));
      await AsyncStorage.setItem(
        'customer-wallet',
        JSON.stringify(this.state.wallet),
      );
      this.props.navigation.navigate('CustomerHome');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('../../../assets/logo.jpg')}
          style={styles.logo}
        />
        <Text style={styles.introText}>
          Welcome to Comfy Meal! {'\n\n'}To experience our further features,
          please:
        </Text>
        <TouchableOpacity onPress={this.signInGoogle} style={styles.ggBtn}>
          <FontAwesome name="google" style={styles.icon} />
          <Text style={styles.btnText}>Login with Google</Text>
        </TouchableOpacity>
        <Text style={styles.introText}>or</Text>
        <TouchableOpacity style={styles.fbBtn} onPress={this.signInFacebook}>
          <FontAwesome name="facebook" style={styles.icon} />
          <Text style={styles.btnText}>Login with Facebook</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  logo: {
    borderRadius: 100,
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
  introText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 16,
  },
  ggBtn: {
    alignSelf: 'center',
    backgroundColor: '#c94536',
    width: '70%',
    height: 40,
    flexDirection: 'row',
    borderRadius: 20,
  },
  fbBtn: {
    alignSelf: 'center',
    backgroundColor: '#3f619b',
    width: '70%',
    height: 40,
    flexDirection: 'row',
    borderRadius: 20,
  },
  icon: {
    color: 'white',
    borderRightColor: 'white',
    borderRightWidth: 1,
    fontSize: 18,
    width: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 40,
    textAlignVertical: 'center',
  },
});

export default LoginScreen;
