import * as React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

class OrderSuccessScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {};
  render() {
    return (
      <View style={styles.container}>
        <Text>Congratulations!</Text>
        <FontAwesome5 name="check-circle" solid />
        <Text>You have purchased your order successfully!</Text>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('CustomerHome')}>
          <Text>BACK TO HOME SCREEN</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // paddingVertical: 12,
  },
  fcImage: {
    // borderRadius: 100,
    // width: 200,
    // height: 200,
    // alignSelf: 'center',
    height: '25%',
    width: '100%',
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#ee7739',
    fontSize: 20,
    marginBottom: 8,
  },
});

export default OrderSuccessScreen;
