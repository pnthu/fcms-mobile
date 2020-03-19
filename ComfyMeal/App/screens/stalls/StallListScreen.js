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

const categories = [
  {name: 'FastFood'},
  {name: 'Drink'},
  {name: 'Grill & Hot Pot'},
  {name: 'Rice'},
  {name: 'Sushi'},
  {name: 'Dimsum'},
  {name: 'Salad'},
];

const foodstalls = [
  {
    name: 'Gong Cha Milk Tea',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat elit maximus.',
    rating: 4,
    image: require('../../../assets/gongcha.jpeg'),
    type: categories[1],
  },
  {
    name: 'KFC Vietnam',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat elit maximus.',
    rating: 3,
    image: require('../../../assets/kfc.png'),
    type: categories[0],
  },
  {
    name: 'Sumo BBQ',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat elit maximus.',
    rating: 5,
    image: require('../../../assets/sumo.jpg'),
    type: categories[2],
  },
  {
    name: 'Cali Broken Rice',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat elit maximus.',
    rating: 4.5,
    image: require('../../../assets/cali.jpg'),
    type: categories[3],
  },
  {
    name: 'Baoz Dimsum',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat elit maximus.',
    rating: 3,
    image: require('../../../assets/baoz-dimsum.jpg'),
    type: categories[5],
  },
  {
    name: 'Poke Saigon',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat elit maximus.',
    rating: 5,
    image: require('../../../assets/salad.jpg'),
    type: categories[6],
  },
  {
    name: 'Uchi Sushi',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat elit maximus.',
    rating: 4,
    image: require('../../../assets/sushi.jpg'),
    type: categories[4],
  },
  {
    name: 'Hutong Hot Pot',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat elit maximus.',
    rating: 4.5,
    image: require('../../../assets/hotpot.jpg'),
    type: categories[2],
  },
];

const filteredFs = foodstalls
  .slice()
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 5);

const renderCarousel = ({item, index}) => {
  // const {navigation} = this.props;

  return (
    <TouchableOpacity
      key={index}
      style={styles.fsCarousel}
      // onPress={() => {
      //   navigation.navigate('StallDetail', {
      //     navigation: navigation,
      //     foodstall: item,
      //   });
      // }}>
    >
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

class StallListScreen extends React.Component {
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
            <Text style={styles.topRating}>Top Rating Food Stalls</Text>
            <Carousel
              data={filteredFs}
              renderItem={renderCarousel}
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
            {categories.map((category, index) => {
              return (
                <TouchableOpacity key={index} style={styles.tag}>
                  <Text style={{color: 'white'}}>{category.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <FlatList
            scrollEnabled={false}
            data={foodstalls}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            renderItem={({item, index}) => (
              <TouchableOpacity
                key={index}
                style={styles.fsCard}
                onPress={() => {
                  navigation.navigate('StallDetail', {
                    navigation: navigation,
                    foodstall: item,
                  });
                }}>
                <Image source={item.image} style={styles.fsImage} />
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={styles.fsTitle}>
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
                  containerStyle={styles.stars}
                  rating={item.rating}
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
