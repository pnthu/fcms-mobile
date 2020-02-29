import * as React from 'react';
import {StyleSheet, View, Image, Text, ScrollView} from 'react-native';

const fcInfo = {
  name: 'The Amazing Foodcourt',
  address: 'Đường D1 Khu Công nghệ cao, P.Long Thạnh Mỹ, Q.9, TP.HCM',
  description:
    'This is a description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat elit maximus, cursus ante a, dignissim odio. Nullam gravida neque id arcu egestas tempus. Aenean nunc quam, laoreet in ornare eu, lacinia ac neque. Sed imperdiet ultrices fringilla. Aliquam sed diam magna. Maecenas ullamcorper nibh nec egestas commodo. Duis accumsan ut nisi eleifend mollis.',
};

class AboutScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('../../../assets/food.jpg')}
          style={styles.fcImage}
        />
        <ScrollView
          style={styles.infoContainer}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>ABOUT US</Text>
          <Text style={{fontSize: 18}}>
            We are{' '}
            <Text style={{fontWeight: 'bold'}}>
              {fcInfo.name}! {'\n\n'}
            </Text>
            Located at{' '}
            <Text style={{fontWeight: 'bold'}}>{fcInfo.address}</Text>, {'\n\n'}
            {fcInfo.description}
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
