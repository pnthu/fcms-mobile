import * as React from 'react';
import {StyleSheet, View, Text, BackHandler} from 'react-native';

class StallDetailScreen extends React.Component {
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.goBack;
      return true;
    });
  }

  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        {/* <Text>{JSON.stringify(navigation.state.params)}</Text> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
});

export default StallDetailScreen;
