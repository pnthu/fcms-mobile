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
  ScrollView,
} from 'react-native';
import {Tabs, Tab, Accordion} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import NumberFormat from 'react-number-format';

const tags = {
  QUEUE: (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'center',
        backgroundColor: '#e0ebfd',
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
        alignSelf: 'center',
        backgroundColor: '#447def',
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
        alignSelf: 'center',
        backgroundColor: '#d8f6e2',
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
        alignSelf: 'center',
        backgroundColor: '#2ad25f',
      }}>
      <Text style={{color: 'white'}}>Delivered</Text>
    </View>
  ),
  CANCEL: (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: '#fdf3f2',
        alignSelf: 'center',
      }}>
      <Text style={{color: '#dc3e31'}}>Cancelled</Text>
    </View>
  ),
};

const reasons = [
  {reason: 'I want to change other foods.', selected: false},
  {reason: 'I am full now.', selected: false},
  {reason: "I want to change food's quantity.", selected: false},
  {reason: 'I have waited for too long.', selected: false},
  {reason: 'Other reasons.', selected: false},
];

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
      infoVisible: false,
      loading: true,
      deleteItemId: 0,
      selectedItemReason: '',
      reason: '',
      refreshCurrent: false,
      refreshHistory: false,
      reasonsData: [],
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
      reasonsData: reasons,
    });
    await this.fetchCurrentOrder();
    await this.fetchHistoryOrder();
    this.setState({loading: false});
  };

  fetchCurrentOrder = () => {
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
        console.log('current', JSON.stringify(this.state.currentCart));
      })
      .catch(error => {
        console.log(error);
      });
  };

  fetchHistoryOrder = () => {
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
              name="close"
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
            var reason = '';
            if (detail.reason != null) {
              if (detail.reason.search('Restaurant: ') != -1) {
                reason +=
                  detail.foodStallName +
                  ' has ' +
                  detail.reason.slice(12).toLowerCase();
              } else if (detail.reason.search('Customer: ') != -1) {
                reason +=
                  'You has cancelled because ' +
                  detail.reason
                    .slice(10)
                    .replace('I', 'you')
                    .toLowerCase();
              }
            }
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
                {detail.reason != null && (
                  <>
                    <Text style={{color: 'red'}}>This has been CANCELLED.</Text>
                    <Text>Reason: {reason}</Text>
                  </>
                )}
                <Text style={{fontSize: 13, fontWeight: '600'}}>
                  Purchase: {detail.foodName} at {detail.foodStallName}
                </Text>
              </View>
            );
          })}
      </>
    );
  };

  onRefreshCurrent = async () => {
    this.setState({refreshCurrent: true});
    await this.fetchCurrentOrder();
    this.setState({refreshCurrent: false});
  };

  onRefreshHistory = async () => {
    this.setState({refreshHistory: true});
    await this.fetchHistoryOrder();
    this.setState({refreshHistory: false});
  };

  setSelectedReason = index => {
    var tmpData = this.state.reasonsData;
    for (let i = 0; i < tmpData.length; i++) {
      tmpData[i].selected = false;
    }
    tmpData[index].selected = true;
    this.setState({reason: tmpData[index].reason});
    this.setState({reasonsData: tmpData});
  };

  replaceString = string => {
    var result = '';
    const newStr = new String(string);
    if (newStr instanceof String) {
      console.log('here', string);
      if (newStr.includes('Restaurant: ')) {
        result = newStr.replace('Restaurant: Sold', 'the restaurant has sold');
      } else if (newStr.includes('Customer: I am')) {
        result = newStr.replace('Customer: I am', 'you are');
      } else if (newStr.includes('Customer: I')) {
        result = newStr.replace('Customer: I', 'You');
      } else if (newStr.includes('Other reasons.')) {
        result = newStr.replace('Other reasons.', 'of other reason.');
      }
    }
    console.log('result', result);
    this.setState({selectedItemReason: result});
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
                    refreshControl={
                      <RefreshControl
                        refreshing={this.state.refreshCurrent}
                        onRefresh={this.onRefreshCurrent}
                      />
                    }
                    style={styles.tabContainer}
                    data={this.state.currentCart}
                    showsVerticalScrollIndicator={false}
                    numColumns={1}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => {
                      return (
                        <View
                          key={index}
                          style={{
                            marginBottom: 12,
                          }}>
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
                                <>
                                  <View
                                    key={index}
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      marginBottom: 8,
                                    }}>
                                    <Text
                                      numberOfLines={1}
                                      ellipsizeMode="tail"
                                      style={{
                                        width: '50%',
                                        marginLeft: 12,
                                      }}>
                                      {item.foodName}
                                    </Text>
                                    <Text style={{width: '8%'}}>
                                      {item.quantity}
                                    </Text>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        width: '39%',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                      }}>
                                      {tags[item.foodStatus]}
                                      {item.foodStatus === 'QUEUE' && (
                                        <TouchableOpacity
                                          style={{
                                            backgroundColor: '#fdf3f2',
                                            width: 30,
                                            height: 30,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 8,
                                          }}
                                          onPress={() => {
                                            this.setState({
                                              visible: true,
                                              deleteItemId: item.id,
                                            });
                                          }}>
                                          <FontAwesome5
                                            name="trash-alt"
                                            color="#e2574c"
                                            solid
                                          />
                                        </TouchableOpacity>
                                      )}
                                      {item.foodStatus === 'CANCEL' && (
                                        <TouchableOpacity
                                          style={{
                                            width: 30,
                                            height: 30,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 8,
                                          }}
                                          onPress={() => {
                                            this.replaceString(item.reason);
                                            this.setState({
                                              infoVisible: true,
                                            });
                                          }}>
                                          <FontAwesome5
                                            name="info-circle"
                                            color="#ee7739"
                                            solid
                                            size={22}
                                          />
                                        </TouchableOpacity>
                                      )}
                                    </View>
                                  </View>
                                </>
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
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                      <RefreshControl
                        refreshing={this.state.refreshHistory}
                        onRefresh={this.onRefreshHistory}
                      />
                    }>
                    <Accordion
                      dataArray={this.state.historyOrder}
                      animation={true}
                      expanded={true}
                      renderHeader={this._renderHeader}
                      renderContent={this._renderContent}
                    />
                  </ScrollView>
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
              <View style={{backgroundColor: 'rgba(0,0,0,0.6)'}}>
                <View style={styles.modal}>
                  <Text
                    style={{fontWeight: 'bold', fontSize: 20, marginBottom: 8}}>
                    Cancel Cart Item
                  </Text>
                  <Text
                    style={{
                      textAlign: 'center',
                      marginBottom: 8,
                      fontSize: 16,
                    }}>
                    Tell us why you want to cancel your order:
                  </Text>
                  <FlatList
                    data={this.state.reasonsData}
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
                          {item.selected === true ? (
                            <MaterialIcons
                              name="radio-button-checked"
                              style={{
                                color: '#ee7739',
                                marginRight: 6,
                                fontSize: 18,
                              }}
                            />
                          ) : (
                            <MaterialIcons
                              name="radio-button-unchecked"
                              style={{
                                color: '#ababab',
                                marginRight: 6,
                                fontSize: 16,
                              }}
                              onPress={() => {
                                this.setSelectedReason(index);
                              }}
                            />
                          )}
                          <Text style={{fontSize: 18}}>{item.reason}</Text>
                        </View>
                      );
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}>
                    <TouchableOpacity
                      style={styles.modalBtn}
                      onPress={async () => {
                        this.setState({loading: true});
                        console.log(this.state.reason + ' reason');
                        const cancelCartItem = {
                          id: this.state.deleteItemId,
                          reason: `Customer: ${this.state.reason}`,
                        };
                        fetch(
                          'http://foodcout.ap-southeast-1.elasticbeanstalk.com/cart/cancel',
                          {
                            method: 'PUT',
                            headers: {
                              Accept: 'application/json',
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(cancelCartItem),
                          },
                        ).catch(error => {
                          console.log(error);
                        });

                        this.setState({visible: false});
                        ToastAndroid.showWithGravity(
                          'Your food has been cancelled successfully',
                          ToastAndroid.SHORT,
                          ToastAndroid.CENTER,
                        );
                        await this.fetchCurrentOrder();
                        this.setState({loading: false});
                      }}>
                      <Text
                        style={{
                          color: '#0ec648',
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: 18,
                        }}>
                        Cancel Item
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalBtn}
                      onPress={() => {
                        this.setState({visible: false});
                      }}>
                      <Text
                        style={{
                          color: '#4f5e71',
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: 18,
                        }}>
                        Dismiss
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            <Modal
              transparent
              animationType="fade"
              onRequestClose={() => {
                this.setState({infoVisible: false});
              }}
              visible={this.state.infoVisible}>
              <View
                style={{backgroundColor: 'rgba(0,0,0,0.6)', height: '100%'}}>
                <View style={styles.modal}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 18,
                      marginBottom: 8,
                      textAlign: 'center',
                    }}>
                    Cancel Reason
                  </Text>
                  <Text style={{textAlign: 'center', marginBottom: 12}}>
                    This order has been cancelled because{' '}
                    {this.state.selectedItemReason}
                  </Text>
                  <Text
                    style={{
                      fontStyle: 'italic',
                      color: '#a0a0a0',
                      fontSize: 14,
                      marginBottom: 12,
                    }}>
                    *Your payment has been given back. Please refresh your
                    wallet.
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({infoVisible: false});
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
  modal: {
    marginHorizontal: 20,
    marginVertical: 150,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
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
  },
});

export default OrderScreen;
