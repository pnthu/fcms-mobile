import * as React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  BackHandler,
  Image,
} from 'react-native';
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

const data = [
  {
    fsId: 'fs1',
    foods: [
      {
        name: 'Fried Potato',
        price: 20000,
        description:
          'Fresh potato from New Zealand, fried with non-reused oil, gives you the best food quality.',
        type: categories[0],
        image: require('../../../assets/kfc.png'),
        rating: 4.8,
        id: 'food1',
        quantity: 2,
      },
      {
        name: 'Fried Potato',
        price: 20000,
        description:
          'Fresh potato from New Zealand, fried with non-reused oil, gives you the best food quality.',
        type: categories[0],
        image: require('../../../assets/kfc.png'),
        rating: 4.8,
        id: 'food2',
        quantity: 3,
      },
    ],
  },
  {
    fsId: 'fs2',
    foods: [
      {
        name: 'Fried Potato',
        price: 20000,
        description:
          'Fresh potato from New Zealand, fried with non-reused oil, gives you the best food quality.',
        type: categories[0],
        image: require('../../../assets/kfc.png'),
        rating: 4.8,
        id: 'food3',
        quantity: 1,
        fsId: 'fs1',
      },
      {
        name: 'Fried Potato',
        price: 20000,
        description:
          'Fresh potato from New Zealand, fried with non-reused oil, gives you the best food quality.',
        type: categories[0],
        image: require('../../../assets/kfc.png'),
        rating: 4.8,
        id: 'food4',
        quantity: 4,
        fsId: 'fs2',
      },
    ],
  },
];

class CartScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
    };
  }

  // mapFsName = () => {
  //   for (let i = 0; i < data.length; i++) {
  //     if (this.state.cart.length === 0) {
  //       this.state.cart.push(data[i].fsId);
  //     } else {
  //       for (let j = 0; j < this.state.cart.length; j++) {
  //         if (this.state.cart[j].fsId === data[i].fsId) {
  //           break;
  //         }
  //       }
  //       this.state.cart.push(data[i].fsId)
  //     }
  //   }
  // }

  componentDidMount = async () => {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.tabBar}>
          <FontAwesome5
            name="chevron-left"
            color="white"
            size={24}
            onPress={() => {
              this.props.navigation.goBack();
            }}
          />
          <Text style={styles.title}>My Cart</Text>
        </View>

        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          numColumns={1}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            return (
              <View key={index}>
                <Text>{item.fsId}</Text>
                <FlatList
                  data={item.foods}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                  numColumns={1}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => {
                    return (
                      <View style={styles.foodCard}>
                        <Image source={item.image} style={styles.foodImg} />
                        <View>
                          <Text
                            style={{
                              fontSize: 20,
                              fontWeight: 'bold',
                              marginBottom: 4,
                            }}>
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
                        <FontAwesome5
                          name="plus-circle"
                          style={styles.btnAdd}
                        />
                      </View>
                    );
                  }}
                />
              </View>
            );
          }}
        />
        <TouchableOpacity style={styles.btnConfirm}>
          <Text
            style={{
              textAlign: 'center',
              color: 'white',
              fontSize: 18,
            }}>
            CONFIRM ORDER
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
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ee7739',
    height: 70,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 20,
    marginLeft: 24,
  },
  header: {},
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
});

export default CartScreen;
