import * as React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import LoginScreen from './screens/user/LoginScreen';
import StallListScreen from './screens/stalls/StallListScreen';
import StallDetailScreen from './screens/stalls/StallDetailScreen';
import AboutScreen from './screens/about/AboutScreen';
import OrderScreen from './screens/orders/OrderScreen';
import CartScreen from './screens/orders/CartScreen';
import ProfileScreen from './screens/user/ProfileScreen';

// const info = await AsyncStorage.getItem('user-info');

const HomeStack = createStackNavigator(
  {
    StallList: {
      screen: StallListScreen,
      navigationOptions: {headerShown: false},
    },
  },
  {initialRouteName: 'StallList'},
);

const OrderStack = createStackNavigator(
  {
    OrderList: {screen: OrderScreen, navigationOptions: {headerShown: false}},
  },
  {initialRouteName: 'OrderList'},
);

const UserTabNavigator = createBottomTabNavigator(
  {
    HomeTab: HomeStack,
    AboutTab: {screen: AboutScreen, navigationOptions: {headerShown: false}},
    ProfileTab: {screen: LoginScreen, navigationOptions: {headerShown: false}},
  },
  {
    tabBarOptions: {
      activeTintColor: '#ee7739',
      inactiveTintColor: 'gray',
    },
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({tintColor}) => {
        const {routeName} = navigation.state;
        let Icon = FontAwesome5;
        let iconName = '';
        routeName === 'HomeTab'
          ? (iconName = 'home')
          : routeName === 'AboutTab'
          ? (iconName = 'info-circle')
          : (iconName = 'user-circle');
        return <Icon name={iconName} color={tintColor} size={20} solid />;
      },
      tabBarLabel: () => null,
    }),
    initialRouteName: 'HomeTab',
  },
);

const CustomerTabNavigator = createBottomTabNavigator(
  {
    HomeTab: HomeStack,
    OrderTab: OrderStack,
    AboutTab: {screen: AboutScreen, navigationOptions: {headerShown: false}},
    ProfileTab: {
      screen: ProfileScreen,
      navigationOptions: {headerShown: false},
    },
  },
  {
    tabBarOptions: {
      activeTintColor: '#ee7739',
      inactiveTintColor: 'gray',
    },
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({tintColor}) => {
        const {routeName} = navigation.state;
        let Icon = FontAwesome5;
        let iconName = '';
        routeName === 'HomeTab'
          ? (iconName = 'home')
          : routeName === 'OrderTab'
          ? (iconName = 'history')
          : routeName === 'AboutTab'
          ? (iconName = 'info-circle')
          : (iconName = 'user-circle');
        return <Icon name={iconName} color={tintColor} size={20} solid />;
      },
      tabBarLabel: () => null,
    }),
    initialRouteName: 'HomeTab',
  },
);

const RootStack = createStackNavigator(
  {
    UserHome: {
      screen: UserTabNavigator,
      navigationOptions: {headerShown: false},
    },
    CustomerHome: {
      screen: CustomerTabNavigator,
      navigationOptions: {headerShown: false},
    },
    StallDetail: {
      screen: StallDetailScreen,
      navigationOptions: {headerShown: false},
    },
    CartInfo: {screen: CartScreen, navigationOptions: {headerShown: false}},
  },
  {initialRouteName: 'UserHome'},
);

let Navigation = createAppContainer(RootStack);

export default Navigation;
