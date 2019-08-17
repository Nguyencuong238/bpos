import React, { Component } from 'react';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import { View } from 'react-native';
import DrawerNavigator from '../navigation/AppNavigator';
import AuthLoadingScreen from './AuthLoadingScreen';
import Login from './SignIn';
import NavigatorService from '../services/NavigatorService';


const AppStack = createStackNavigator(
    { Home: DrawerNavigator },
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    });
const AuthStack = createStackNavigator({ SignIn: Login }, {
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
});
export default class Navigation extends Component {
    render() {
        return (
            <Nav
                ref={navigatorRef => {
                    NavigatorService.setContainer(navigatorRef);
                }}
            >
            </Nav>
        );
    }
}


const Nav = createAppContainer(createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        App: AppStack,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'AuthLoading',
    }
));