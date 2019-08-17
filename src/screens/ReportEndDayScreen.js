import React, { PureComponent } from 'react';
import { createStackNavigator, } from 'react-navigation';
import Report from '../components/reportsEndDay/Report';
import RevenueDetail from '../components/reportsEndDay/RevenueDetail';
import RevenueDetailTH from '../components/reportsEndDay/RevenueDetailTH';
import List_Bill from '../components/reportsEndDay/List_Bill';
import List_Product from '../components/reportsEndDay/List_Product';
import BillDetail from '../components/reportsEndDay/BillDetail';
import RevenueDetailEndDay from '../components/reportsEndDay/RevenueDetailEndDay';
import { MenuCss } from '../styles/menu';
import HeaderLeft from '../navigation/HeaderLeft';

export default ReportEndDayScreen = createStackNavigator({
    ReportEndDay: {
        screen: Report,
        navigationOptions: ({ navigation }) => ({
            title: 'Báo cáo cuối ngày',
            headerLeft: <HeaderLeft navigationProps={navigation} />,
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff' ,
        }),
    },
    RevenueDetail: {
        screen: RevenueDetail,
        navigationOptions: ({ navigation }) => ({
            title: 'BC bán hàng theo thời gian',
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
        }),
    },
    RevenueDetailTH: {
        screen: RevenueDetailTH,
        navigationOptions: ({ navigation }) => ({
            title: 'BC bán hàng theo thời gian',
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
        }),
    },
    RevenueDetailEndDay: {
        screen: RevenueDetailEndDay,
        navigationOptions: ({ navigation }) => ({
            title: 'Tổng kết thu chi',
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
        }),
    },
    List_Bill: {
        screen: List_Bill,
        navigationOptions: ({ navigation }) => ({
            title: navigation.state.params.date,
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
        }),
    },
    List_Product: {
        screen: List_Product,
        navigationOptions: ({ navigation }) => ({
            // title: navigation.state.params.date,
            title: 'Danh sách sản phẩm',
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
        }),
    },
    BillDetail: {
        screen: BillDetail,
        navigationOptions: ({ navigation }) => ({
            title: navigation.state.params.invoice,
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
        }),
    },
});