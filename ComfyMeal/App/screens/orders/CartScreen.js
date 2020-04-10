import * as React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  BackHandler,
  Image,
  Modal,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';
import NumberFormat from 'react-number-format';
import {EventRegister} from 'react-native-event-listeners';

class CartScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
      itemList: [],
      cartDto: {walletId: 0, cartItems: []},
      fsName: [],
      totalPrice: 0,
      wallet: {},
      visible: false,
    };
  }

  addToCart = async food => {
    console.log('add pressed');
    const currentCart = this.state.cart;
    for (let i = 0; i < currentCart.length; i++) {
      if (currentCart[i].id === food.id) {
        currentCart[i].quantity += 1;
        break;
      }
    }
    this.setState({cart: currentCart});
    await AsyncStorage.setItem('cart', JSON.stringify(this.state.cart));
    this.calculateTotal();
  };

  removeFromCart = async food => {
    console.log('remove pressed');
    const currentCart = this.state.cart;
    for (let i = 0; i < currentCart.length; i++) {
      if (currentCart[i].id === food.id) {
        currentCart[i].quantity -= 1;
        if (currentCart[i].quantity === 0) {
          currentCart.splice(i, 1);
        }
      }
    }
    this.setState({cart: currentCart});
    await AsyncStorage.setItem('cart', JSON.stringify(this.state.cart));
    this.calculateTotal();
  };

  calculateTotal = () => {
    const tmpCart = this.state.cart;
    var total = 0;
    for (let i = 0; i < tmpCart.length; i++) {
      tmpCart[i].retailPrice
        ? (total += tmpCart[i].retailPrice * tmpCart[i].quantity)
        : (total += tmpCart[i].originPrice * tmpCart[i].quantity);
    }
    this.setState({totalPrice: total});
  };

  mapToShow = () => {
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

  order = async () => {
    if (this.state.totalPrice > this.state.wallet.walletBalance) {
      this.setState({visible: true});
    } else {
      this.state.cart.map((c, index) => {
        this.state.itemList.push({
          foodId: c.id,
          quantity: c.quantity,
          note: '',
        });
      });

      console.log('cart', this.state.cart);
      console.log('mapped', this.state.itemList);

      this.state.cartDto.cartItems = this.state.itemList;
      console.log(this.state.cartDto);
      fetch('http://foodcout.ap-southeast-1.elasticbeanstalk.com/cart/order', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state.cartDto),
      });

      // ToastAndroid.showWithGravity(
      //   'Your order has been purchased successfully!',
      //   ToastAndroid.LONG,
      //   ToastAndroid.CENTER,
      // );
      this.props.navigation.navigate('OrderSuccess');
    }
  };

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
    this.setState({wallet: wallet});
    this.mapToShow();
    this.calculateTotal();
  };

  componentWillUnmount = () => {
    EventRegister.emit('updateCart');
  };

  render() {
    console.log('cart', this.state.cart);
    return (
      <>
        <View style={styles.container}>
          <View style={styles.tabBar}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
          </View>

          <ScrollView
            style={{paddingHorizontal: 12, paddingTop: 16, paddingBottom: 60}}>
            <FlatList
              scrollEnabled={false}
              style={{backgroundColor: 'white', borderRadius: 6}}
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
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginBottom: 12,
                          }}>
                          {item.foodName}
                        </Text>
                        <View>
                          <NumberFormat
                            value={item.retailPrice || item.originPrice}
                            thousandSeparator={true}
                            defaultValue={0}
                            suffix={'VND'}
                            displayType={'text'}
                            renderText={value => <Text>{value}</Text>}
                          />
                        </View>
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
                  </View>
                );
              }}
            />
            <View style={styles.section}>
              <Text>TOTAL</Text>
              <NumberFormat
                value={this.state.totalPrice}
                thousandSeparator={true}
                defaultValue={0}
                suffix="VND"
                displayType="text"
                renderText={value => (
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 20,
                    }}>
                    {value}
                  </Text>
                )}
              />
            </View>

            <TouchableOpacity onPress={this.order} style={styles.btnConfirm}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontSize: 18,
                }}>
                CONFIRM ORDER
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <Modal
          transparent
          animationType="fade"
          onRequestClose={() => {
            this.setState({visible: false});
          }}
          visible={this.state.visible}>
          <View style={styles.modal}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}>
              <AntDesign
                name="exclamationcircleo"
                style={{color: 'red', marginRight: 12, fontSize: 18}}
              />
              <Text style={{fontWeight: 'bold', fontSize: 18}}>
                Order Failed
              </Text>
            </View>
            <Text style={{textAlign: 'center'}}>
              You don't have enough cash in your wallet. Please contact the
              cashier for more details.
            </Text>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => {
                this.setState({visible: false});
              }}>
              <Text
                style={{
                  color: '#0ec648',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 18,
                }}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ee7739',
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 20,
    marginLeft: 24,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 6,
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 24,
    padding: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodCard: {
    borderBottomWidth: 1,
    borderColor: '#e4e4e4',
    paddingVertical: 8,
    marginTop: 10,
    paddingLeft: 8,
    paddingRight: 30,
    flexDirection: 'row',
  },
  foodImg: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  btnConfirm: {
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#4a6572',
    width: '70%',
    height: 44,
    borderRadius: 22,
    marginBottom: 36,
  },
  itemQuantity: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    width: '30%',
    justifyContent: 'space-between',
  },
  btnAddRemove: {
    fontSize: 22,
    color: '#4a6572',
  },
  modal: {
    marginHorizontal: 20,
    marginVertical: 200,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalBtn: {
    alignSelf: 'center',
    borderRadius: 4,
    paddingHorizontal: 24,
    marginTop: 8,
    width: '30%',
  },
});

export default CartScreen;
