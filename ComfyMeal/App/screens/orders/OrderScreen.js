import * as React from 'react';
import {View, Text, Button, TouchableOpacity} from 'react-native';

class OrderScreen extends React.Component {
  render() {
    return (
      <View>
        <Text>This is the screen where your orders are placed here</Text>
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

export default OrderScreen;
