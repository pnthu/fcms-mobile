import * as React from 'react';
import {View, Text, Button, TouchableOpacity} from 'react-native';

class CartScreen extends React.Component {
  render() {
    return (
      <View>
        <Text>This is your cart screen</Text>
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

export default CartScreen;
