import * as React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import StarRating from 'react-native-star-rating';

class OrderSuccessScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
    };
  }

  componentDidMount = async () => {
    const cart = JSON.parse(await AsyncStorage.getItem('cart'));
    const customer = JSON.parse(await AsyncStorage.getItem(''));
    this.setState({cart: cart});
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Congratulations!</Text>
        <FontAwesome5 name="check-circle" solid style={styles.icon} />
        <Text
          style={{
            fontSize: 18,
            width: '60%',
            textAlign: 'center',
            marginBottom: 12,
          }}>
          Thank you for using Comfy Meal
        </Text>
        <Text
          style={{
            fontSize: 18,
            width: '70%',
            textAlign: 'center',
            marginBottom: 12,
          }}>
          How would you rate our food?
        </Text>
        <FlatList
          style={styles.ratingContainer}
          data={this.state.cart}
          showsVerticalScrollIndicator={false}
          numColumns={1}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            return (
              <View style={styles.food}>
                <Text>{item.foodName}</Text>
                <StarRating
                  halfStarEnabled
                  starSize={20}
                  fullStarColor="#ffdd00"
                  halfStarColor="#ffdd00"
                  emptyStarColor="#ffdd00"
                  containerStyle={styles.stars}
                  selectedStar={rating => {
                    fetch(
                      `http://foodcout.ap-southeast-1.elasticbeanstalk.com/customer/customer/{}/food/${
                        item.id
                      }?star=${rating}`,
                      {
                        method: 'POST',
                        headers: {
                          Accept: 'application/json',
                          'Content-Type': 'application/json',
                        },
                      },
                    );
                    console.log(rating);
                  }}
                />
              </View>
            );
          }}
        />

        <TouchableOpacity
          style={styles.btnConfirm}
          onPress={() => this.props.navigation.navigate('CustomerHome')}>
          <Text
            style={{
              textAlign: 'center',
              color: 'white',
              fontSize: 18,
            }}>
            BACK TO HOME SCREEN
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 24,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#556470',
    fontSize: 30,
    marginBottom: 24,
  },
  icon: {
    color: '#65c97b',
    fontSize: 50,
    paddingBottom: 24,
  },
  btnConfirm: {
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#4a6572',
    width: '70%',
    height: 44,
    borderRadius: 22,
    marginBottom: 24,
    marginTop: 12,
  },
  ratingContainer: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#e4e4e4',
    width: '80%',
    paddingHorizontal: 8,
  },
  food: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e4',
  },
  stars: {
    justifyContent: 'flex-start',
    marginTop: 2,
    marginRight: 6,
  },
});

export default OrderSuccessScreen;
