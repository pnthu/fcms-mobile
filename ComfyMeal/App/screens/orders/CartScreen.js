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
import AsyncStorage from '@react-native-community/async-storage';

class CartScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
      itemList: [],
      cartDto: {walletId: 0, cartItems: []},
      fsName: [],
    };
  }

  // addToCart = async food => {
  //   if (this.state.cart === null) {
  //     ToastAndroid.show('Please login to order our food.', ToastAndroid.SHORT);
  //     this.props.navigation.navigate('ProfileTab', {
  //       foodstall: this.props.navigation.state.params.foodstall,
  //     });
  //   } else {
  //     const currentCart = this.state.cart;
  //     if (currentCart instanceof Array) {
  //       currentCart.push(food);
  //       this.setState({cart: currentCart});
  //       await AsyncStorage.setItem('cart', JSON.stringify(this.state.cart));
  //     }
  //     const currentMenu = this.state.foodStallMenu;
  //     for (let i = 0; i < currentMenu.length; i++) {
  //       if (currentMenu[i].id === food.id) {
  //         currentMenu[i].quantity += 1;
  //         break;
  //       }
  //     }
  //     this.setState({foodStallMenu: currentMenu});
  //   }
  // };

  // removeFromCart = async food => {
  //   const currentCart = this.state.cart;
  //   if (currentCart instanceof Array) {
  //     for (let i = 0; i < currentCart.length; i++) {
  //       if (currentCart[i].id === food.id) {
  //         currentCart.splice(i, 1);
  //         break;
  //       }
  //     }
  //     this.setState({cart: currentCart});
  //     await AsyncStorage.setItem('cart', JSON.stringify(this.state.cart));
  //   }
  //   const currentMenu = this.state.foodStallMenu;
  //   for (let i = 0; i < currentMenu.length; i++) {
  //     if (currentMenu[i].id === food.id) {
  //       currentMenu[i].quantity -= 1;
  //       break;
  //     }
  //   }
  //   this.setState({foodStallMenu: currentMenu});
  // };

  mapToShow = () => {
    //tach ra
    const copyCart = this.state.cart;
    var mappedCart = [];
    for (let i = 0; i < copyCart.length; i++) {
      if (mappedCart.length === 0) {
        copyCart[i].quantity = 1;
        mappedCart.push(copyCart[i]);
      } else {
        for (let j = 0; j < mappedCart.length; j++) {
          if (copyCart[i].id === mappedCart[j].id) {
            mappedCart[j].quantity += 1;
            break;
          } else if (j === mappedCart.length - 1) {
            copyCart[i].quantity = 1;
            mappedCart.push(copyCart[i]);
            break;
          }
        }
      }
    }
    this.setState({cart: mappedCart});
  };

  mapToOrder = () => {};

  componentDidMount = async () => {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });
    const response = await AsyncStorage.getItem('cart');
    const cart = JSON.parse(response);
    this.setState({cart: cart});
    const wallet = JSON.parse(await AsyncStorage.getItem('customer-wallet'));
    this.state.cartDto.walletId = wallet.walletId;
    this.mapToShow();
  };

  render() {
    console.log('cart', this.state.cart);
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
          data={this.state.cart}
          showsVerticalScrollIndicator={false}
          numColumns={1}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            return (
              <View key={index}>
                <View style={styles.foodCard}>
                  <Image
                    source={{uri: item.foodImage}}
                    style={styles.foodImg}
                  />
                  <View>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginBottom: 4,
                      }}>
                      {item.foodName}
                    </Text>
                    <Text
                      style={{
                        color: '#808080',
                        fontWeight: '200',
                        marginBottom: 4,
                      }}>
                      {item.foodDescription}
                    </Text>
                    {item.retailPrice == 0 ? (
                      <Text>{item.originPrice}đ</Text>
                    ) : (
                      <>
                        <Text
                          style={{
                            textDecorationLine: 'line-through',
                            textDecorationStyle: 'solid',
                          }}>
                          {item.originPrice}đ
                        </Text>
                        <Text
                          style={{
                            color: 'red',
                          }}>
                          {item.retailPrice}đ
                        </Text>
                      </>
                    )}
                  </View>
                  <View style={styles.itemQuantity}>
                    {item.quantity === 0 || (
                      <>
                        <FontAwesome5
                          name="minus-circle"
                          onPress={() => this.removeFromCart(item)}
                          style={styles.btnAddRemove}
                        />
                        <Text style={{fontSize: 17}}>{item.quantity}</Text>
                      </>
                    )}
                    <FontAwesome5
                      name="plus-circle"
                      onPress={() => this.addToCart(item)}
                      style={styles.btnAddRemove}
                    />
                  </View>
                </View>
                {/* <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}>
                  {item.foodStall.foodStallName}
                </Text> */}
                {/* <FlatList
                  data={item}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                  numColumns={1}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => {
                    return (
                      <View style={styles.foodCard}>
                  <Image
                    source={{uri: item.food.foodImage}}
                    style={styles.foodImg}
                  />
                  <View>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginBottom: 4,
                      }}>
                      {item.food.foodName}
                    </Text>
                    <Text
                      style={{
                        color: '#808080',
                        fontWeight: '200',
                        marginBottom: 4,
                      }}>
                      {item.foodDescription}
                    </Text>
                    {item.food.retailPrice == 0 ? (
                      <Text>{item.food.originPrice}đ</Text>
                    ) : (
                      <>
                        <Text
                          style={{
                            textDecorationLine: 'line-through',
                            textDecorationStyle: 'solid',
                          }}>
                          {item.food.originPrice}đ
                        </Text>
                        <Text
                          style={{
                            color: 'red',
                          }}>
                          {item.food.retailPrice}đ
                        </Text>
                      </>
                    )}
                  </View>
                  <FontAwesome5 name="plus-circle" style={styles.btnAdd} />
                </View>
                    );
                  }}
                /> */}
              </View>
            );
          }}
        />
        <TouchableOpacity
          onPress={() => {
            this.state.cart.map((c, index) => {
              this.state.itemList.push({
                foodId: c.id,
                quantity: c.quantity,
                note: '',
              });
            });

            this.state.cartDto.cartItems = this.state.itemList;
            console.log(this.state.cartDto);
            fetch(
              'http://foodcout.ap-southeast-1.elasticbeanstalk.com/cart/order',
              {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.state.cartDto),
              },
            );

            // AsyncStorage.setItem(
            //   'current-order',
            //   JSON.stringify(this.state.cart),
            // );
            this.props.navigation.navigate('OrderSuccess');
          }}
          style={styles.btnConfirm}>
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
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#e4e4e4',
    paddingVertical: 4,
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 8,
    paddingRight: 30,
    flexDirection: 'row',
    // borderTopWidth: 1,
    // borderColor: '#dadada',
    // paddingVertical: 12,
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
  itemQuantity: {
    position: 'absolute',
    bottom: 12,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
    justifyContent: 'space-between',
  },
  btnAddRemove: {
    fontSize: 20,
    color: '#4a6572',
  },
});

export default CartScreen;
