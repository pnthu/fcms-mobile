import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  BackHandler,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import StarRating from 'react-native-star-rating';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

class StallDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foodStallMenu: [],
      foodStallDetail: {
        foodStallImage: '',
        foodStallName: '',
        foodStallDescription: '',
        foodStallrating: 0,
      },
    };
  }

  componentDidMount = () => {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });
    fetch(
      'http://foodcout.ap-southeast-1.elasticbeanstalk.com/food-stall/' +
        JSON.stringify(this.props.navigation.state.params.foodstall) +
        '/detail',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then((Response) => Response.json())
      .then((detail) => {
        this.setState({foodStallDetail: detail});
      })
      .catch((error) => {
        console.log(error);
      });

    fetch(
      'http://foodcout.ap-southeast-1.elasticbeanstalk.com/food-stall/' +
        JSON.stringify(this.props.navigation.state.params.foodstall) +
        '/detail/menu',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then((Response) => Response.json())
      .then((menu) => {
        this.setState({foodStallMenu: menu});
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addToCart = () => {};

  render() {
    // const {navigation} = this.props;
    // console.log('Render: ' + foodstall);
    return (
      <>
        <Image
          source={{
            uri: this.state.foodStallDetail.foodStallImage,
          }}
          resizeMethod="resize"
          style={styles.stallImage}
        />
        <View style={styles.container}>
          {/* <Text>{JSON.stringify(navigation.state.params)}</Text> */}
          <Text style={styles.name}>
            {this.state.foodStallDetail.foodStallName}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 6,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.type}></Text>
            <View style={{flexDirection: 'row'}}>
              <StarRating
                disabled
                halfStarEnabled
                starSize={15}
                fullStarColor="#ffdd00"
                halfStarColor="#ffdd00"
                emptyStarColor="#ffdd00"
                rating={this.state.foodStallDetail.foodStallRating / 2}
                containerStyle={styles.stars}
              />
              <Text>{this.state.foodStallDetail.foodStallRating / 2}</Text>
            </View>
          </View>
          <Text
            style={{fontStyle: 'italic', color: '#808080', paddingVertical: 8}}>
            {this.state.foodStallDetail.foodStallDescription}
          </Text>
          <FlatList
            data={this.state.foodStallMenu}
            showsVerticalScrollIndicator={false}
            numColumns={1}
            renderItem={({item, index}) => (
              <TouchableOpacity
                key={index}
                onPress={() => this.addToCart}
                style={styles.foodCard}>
                <Image source={{uri: item.foodImage}} style={styles.foodImg} />
                <View>
                  <Text
                    style={{fontSize: 20, fontWeight: 'bold', marginBottom: 4}}>
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
                  <Text>{item.originPrice}đ</Text>
                </View>
                <FontAwesome5 name="plus-circle" style={styles.btnAdd} />
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <TouchableOpacity style={styles.btnCart}>
          <FontAwesome5
            name="shopping-cart"
            color="white"
            style={{fontSize: 20}}
          />
        </TouchableOpacity>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  stallImage: {width: '100%', height: 300},
  name: {fontSize: 25, textAlign: 'center', fontWeight: 'bold'},
  stars: {
    justifyContent: 'flex-start',
    marginTop: 2,
    marginRight: 6,
  },
  type: {
    borderWidth: 1,
    borderColor: '#ee7739',
    borderRadius: 50,
    marginRight: 8,
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    color: '#ee7739',
  },
  foodCard: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#dadada',
    paddingVertical: 12,
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
});

export default StallDetailScreen;
