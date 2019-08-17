import React, { PureComponent } from 'react';
import { Button } from 'react-native-elements';
import { createStackNavigator, } from 'react-navigation';
import { MenuCss } from '../styles/menu';
import HeaderLeft from '../navigation/HeaderLeft';
import CustomerReport from '../components/CustomerReport/CustomerReport/CustomerReport';
import LineChart from '../components/CustomerReport/CustomerReport/LineChart';
import LineChartDebt from '../components/CustomerReport/CustomerDebt/LineChartDebt';
import LineChartProfit from '../components/CustomerReport/CustomerProfit/LineChartProfit';
import AllReport from '../components/CustomerReport/index';
// import CustomerDebt from '../components/CustomerReport/CustomerDebt copy/CustomerDebt';
import CustomerDebt from '../components/CustomerReport/CustomerDebt/CustomerDebt';
import CustomerProfit from '../components/CustomerReport/CustomerProfit/CustomerProfit';
import NavigatorService from '../services/NavigatorService';
import Icon from "react-native-vector-icons/Ionicons";


export default CustomerReportScreen = createStackNavigator({
    AllReport: {
        screen: AllReport,
        navigationOptions: ({ navigation }) => ({
            title: 'Báo cáo khách hàng',
            headerLeft: <HeaderLeft navigationProps={navigation} />,
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
        }),
    },
    CustomerReport: {
        screen: CustomerReport,
        navigationOptions: ({ navigation }) => ({
            title: 'Báo cáo khách hàng',
            // headerLeft: <HeaderLeft navigationProps={navigation} />,
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
            headerRight: (
                <Button
                    onPress={() => navigation.state.params.dispatch()}
                    color="#fff"
                    style={{ fontSize: '11' }}
                    buttonStyle={{ backgroundColor: 'transparent' }}
                    icon={
                        <Icon
                            name="ios-funnel"
                            size={32}
                            color="white"
                        />
                    }
                />
            ),
        }),
    },
    LineChart: {
        screen: LineChart,
        navigationOptions: ({ navigation }) => ({
            title: 'Biểu đồ khách hàng',
            // headerLeft: <HeaderLeft navigationProps={navigation} />,
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
        }),
    },
    CustomerDebt: {
        screen: CustomerDebt,
        navigationOptions: ({ navigation }) => ({
            title: 'Công nợ khách hàng',
            // headerLeft: <HeaderLeft navigationProps={navigation} />,
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
            headerRight: (
                <Button
                    onPress={() => navigation.state.params.dispatch()}
                    color="#fff"
                    style={{ fontSize: '11' }}
                    buttonStyle={{ backgroundColor: 'transparent' }}
                    icon={
                        <Icon
                            name="ios-funnel"
                            size={32}
                            color="white"
                        />
                    }
                />
            ),
        }),
    },
    LineChartDebt: {
        screen: LineChartDebt,
        navigationOptions: ({ navigation }) => ({
            title: 'Biểu đồ công nợ khách hàng',
            // headerLeft: <HeaderLeft navigationProps={navigation} />,
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
        }),
    },
    CustomerProfit: {
        screen: CustomerProfit,
        navigationOptions: ({ navigation }) => ({
            title: 'Lợi nhuận theo khách hàng',
            // headerLeft: <HeaderLeft navigationProps={navigation} />,
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
            headerRight: (
                <Button
                    onPress={() => navigation.state.params.dispatch()}
                    color="#fff"
                    style={{ fontSize: '11' }}
                    buttonStyle={{ backgroundColor: 'transparent' }}
                    icon={
                        <Icon
                            name="ios-funnel"
                            size={32}
                            color="white"
                        />
                    }
                />
            ),
        }),
    },
    LineChartProfit: {
        screen: LineChartProfit,
        navigationOptions: ({ navigation }) => ({
            title: 'Biểu đồ lợi nhuận theo khách hàng',
            // headerLeft: <HeaderLeft navigationProps={navigation} />,
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
        }),
    },
});