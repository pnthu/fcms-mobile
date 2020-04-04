import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  Image,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import {GoogleSignin} from '@react-native-community/google-signin';
import {LoginManager} from 'react-native-fbsdk';

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      provider: {},
    };
  }

  logout = async () => {
    try {
      if (this.state.provider.provider === 'Google') {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        await AsyncStorage.removeItem('user-info');
        await AsyncStorage.removeItem('provider');
        this.props.navigation.navigate('UserHome');
      } else {
        console.log('bear bear');
        LoginManager.logOut();
        await AsyncStorage.removeItem('user-info');
        await AsyncStorage.removeItem('provider');
        this.props.navigation.navigate('UserHome');
      }
    } catch (error) {
      console.error(error);
    }
  };

  componentDidMount = async () => {
    try {
      const response = await AsyncStorage.getItem('user-info');
      const userInfo = JSON.parse(response);
      const provider = JSON.parse(await AsyncStorage.getItem('provider'));
      console.log('provider', provider);
      this.setState({userInfo: userInfo, provider: provider});
      console.log('user', userInfo);
    } catch (error) {
      this.props.navigation.navigate('UserHome');
      ToastAndroid.show(`You haven't logged in, ${error}`, ToastAndroid.LONG);
    }
  };

  render() {
    console.log('bear', this.state.userInfo.photo);
    return (
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.title}>My Profile</Text>
          <Image
            source={{uri: this.state.userInfo.photo}}
            style={styles.image}
          />
          <Text style={styles.name}>{this.state.userInfo.name}</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.row}>
            <AntDesign name="mail" color="white" style={styles.icon} />
            <Text>{this.state.userInfo.email}</Text>
          </View>
          <View style={styles.row}>
            <FontAwesome5 name="wallet" color="white" style={styles.icon} />
            <Text>Your wallet balance: </Text>
          </View>
          <TouchableOpacity style={styles.row} onPress={this.logout}>
            <FontAwesome5
              name="sign-out-alt"
              color="white"
              style={styles.icon}
            />
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
        <Text style={{textAlign: 'center', marginTop: 200}}>Version 1.0.0</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 8,
    alignSelf: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
    marginVertical: 12,
    color: '#ee7739',
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  row: {
    borderBottomColor: '#e4e4e4',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  icon: {
    backgroundColor: '#4a6572',
    fontSize: 16,
    padding: 6,
    borderRadius: 50,
    marginRight: 8,
  },
  name: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    marginVertical: 12,
  },
});

export default ProfileScreen;
