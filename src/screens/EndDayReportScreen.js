import React, { PureComponent } from 'react';
import { createStackNavigator, } from 'react-navigation';
import { View, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import RNPickerSelect from 'react-native-picker-select';
import { Button } from 'react-native-elements';
import { MenuCss } from '../styles/menu';
import HeaderLeft from '../navigation/HeaderLeft';
import AllReport from '../components/EndDayReport/index';
import SellReport from '../components/EndDayReport/SellReport/Report';
import SellDetailReport from '../components/EndDayReport/SellDetailReport/Report';
import ReceiptsReport from '../components/EndDayReport/ReceiptsReport/Report';
import ReceiptsDetailReport from '../components/EndDayReport/ReceiptsDetailReport/Report';
import SellLineChart from '../components/EndDayReport/SellReport/LineReport';
import SellDetailLineChart from '../components/EndDayReport/SellDetailReport/LineReport';
import ReceiptsLineChart from '../components/EndDayReport/ReceiptsReport/LineReport';
import ReceiptsDetailLineChart from '../components/EndDayReport/ReceiptsDetailReport/LineReport';

export default EndDayReportScreen = createStackNavigator({
    AllReport: {
        screen: AllReport,
        navigationOptions: ({ navigation }) => ({
            title: 'Báo cáo cuối ngày',
            headerLeft: <HeaderLeft navigationProps={navigation} />,
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
        }),
    },
    
    SellReport: {
        screen: SellReport,
        navigationOptions: ({ navigation }) => ({
            title: 'Báo cáo bán hàng',
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
                            size={24}
                            color="white"
                        />
                    }
                />
            ),
        }),
    },

    SellDetailReport: {
        screen: SellDetailReport,
        navigationOptions: ({ navigation }) => ({
            title: 'Chi tiết bán hàng',
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
                            size={24}
                            color="white"
                        />
                    }
                />
            ),
        }),
    },

    ReceiptsReport: {
        screen: ReceiptsReport,
        navigationOptions: ({ navigation }) => ({
            title: 'Báo cáo Thu/Chi',
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
                            size={24}
                            color="white"
                        />
                    }
                />
            ),
        }),
    },

    ReceiptsDetailReport: {
        screen: ReceiptsDetailReport,
        navigationOptions: ({ navigation }) => ({
            title: 'Chi tiết Thu/Chi',
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
                            size={24}
                            color="white"
                        />
                    }
                />
            ),
        }),
    },

    SellLineChart: {
        screen: SellLineChart,
        navigationOptions: ({ navigation }) => ({
            title: 'Biểu đồ Bán hàng',
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
                            size={24}
                            color="white"
                        />
                    }
                />
            ),
        }),
    },

    SellDetailLineChart: {
        screen: SellDetailLineChart,
        navigationOptions: ({ navigation }) => ({
            title: 'Biểu đồ Chi tiết Bán hàng',
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
                            size={24}
                            color="white"
                        />
                    }
                />
            ),
        }),
    },

    ReceiptsLineChart: {
        screen: ReceiptsLineChart,
        navigationOptions: ({ navigation }) => ({
            title: 'Biểu đồ Thu/Chi',
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
                            size={24}
                            color="white"
                        />
                    }
                />
            ),
        }),
    },

    ReceiptsDetailLineChart: {
        screen: ReceiptsDetailLineChart,
        navigationOptions: ({ navigation }) => ({
            title: 'Biểu đồ Chi tiết Thu/Chi',
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
                            size={24}
                            color="white"
                        />
                    }
                />
            ),
        }),
    },

});