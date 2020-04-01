import * as React from 'react';
import {View, Text, Button, TouchableOpacity, ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class ProfileScreen extends React.Component {
  componentDidMount = async () => {
    try {
      const response = await AsyncStorage.getItem('user-info');
      const userInfo = JSON.parse(response);
      console.log('user', userInfo);
    } catch (error) {
      this.props.navigation.navigate('UserHome');
      ToastAndroid.show(`You haven't logged in, ${error}`, ToastAndroid.SHORT);
    }
  };

  render() {
    return (
      <View>
        <Text>This is your profile screen</Text>
        {/* <TouchableOpacity>
          <Button
            title="Go to StallListScreen"
            onPress={() => {
              this.props.navigation.navigate('UserHome');
            }}></Button>
        </TouchableOpacity> */}
      </View>
    );
  }
}

export default ProfileScreen;
