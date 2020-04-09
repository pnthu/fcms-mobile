import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  RefreshControl,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {Tabs, Tab, Accordion} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';
import NumberFormat from 'react-number-format';

const tags = {
  QUEUE: (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: '#e0ebfd',
        alignSelf: 'center',
      }}>
      <Text style={{color: '#467df1'}}>Queue</Text>
    </View>
  ),
  INPROGRESS: (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: '#447def',
        alignSelf: 'center',
      }}>
      <Text style={{color: 'white'}}>Preparing</Text>
    </View>
  ),
  READY: (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: '#d8f6e2',
        alignSelf: 'center',
      }}>
      <Text style={{color: '#1f9946'}}>Ready</Text>
    </View>
  ),
  DELIVERY: (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: '#2ad25f',
        alignSelf: 'center',
      }}>
      <Text style={{color: 'white'}}>Deliveried</Text>
    </View>
  ),
  CANCEL: (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: '#2ad25f',
        alignSelf: 'center',
      }}>
      <Text style={{color: 'red'}}>Cancelled</Text>
    </View>
  ),
};

class OrderScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shoppingCart: [],
      historyOrder: [],
      historyOrderDetail: [],
      walletId: 0,
      currentCart: [],
      visible: false,
      loading: true,
      deleteItemId: 0,
    };
  }

  componentDidMount = async () => {
    this.setState({loading: true});
    const currentShoppingCart = await AsyncStorage.getItem('cart');
    const currentOrder = JSON.parse(
      await AsyncStorage.getItem('current-order'),
    );
    this.setState({currentOrder: currentOrder});

    const customerWallet = JSON.parse(
      await AsyncStorage.getItem('customer-wallet'),
    );
    this.setState({
      walletId: customerWallet.walletId,
      shoppingCart: currentShoppingCart,
    });

    fetch(
      'http://foodcout.ap-southeast-1.elasticbeanstalk.com/cart/' +
        this.state.walletId +
        '/history',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(Response => Response.json())
      .then(history => {
        this.setState({historyOrder: history});
      })
      .catch(error => {
        console.log(error);
      });

    fetch(
      `http://foodcout.ap-southeast-1.elasticbeanstalk.com/cart/${
        this.state.walletId
      }/in-progress/detail`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(Response => Response.json())
      .then(currentOrder => {
        this.setState({currentCart: currentOrder});
      })
      .catch(error => {
        console.log(error);
      });
    this.setState({loading: false});
  };

  _renderHeader = (item, expanded) => {
    return (
      <View
        style={{
          borderWidth: 1,
          borderRadius: 10,
          borderColor: '#e4e4e4',
          paddingVertical: 4,
          marginTop: 5,
          marginBottom: 5,
          paddingLeft: 8,
          paddingRight: 10,
        }}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontWeight: '600', fontSize: 14}}>
            Purchase Date: {item.purchaseDate}
          </Text>
          <NumberFormat
            style={{marginRight: 'auto'}}
            value={item.totalPrice}
            thousandSeparator={true}
            defaultValue={0}
            suffix={'VND'}
            displayType={'text'}
            renderText={value => (
              <Text
                style={{fontWeight: '600', marginLeft: 'auto', fontSize: 14}}>
                Total Price: {value}
              </Text>
            )}
          />
        </View>
        {item.cartStatus === 'CANCEL' && (
          <View style={{flexDirection: 'row'}}>
            <FontAwesome
              name="warning"
              style={{
                fontSize: 18,
                color: 'red',
                marginRight: 6,
              }}
            />
            <Text
              style={{
                marginRight: 'auto',
                marginBottom: 4,
                fontSize: 14,
                color: 'red',
              }}>
              Cancelled
            </Text>
            {expanded ? (
              <FontAwesome5 style={{fontSize: 18}} name="angle-down" />
            ) : (
              <FontAwesome5 style={{fontSize: 18}} name="angle-up" />
            )}
          </View>
        )}
        {item.cartStatus === 'DONE' && (
          <View style={{flexDirection: 'row'}}>
            <FontAwesome5
              name="check-circle"
              solid
              style={{
                fontSize: 18,
                color: 'green',
                marginRight: 6,
              }}
            />
            <Text
              style={{
                marginRight: 'auto',
                marginBottom: 4,
                fontSize: 14,
                color: 'green',
              }}>
              Done
            </Text>
            {expanded ? (
              <FontAwesome5 style={{fontSize: 18}} name="angle-down" />
            ) : (
              <FontAwesome5 style={{fontSize: 18}} name="angle-up" />
            )}
          </View>
        )}
        {item.cartStatus === 'INPROGRESS' && (
          <View style={{flexDirection: 'row'}}>
            <FontAwesome5
              name="check-circle"
              solid
              style={{
                fontSize: 18,
                color: 'blue',
                marginRight: 6,
              }}
            />
            <Text
              style={{
                marginRight: 'auto',
                marginBottom: 4,
                fontSize: 14,
                color: 'blue',
              }}>
              Preparing
            </Text>
            {expanded ? (
              <FontAwesome5 style={{fontSize: 18}} name="angle-down" />
            ) : (
              <FontAwesome5 style={{fontSize: 18}} name="angle-up" />
            )}
          </View>
        )}
      </View>
    );
  };

  _renderContent = item => {
    fetch(
      'http://foodcout.ap-southeast-1.elasticbeanstalk.com/cart/detail/' +
        item.id,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(Response => Response.json())
      .then(historyDetail => {
        this.setState({historyOrderDetail: historyDetail});
      })
      .catch(error => {
        console.log(error);
      });
    console.log(this.state.historyOrderDetail);
    return (
      <>
        {this.state.historyOrderDetail instanceof Array &&
          this.state.historyOrderDetail.map((detail, index) => {
            return (
              <View
                key={index}
                style={{
                  borderWidth: 1,
                  borderRadius: 15,
                  borderColor: '#e4e4e4',
                  paddingVertical: 4,
                  paddingLeft: 25,
                  paddingRight: 30,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <NumberFormat
                    style={{marginRight: 'auto'}}
                    value={detail.purchasedPrice}
                    thousandSeparator={true}
                    defaultValue={0}
                    suffix={'VND'}
                    displayType={'text'}
                    renderText={value => (
                      <Text style={{fontSize: 13, fontWeight: '600'}}>
                        Total Price: {value}
                      </Text>
                    )}
                  />
                  <Text
                    style={{
                      marginLeft: 'auto',
                      fontSize: 13,
                      fontWeight: '600',
                    }}>
                    Quantity: {detail.quantity}
                  </Text>
                </View>
                <Text style={{fontSize: 13, fontWeight: '600'}}>
                  Purchase: {detail.foodName} at {detail.foodStallName}
                </Text>
              </View>
            );
          })}
      </>
    );
  };

  render() {
    console.log('cart', this.state.currentCart);
    return (
      <>
        {this.state.loading === true ? (
          <View style={(styles.loadingHorizontal, styles.loadingContainer)}>
            <ActivityIndicator
              animating={this.state.loading}
              size="large"
              color="#3d66cf"
            />
          </View>
        ) : (
          <>
            <View style={styles.container}>
              <Tabs
                tabBarUnderlineStyle={{backgroundColor: 'white'}}
                tabBarInactiveTextColor="white">
                <Tab
                  heading="Current Order"
                  tabStyle={{backgroundColor: '#ee7739'}}
                  activeTabStyle={{backgroundColor: '#ee7739'}}
                  activeTextStyle={{fontWeight: 'bold', color: 'white'}}>
                  <FlatList
                    style={styles.tabContainer}
                    data={this.state.currentCart}
                    showsVerticalScrollIndicator={false}
                    numColumns={1}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => {
                      return (
                        <View key={index}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <FontAwesome5
                              name="store"
                              style={{fontSize: 18, marginRight: 12}}
                            />
                            <Text
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={{fontSize: 18, fontWeight: 'bold'}}>
                              {item.foodStallName}
                            </Text>
                          </View>
                          <FlatList
                            scrollEnabled={false}
                            data={item.cartItems}
                            showsVerticalScrollIndicator={false}
                            numColumns={1}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item, index}) => {
                              return (
                                <View
                                  key={index}
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    style={{
                                      width: '55%',
                                      marginLeft: 12,
                                    }}>
                                    {item.foodName}
                                  </Text>
                                  <Text style={{width: '5%'}}>
                                    {item.quantity}
                                  </Text>
                                  {tags[item.foodStatus]}
                                  <TouchableOpacity
                                    style={{
                                      backgroundColor: '#fdf3f2',
                                      width: 50,
                                      height: 50,
                                    }}
                                    onPress={() => {
                                      this.setState({deleteItemId: item.id});
                                      this.setState({visible: true});
                                    }}>
                                    <FontAwesome5
                                      name="trash-alt"
                                      color="#e2574c"
                                      solid
                                    />
                                  </TouchableOpacity>
                                </View>
                              );
                            }}
                          />
                        </View>
                      );
                    }}
                  />
                </Tab>
                <Tab
                  heading="Order History"
                  tabStyle={{backgroundColor: '#ee7739'}}
                  activeTabStyle={{backgroundColor: '#ee7739'}}
                  activeTextStyle={{fontWeight: 'bold', color: 'white'}}>
                  <Accordion
                    dataArray={this.state.historyOrder}
                    animation={true}
                    expanded={true}
                    renderHeader={this._renderHeader}
                    renderContent={this._renderContent}
                  />
                </Tab>
              </Tabs>
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
                    Cancel Cart Item
                  </Text>
                </View>
                <Text style={{textAlign: 'center'}}>
                  Do you really want to cancel this cart item?
                </Text>
                <TouchableOpacity
                  style={styles.modalBtn}
                  onPress={() => {
                    console.log(this.state.deleteItemId + ' DELETED');
                    fetch(
                      'http://foodcout.ap-southeast-1.elasticbeanstalk.com/cart/update?cartItemId=' +
                        this.state.deleteItemId +
                        '&status=CANCEL',
                      {
                        method: 'PUT',
                        headers: {
                          Accept: 'application/json',
                          'Content-Type': 'application/json',
                        },
                      },
                    ).catch(error => {
                      console.log(error);
                    });
                    // this.setState({loading: true});
                    this.setState({visible: false});
                    ToastAndroid.showWithGravity(
                      'Your food has been cancelled successfully',
                      ToastAndroid.SHORT,
                      ToastAndroid.CENTER,
                    );
                  }}>
                  <Text
                    style={{
                      color: '#0ec648',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: 18,
                    }}>
                    Yes
                  </Text>
                </TouchableOpacity>
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
                      color: 'red',
                      fontSize: 18,
                    }}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  loadingHorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  tabContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 36,
  },
  card: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#e4e4e4',
    flexDirection: 'row',
    paddingVertical: 4,
    paddingLeft: 8,
    paddingRight: 30,
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
    color: '#5bb8ea',
    marginRight: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
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

export default OrderScreen;
