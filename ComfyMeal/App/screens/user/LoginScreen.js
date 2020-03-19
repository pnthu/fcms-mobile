import * as React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import {LoginButton, AccessToken} from 'react-native-fbsdk';

class LoginScreen extends React.Component {
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

  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn().then(data => {
        console.log('TEST ' + JSON.stringify(data));

        const currentUser = GoogleSignin.getTokens().then(res => {
          console.log('accessToken', res.accessToken); //<-------Get accessToken
          var postData = {
            access_token: res.accessToken,
            code: data.idToken,
          };
        });
      });
      // console.log(this.getTokens());
      this.props.navigation.navigate('CustomerHome');
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
        <TouchableOpacity>
          <GoogleSigninButton
            style={{width: '70%', height: 40, alignSelf: 'center'}}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={this._signIn}
            // disabled={this.state.isSigninInProgress}
          />
        </TouchableOpacity>
        <Text style={styles.introText}>or</Text>
        <TouchableOpacity>
          <LoginButton
            style={{
              height: 40,
              width: '70%',
              alignSelf: 'center',
            }}
            publishPermissions={['publish_actions']}
            permissions={['email', 'public_profile']}
            onLoginFinished={(error, result) => {
              if (error) {
                console.log('login has error: ' + error);
              } else if (result.isCancelled) {
                console.log('login is cancelled.');
              } else {
                AccessToken.getCurrentAccessToken().then(data => {
                  console.log(data.accessToken);

                  // console.log(data.userID);
                  console.log(data.permissions);
                  this.props.navigation.navigate('CustomerHome');
                });
              }
            }}
            onLogoutFinished={() => console.log('logout.')}
          />
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
});

export default LoginScreen;
