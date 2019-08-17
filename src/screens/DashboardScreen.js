import React, { PureComponent } from 'react';
import { createStackNavigator, } from 'react-navigation';
import Dashboard from '../components/dashboard/Dashboard';
import { MenuCss } from '../styles/menu';
import HeaderLeft from '../navigation/HeaderLeft';

export default DashboardScreen = createStackNavigator({
    Dashboard: {
        screen: Dashboard,
        navigationOptions: ({ navigation }) => ({
            title: 'Bpos Mobile',
            headerLeft: <HeaderLeft navigationProps={navigation} />,
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
        }),
    },
});