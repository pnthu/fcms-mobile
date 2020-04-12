import * as React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  Dimensions,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Modal,
  ToastAndroid,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import StarRating from 'react-native-star-rating';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {EventRegister} from 'react-native-event-listeners';
import AsyncStorage from '@react-native-community/async-storage';
import NumberFormat from 'react-number-format';

class StallListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listCategories: [{typeName: 'All'}],
      listFoodStall: [],
      topFoodList: [],
      searchText: '',
      foodStallName: '',
      refreshing: false,
      loading: true,
      cart: null,
      visible: false,
      selectedFood: {},
      quantity: 1,
    };
  }

  initData = async () => {
    try {
      // const response = await AsyncStorage.getItem('cart');
      // const cart = JSON.parse(response);
      // console.log('cart', cart);
      // cart && this.setState({cart: cart});
    } catch (error) {
      console.log('Something was wrong, ', error);
    }
    fetch(
      'http://foodcout.ap-southeast-1.elasticbeanstalk.com/food-court/type/lists',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(Response => Response.json())
      .then(typeList => {
        typeList.map(type => {
          let objectType = {typeName: type.typeName};
          this.state.listCategories.push(objectType);
        });
      })
      .catch(error => {
        console.log(error);
      });

    fetch(
      'http://foodcout.ap-southeast-1.elasticbeanstalk.com/food-stall/lists',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(Response => Response.json())
      .then(foodStallList => {
        this.setState({listFoodStall: foodStallList});
      })
      .catch(error => {
        console.log(error);
      });

    fetch(
      'http://foodcout.ap-southeast-1.elasticbeanstalk.com/food/filter/top-food/lists',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(Response => Response.json())
      .then(foodList => {
        this.setState({topFoodList: foodList});
      })
      .catch(error => {
        console.log(error);
      });
  };

  addToCart = async () => {
    if (this.state.cart === null) {
      this.setState({visible: false});
      ToastAndroid.show('Please login to order our food.', ToastAndroid.SHORT);
      this.props.navigation.navigate('ProfileTab');
      console.log('cart here', this.state.cart);
    } else {
      const tmpCart = this.state.cart;
      for (let i = 0; i < this.state.quantity; i++) {
        tmpCart.push(this.state.selectedFood);
      }
      console.log('cart cart', JSON.stringify(tmpCart));
      this.setState({
        selectedFood: {},
        quantity: 1,
        cart: tmpCart,
        visible: false,
      });
      await AsyncStorage.setItem('cart', JSON.stringify(this.state.cart));
    }
  };

  componentDidMount = async () => {
    this.setState({loading: true});
    await this.initData();
    this.setState({loading: false});
  };

  componentWillMount = () => {
    this.listener = EventRegister.addEventListener('updateList', async () => {
      this.setState({loading: true});
      await this.initData();
      this.setState({loading: false});
    });
    this.listener = EventRegister.addEventListener('updateCart', async () => {
      this.setState({loading: true});
      await this.initData();
      this.setState({loading: false});
    });
    this.listener = EventRegister.addEventListener('finishOrder', async () => {
      this.setState({loading: true});
      await this.initData();
      this.setState({loading: false});
    });
  };

  onRefresh = async () => {
    this.setState({refreshing: true});
    await this.initData();
    this.setState({refreshing: false});
  };

  renderCarousel = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.fsCarousel}
        onPress={() => {
          this.setState({selectedFood: item, visible: true});
        }}>
        <Image source={{uri: item.foodImage}} style={styles.fsImage} />
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.fsTitle}>
          {item.foodName}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <StarRating
            disabled
            halfStarEnabled
            starSize={15}
            fullStarColor="#ffdd00"
            halfStarColor="#ffdd00"
            emptyStarColor="#ffdd00"
            rating={item.foodRating}
            containerStyle={{
              justifyContent: 'flex-start',
              marginTop: 2,
              marginRight: 'auto',
            }}
          />
          {item.retailPrice === 0 ? (
            <NumberFormat
              style={{marginLeft: 'auto'}}
              value={item.originPrice}
              thousandSeparator={true}
              defaultValue={0}
              suffix={'VND'}
              displayType={'text'}
              renderText={value => (
                <Text
                  style={{
                    color: 'red',
                  }}>
                  {value}
                </Text>
              )}
            />
          ) : (
            <NumberFormat
              style={{marginLeft: 'auto'}}
              value={item.retailPrice}
              thousandSeparator={true}
              defaultValue={0}
              suffix={'VND'}
              displayType={'text'}
              renderText={value => (
                <Text
                  style={{
                    color: 'red',
                  }}>
                  {value}
                </Text>
              )}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  render = () => {
    const {navigation} = this.props;
    console.log('food', this.state.cart);
    return (
      // <View style={styles.container}>
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
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginBottom: 8,
                }}>
                <TextInput
                  value={this.state.searchText}
                  style={styles.searchBar}
                  onChangeText={text => this.setState({searchText: text})}
                  placeholder="Search Food stall..."
                />
                <TouchableOpacity
                  style={styles.searchBtn}
                  onPress={() => {
                    fetch(
                      `http://foodcout.ap-southeast-1.elasticbeanstalk.com/food-stall/search?name=${
                        this.state.searchText
                      }`,
                      {
                        method: 'GET',
                        headers: {
                          Accept: 'application/json',
                          'Content-Type': 'application/json',
                        },
                      },
                    )
                      .then(Response => Response.json())
                      .then(foodStallList => {
                        this.setState({listFoodStall: foodStallList});
                      })
                      .catch(error => {
                        console.log(error);
                      });
                  }}>
                  <FontAwesome5 name="search" style={{color: '#ee7739'}} />
                  <Text style={{color: '#ee7739', fontWeight: '500'}}>
                    Search
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                  />
                }>
                <View>
                  <Text style={styles.topRating}>Top Rating Food</Text>
                  <Carousel
                    data={this.state.topFoodList}
                    renderItem={this.renderCarousel}
                    itemWidth={Dimensions.get('window').width / 2}
                    sliderWidth={Dimensions.get('window').width}
                    firstItem={1}
                  />
                </View>
                <Text style={styles.topRating}>Choose your favorite food</Text>
                <ScrollView
                  style={styles.tagsContainer}
                  showsHorizontalScrollIndicator={false}
                  horizontal>
                  {this.state.listCategories.map((cate, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          if (cate.typeName === 'All') {
                            fetch(
                              'http://foodcout.ap-southeast-1.elasticbeanstalk.com/food-stall/lists',
                              {
                                method: 'GET',
                                headers: {
                                  Accept: 'application/json',
                                  'Content-Type': 'application/json',
                                },
                              },
                            )
                              .then(Response => Response.json())
                              .then(foodStallList => {
                                this.setState({listFoodStall: foodStallList});
                              })
                              .catch(error => {
                                console.log(error);
                              });
                          } else {
                            fetch(
                              'http://foodcout.ap-southeast-1.elasticbeanstalk.com/food-stall/filter/' +
                                cate.typeName,
                              {
                                method: 'GET',
                                headers: {
                                  Accept: 'application/json',
                                  'Content-Type': 'application/json',
                                },
                              },
                            )
                              .then(Response => Response.json())
                              .then(foodStallList => {
                                this.setState({listFoodStall: foodStallList});
                              })
                              .catch(error => {
                                console.log(error);
                              });
                          }
                        }}
                        key={index}
                        style={styles.tag}>
                        <Text style={{color: 'white'}}>{cate.typeName}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
                <FlatList
                  scrollEnabled={false}
                  data={this.state.listFoodStall}
                  showsVerticalScrollIndicator={false}
                  numColumns={2}
                  renderItem={({item, index}) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.fsCard}
                      onPress={() => {
                        navigation.navigate('StallDetail', {
                          foodstall: item.foodStallId,
                        });
                      }}>
                      <Image
                        source={{uri: item.foodStallImage}}
                        style={styles.fsImage}
                      />
                      <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={styles.fsTitle}>
                        {item.foodStallName}
                      </Text>
                      <StarRating
                        disabled
                        halfStarEnabled
                        starSize={15}
                        fullStarColor="#ffdd00"
                        halfStarColor="#ffdd00"
                        emptyStarColor="#ffdd00"
                        containerStyle={styles.stars}
                        rating={item.foodStallRating / 2}
                      />
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  columnWrapperStyle={{justifyContent: 'space-between'}}
                />
              </ScrollView>
            </View>
            <Modal
              transparent
              animationType="slide"
              onRequestClose={() => {
                this.setState({visible: false});
              }}
              visible={this.state.visible}>
              <View style={styles.modal}>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>
                  Add to Cart
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 12,
                    alignSelf: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={{uri: this.state.selectedFood.foodImage}}
                    style={{
                      width: 70,
                      height: 70,
                      marginRight: 12,
                    }}
                  />
                  <View>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginBottom: 4,
                        width: '70%',
                      }}>
                      {this.state.selectedFood.foodName}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={{
                        color: '#808080',
                        fontWeight: '200',
                        marginBottom: 4,
                      }}>
                      {this.state.selectedFood.foodDescription}
                    </Text>
                    {this.state.selectedFood.retailPrice == 0 ? (
                      <NumberFormat
                        value={this.state.selectedFood.originPrice}
                        thousandSeparator={true}
                        defaultValue={0}
                        suffix={'VND'}
                        displayType={'text'}
                        renderText={value => <Text>{value}</Text>}
                      />
                    ) : (
                      <NumberFormat
                        value={this.state.selectedFood.retailPrice}
                        thousandSeparator={true}
                        defaultValue={0}
                        suffix={'VND'}
                        displayType={'text'}
                        renderText={value => <Text>{value}</Text>}
                      />
                    )}
                  </View>
                </View>
                <View style={styles.itemQuantity}>
                  <FontAwesome5
                    name="minus-circle"
                    onPress={() => {
                      if (this.state.quantity !== 1) {
                        this.setState({quantity: --this.state.quantity});
                      }
                    }}
                    style={styles.btnAddRemove}
                  />
                  <Text style={{fontSize: 17}}>{this.state.quantity}</Text>
                  <FontAwesome5
                    name="plus-circle"
                    onPress={() => {
                      this.setState({quantity: ++this.state.quantity});
                    }}
                    style={styles.btnAddRemove}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                  }}>
                  <TouchableOpacity
                    style={styles.modalBtn}
                    onPress={async () => {
                      await this.addToCart();
                    }}>
                    <Text
                      style={{
                        color: '#0ec648',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 18,
                      }}>
                      Add to Cart
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
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            {!this.state.cart || this.state.cart.length === 0 || (
              <>
                <TouchableOpacity
                  style={styles.btnCart}
                  onPress={() => {
                    this.props.navigation.navigate('CartInfo');
                  }}>
                  <FontAwesome5
                    name="shopping-cart"
                    color="white"
                    style={{fontSize: 20}}
                  />
                  <Text style={styles.quantity}>{this.state.cart.length}</Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </>
    );
  };
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  loadingHorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  searchBar: {
    width: '70%',
    height: 40,
    backgroundColor: '#f3f3f3',
    color: '#0f0f0f',
    borderRadius: 50,
    paddingLeft: 12,
  },
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '25%',
    color: 'white',
    borderColor: '#ee7739',
    borderRadius: 50,
    borderWidth: 2,
  },
  topRating: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#8a8a8a',
    marginVertical: 8,
  },
  tagsContainer: {
    marginVertical: 8,
  },
  tag: {
    backgroundColor: '#ee7739',
    borderRadius: 50,
    marginRight: 8,
    marginBottom: 8,
    padding: 6,
  },
  fsCard: {
    width: '47%',
    marginBottom: 6,
  },
  fsImage: {
    width: '100%',
    borderRadius: 4,
    height: 100,
  },
  fsTitle: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  fsCarousel: {
    width: '100%',
  },
  stars: {
    justifyContent: 'flex-start',
    marginTop: 2,
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
  quantity: {
    position: 'absolute',
    bottom: 34,
    left: 34,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 12,
    backgroundColor: '#ee7739',
    color: 'white',
    width: 24,
    height: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
  },
  modal: {
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 200,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingLeft: 16,
    paddingVertical: 12,
    // paddingRight: 50,
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
  itemQuantity: {
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

export default StallListScreen;
