import * as React from 'react';
import {StyleSheet, View, Text, FlatList, TouchableOpacity} from 'react-native';
import {Tabs, Tab} from 'native-base';
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
                    {item.status === 'Cancelled' ? (
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
                        {item.status}
                      </Text>
                      <Text style={{fontStyle: 'italic'}}>{item.price}đ</Text>
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
