import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  BackHandler,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import StarRating from 'react-native-star-rating';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const categories = [
  {name: 'FastFood'},
  {name: 'Drink'},
  {name: 'Grill & Hot Pot'},
  {name: 'Rice'},
  {name: 'Sushi'},
  {name: 'Dimsum'},
  {name: 'Salad'},
];

const foods = [
  {
    name: 'Fried Potato',
    price: 20000,
    description:
      'Fresh potato from New Zealand, fried with non-reused oil, gives you the best food quality.',
    type: categories[0],
    image: require('../../../assets/kfc.png'),
    rating: 4.8,
  },
  {
    name: 'Fried Potato',
    price: 20000,
    description:
      'Fresh potato from New Zealand, fried with non-reused oil, gives you the best food quality.',
    type: categories[0],
    image: require('../../../assets/kfc.png'),
    rating: 4.8,
  },
  {
    name: 'Fried Potato',
    price: 20000,
    description:
      'Fresh potato from New Zealand, fried with non-reused oil, gives you the best food quality.',
    type: categories[0],
    image: require('../../../assets/kfc.png'),
    rating: 4.8,
  },
  {
    name: 'Fried Potato',
    price: 20000,
    description:
      'Fresh potato from New Zealand, fried with non-reused oil, gives you the best food quality.',
    type: categories[0],
    image: require('../../../assets/kfc.png'),
    rating: 4.8,
  },
  {
    name: 'Fried Potato',
    price: 20000,
    description:
      'Fresh potato from New Zealand, fried with non-reused oil, gives you the best food quality.',
    type: categories[0],
    image: require('../../../assets/kfc.png'),
    rating: 4.8,
  },
  {
    name: 'Fried Potato',
    price: 20000,
    description:
      'Fresh potato from New Zealand, fried with non-reused oil, gives you the best food quality.',
    type: categories[0],
    image: require('../../../assets/kfc.png'),
    rating: 4.8,
  },
  {
    name: 'Fried Potato',
    price: 20000,
    description:
      'Fresh potato from New Zealand, fried with non-reused oil, gives you the best food quality.',
    type: categories[0],
    image: require('../../../assets/kfc.png'),
    rating: 4.8,
  },
  {
    name: 'Fried Potato',
    price: 20000,
    description:
      'Fresh potato from New Zealand, fried with non-reused oil, gives you the best food quality.',
    type: categories[0],
    image: require('../../../assets/kfc.png'),
    rating: 4.8,
  },
];

class StallDetailScreen extends React.Component {
  componentDidMount = () => {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });
  };

  addToCart = () => {};

  render() {
    const {navigation} = this.props;
    console.log('foodstall', navigation.state.params.foodstall);
    return (
      <>
        <Image
          source={navigation.state.params.foodstall.image}
          style={styles.stallImage}
        />
        <View style={styles.container}>
          {/* <Text>{JSON.stringify(navigation.state.params)}</Text> */}
          <Text style={styles.name}>
            {navigation.state.params.foodstall.name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 6,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.type}>
              {navigation.state.params.foodstall.type.name}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <StarRating
                disabled
                halfStarEnabled
                starSize={15}
                fullStarColor="#ffdd00"
                halfStarColor="#ffdd00"
                emptyStarColor="#ffdd00"
                rating={navigation.state.params.foodstall.rating}
                containerStyle={styles.stars}
              />
              <Text>{navigation.state.params.foodstall.rating}</Text>
            </View>
          </View>
          <Text
            style={{fontStyle: 'italic', color: '#808080', paddingVertical: 8}}>
            {navigation.state.params.foodstall.description}
          </Text>
          <FlatList
            data={foods}
            showsVerticalScrollIndicator={false}
            numColumns={1}
            renderItem={({item, index}) => (
              <TouchableOpacity
                key={index}
                onPress={() => this.addToCart}
                style={styles.foodCard}>
                <Image source={item.image} style={styles.foodImg} />
                <View>
                  <Text
                    style={{fontSize: 20, fontWeight: 'bold', marginBottom: 4}}>
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      color: '#808080',
                      fontWeight: '200',
                      marginBottom: 4,
                    }}>
                    {item.description}
                  </Text>
                  <Text>{item.price}đ</Text>
                </View>
                <FontAwesome5 name="plus-circle" style={styles.btnAdd} />
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <TouchableOpacity style={styles.btnCart}>
          <FontAwesome5
            name="shopping-cart"
            color="white"
            style={{fontSize: 20}}
          />
        </TouchableOpacity>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  stallImage: {width: '100%', height: 150},
  name: {fontSize: 25, textAlign: 'center', fontWeight: 'bold'},
  stars: {
    justifyContent: 'flex-start',
    marginTop: 2,
    marginRight: 6,
  },
  type: {
    borderWidth: 1,
    borderColor: '#ee7739',
    borderRadius: 50,
    marginRight: 8,
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    color: '#ee7739',
  },
  foodCard: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#dadada',
    paddingVertical: 12,
  },
  foodImg: {
    width: 100,
    height: 100,
    marginRight: 12,
  },
  btnAdd: {
    position: 'absolute',
    bottom: 12,
    right: 0,
    fontSize: 22,
    color: '#4a6572',
  },
  btnCart: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ee7739',
    position: 'absolute',
    bottom: 12,
    left: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StallDetailScreen;
