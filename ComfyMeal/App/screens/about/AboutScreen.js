import * as React from 'react';
import {StyleSheet, View, Image, Text, ScrollView} from 'react-native';

class AboutScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foodCourtInformation: {
        foodCourtName: '',
        foodCourtDescription: '',
        foodCourtImage: '',
        foodCourtAddress: '',
      },
    };
  }

  componentDidMount = () => {
    fetch(
      'http://foodcout.ap-southeast-1.elasticbeanstalk.com/food-court/about',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(Response => Response.json())
      .then(response => {
        this.setState({foodCourtInformation: response});
      })
      .catch(error => {
        console.log(error);
      });
  };
  render() {
    console.log('fc', this.state.foodCourtInformation);
    return (
      <View style={styles.container}>
        <Image
          source={{
            uri: this.state.foodCourtInformation.foodCourtImage,
          }}
          style={styles.fcImage}
        />
        <ScrollView
          style={styles.infoContainer}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>ABOUT US</Text>
          <Text style={{fontSize: 18}}>
            We are{' '}
            <Text style={{fontWeight: 'bold'}}>
              {this.state.foodCourtInformation.foodCourtName}! {'\n\n'}
            </Text>
            Located at{' '}
            <Text style={{fontWeight: 'bold'}}>
              {this.state.foodCourtInformation.foodCourtAddress}
            </Text>
            , {'\n\n'}
            {this.state.foodCourtInformation.foodCourtDescription}
          </Text>
        </ScrollView>
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

export default AboutScreen;
