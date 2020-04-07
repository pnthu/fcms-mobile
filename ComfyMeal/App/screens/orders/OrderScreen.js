import * as React from 'react';
import {StyleSheet, View, Text, FlatList, TouchableOpacity} from 'react-native';
import {Tabs, Tab, Accordion} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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
      walletId: '',
    };
  }

  componentDidMount = async () => {
    // const currentShoppingCart = JSON.parse(await AsyncStorage.getItem('cart'));
    // const customerWallet = JSON.parse(
    //   await AsyncStorage.getItem('customer-wallet'),
    // );
    // console.log(customerWallet + ' This is wallet');
    // this.setState({walletId: customerWallet.walletId});
    // console.log(this.state.walletId + 'SADASDASDASDASD');

    fetch(
      'http://foodcout.ap-southeast-1.elasticbeanstalk.com/cart/history/122',
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
      <View style={styles.card}>
        <Text style={{fontWeight: '600'}}> {item.purchaseDate}</Text>
        {expanded ? (
          <FontAwesome5 style={{fontSize: 18}} name="angle-down" />
        ) : (
          <FontAwesome5 style={{fontSize: 18}} name="angle-up" />
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
              <View key={index}>
                <Text>{detail.purchasedPrice}</Text>
                <Text>{detail.foodName}</Text>
                <Text>{detail.quantity}</Text>
                <Text>{detail.foodStallName}</Text>
                <Text>{detail.foodName}</Text>
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
