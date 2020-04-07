import * as React from 'react';
import {StyleSheet, View, Text, FlatList, TouchableOpacity} from 'react-native';
import {Tabs, Tab, Accordion} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';

const data = [
  {
    fs: ['highlands', 'tch', 'banh mi abcxyzblablabla'],
    status: 'Finished',
    price: 50000,
  },
];

class OrderScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shoppingCart: [],
      historyOrder: [],
      historyOrderDetail: [],
      walletId: 0,
    };
  }

  componentDidMount = async () => {
    const currentShoppingCart = JSON.parse(await AsyncStorage.getItem('cart'));
    const customerWallet = JSON.parse(
      await AsyncStorage.getItem('customer-wallet'),
    );
    this.setState({walletId: customerWallet.walletId});

    fetch(
      'http://foodcout.ap-southeast-1.elasticbeanstalk.com/cart/history/' +
        this.state.walletId,
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
          paddingRight: 30,
        }}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontWeight: '600', fontSize: 14}}>
            Purchase Date: {item.purchaseDate}
          </Text>
          <Text style={{fontWeight: '600', marginLeft: 'auto', fontSize: 14}}>
            Total Price: {item.totalPrice}
          </Text>
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
                fontSize: 16,
                color: 'red',
              }}>
              {item.cartStatus}
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
                fontSize: 16,
                color: 'green',
              }}>
              {item.cartStatus}
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
                fontSize: 16,
                color: 'blue',
              }}>
              {item.cartStatus}
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
                  <Text style={{fontSize: 13, fontWeight: '600'}}>
                    Total Price: {detail.purchasedPrice}đ
                  </Text>
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
    return (
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
              data={data}
              showsVerticalScrollIndicator={false}
              numColumns={1}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => {
                var mappedName = '';
                for (let i = 0; i < item.fs.length; i++) {
                  mappedName += item.fs[i] + ', ';
                }
                return (
                  <TouchableOpacity style={styles.card}>
                    <FontAwesome5 name="clock" solid style={styles.icon} />
                    <View>
                      <Text
                        style={{
                          fontSize: 18,
                          marginBottom: 4,
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {mappedName}
                      </Text>
                      <Text
                        style={{
                          color: '#5bb8ea',
                          fontWeight: 'bold',
                          marginBottom: 4,
                          fontSize: 16,
                        }}>
                        {item.status}
                      </Text>
                      <Text style={{fontStyle: 'italic'}}>{item.price}đ</Text>
                    </View>
                  </TouchableOpacity>
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
            {/* <FlatList
              style={styles.tabContainer}
              data={this.state.historyOrder}
              showsVerticalScrollIndicator={false}
              numColumns={1}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => {
                var mappedName = '';
                // for (let i = 0; i < item.fs.length; i++) {
                //   mappedName += item.fs[i] + ', ';
                // }

                return (
                  <TouchableOpacity
                    onPress={() => {
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
                        .then((Response) => Response.json())
                        .then((historyDetail) => {
                          console.log(historyDetail);
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    }}
                    style={styles.card}>
                    {item.cartStatus === 'Cancelled' ? (
                      <FontAwesome
                        name="warning"
                        style={{
                          fontSize: 18,
                          color: 'red',
                          marginRight: 6,
                        }}
                      />
                    ) : (
                      <FontAwesome5
                        name="check-circle"
                        solid
                        style={{
                          fontSize: 18,
                          color: 'green',
                          marginRight: 6,
                        }}
                      />
                    )}
                    <View>
                      <Text
                        style={{
                          fontSize: 18,
                          marginBottom: 4,
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {mappedName}
                      </Text>
                      <Text
                        style={{
                          color: item.status === 'Cancelled' ? 'red' : 'green',
                          fontWeight: 'bold',
                          marginBottom: 4,
                          fontSize: 16,
                        }}>
                        {item.cartStatus}
                      </Text>
                      <Text style={{fontStyle: 'italic'}}>
                        {item.totalPrice}đ
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
            {/* duoi nay xai icon check-circle (FA5) voi warning (FA) */}
          </Tab>
        </Tabs>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tabContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
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
});

export default OrderScreen;
