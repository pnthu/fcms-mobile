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
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import StarRating from 'react-native-star-rating';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

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
    };
  }

  initData = () => {
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

    await fetch(
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

  componentDidMount = async () => {
    await this.initData();
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
          this.props.navigation.navigate('StallDetail', {
            foodstall: item,
          });
        }}>
        <Image source={{uri: item.foodImage}} style={styles.fsImage} />
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.fsTitle}>
          {item.foodName}
        </Text>
        <StarRating
          disabled
          halfStarEnabled
          starSize={15}
          fullStarColor="#ffdd00"
          halfStarColor="#ffdd00"
          emptyStarColor="#ffdd00"
          rating={item.foodRating}
          containerStyle={styles.stars}
        />
      </TouchableOpacity>
    );
  };

  render = () => {
    const {navigation} = this.props;

    return (
      <View style={styles.container}>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginBottom: 8,
          }}>
          <TextInput
            style={styles.searchBar}
            onChange={text => this.setState({searchText: text})}
            placeholder="Search Food stall..."
          />
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => {
              console.log(this.state.searchText);
              fetch(
                'http://foodcout.ap-southeast-1.elasticbeanstalk.com/food/search?name=' +
                  this.state.searchText,
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
                  console.log(this.state.searchText);
                  this.setState({listFoodStall: foodStallList});
                })
                .catch(error => {
                  console.log(error);
                });
            }}>
            <FontAwesome5 name="search" style={{color: '#ee7739'}} />
            <Text style={{color: '#ee7739', fontWeight: '500'}}>Search</Text>
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
    );
  };
}

const styles = StyleSheet.create({
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
});

export default StallListScreen;
