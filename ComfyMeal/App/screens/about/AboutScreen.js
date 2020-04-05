import * as React from 'react';
import {StyleSheet, View, Image, Text, ScrollView} from 'react-native';

// const fcInfo = {
//   name: 'The Amazing Foodcourt',
//   address: 'Đường D1 Khu Công nghệ cao, P.Long Thạnh Mỹ, Q.9, TP.HCM',
//   description:
//     'This is a description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat elit maximus, cursus ante a, dignissim odio. Nullam gravida neque id arcu egestas tempus. Aenean nunc quam, laoreet in ornare eu, lacinia ac neque. Sed imperdiet ultrices fringilla. Aliquam sed diam magna. Maecenas ullamcorper nibh nec egestas commodo. Duis accumsan ut nisi eleifend mollis.',
// };

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

  componentDidMount() {
    fetch('http://192.168.1.102:8080/food-court/about', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(Response => Response.json())
      .then(response => {
        this.setState({foodCourtInformation: response});
      })
      .catch(error => {
        console.log(error);
      });
  }
  render() {
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
