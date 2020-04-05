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
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import StarRating from 'react-native-star-rating';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

class StallListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listCategories: [],
      listFoodStall: [],
      topFoodList: [],
      foodStallName: '',
    };
  }

  componentDidMount() {
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
      .then((Response) => Response.json())
      .then((typeList) => {
        this.setState({listCategories: typeList});
      })
      .catch((error) => {
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
      .then((Response) => Response.json())
      .then((foodStallList) => {
        this.setState({listFoodStall: foodStallList});
      })
      .catch((error) => {
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
      .then((Response) => Response.json())
      .then((foodList) => {
        this.setState({topFoodList: foodList});
      })
      .catch((error) => {
        console.log(error);
      });
  }

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
        <Image source={item.image} style={styles.fsImage} />
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.fsTitle}>
          {item.name}
        </Text>
        <Text ellipsizeMode="tail" numberOfLines={2}>
          {item.description}
        </Text>
        <StarRating
          disabled
          halfStarEnabled
          starSize={15}
          fullStarColor="#ffdd00"
          halfStarColor="#ffdd00"
          emptyStarColor="#ffdd00"
          rating={item.rating}
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
            placeholder="Search Food stall..."
          />
          <TouchableOpacity style={styles.searchBtn}>
            <FontAwesome5 name="search" style={{color: '#ee7739'}} />
            <Text style={{color: '#ee7739', fontWeight: '500'}}>Search</Text>
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
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
                    fetch('');
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
                <Text ellipsizeMode="tail" numberOfLines={2}>
                  {item.foodStallDescription}
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
    justifyContent: 'space-between',
    paddingHorizontal: 12,
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
