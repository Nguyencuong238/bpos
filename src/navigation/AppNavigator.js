import React, { Component } from 'react';
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import { Ionicons } from "@expo/vector-icons";
import { forEach } from 'lodash';
import DrawerContent from './DrawerContent';
import HeaderLeft from './HeaderLeft';
import SettingsScreen from '../screens/SettingsScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ReportScreen from '../screens/ReportScreen';
import EndDayReportScreen from '../screens/EndDayReportScreen';
import ReportEndDayScreen from '../screens/ReportEndDayScreen';
import CustomerScreen from '../screens/CustomerScreen';
import Stock from '../screens/Stock';
import Warehousing from '../screens/Warehousing';
import ReportPromotionScreen from '../screens/ReportPromotionScreen';
import ProductScreen from '../screens/ProductScreen';
import CustomerReportScreen from '../screens/CustomerReportScreen';
import SupplierReportScreen from '../screens/SupplierReportScreen';
import SupplierDebtScreen from '../screens/SupplierDebtScreen';
import SupplierScreen from '../screens/SupplierScreen';
import SupplierDepotScreen from '../screens/SupplierDepotScreen';
import ProductReportScreen from '../screens/ProductReportScreen';
import PermissionScreen from '../screens/PermissionScreen';
import { MenuCss } from '../styles/menu';



const listRouter = [
    {
        router: 'Dashboard',
        screen: DashboardScreen,
        label: 'Trang chủ',
        icon: 'md-home',
    },
    {
        router: 'Customers',
        screen: CustomerScreen,
        label: 'Khách hàng',
        icon: 'ios-people',
    },
    {
        router: 'Stock',
        screen: Stock,
        label: 'Kiểm kho',
        icon: 'md-checkmark-circle-outline',
    },
    {
        router: 'Warehousing',
        screen: Warehousing,
        label: 'Nhập kho',
        icon: 'ios-paper',
    },
    {
        router: 'Report',
        screen: ReportScreen,
        label: 'Báo cáo',
        icon: 'md-stats',
    },
    {
        router: 'ReportEndDayScreen',
        screen: ReportEndDayScreen,
        label: 'Báo cáo cuối ngày',
        icon: 'md-stats',
    },
    {
        router: 'ReportPromotion',
        screen: ReportPromotionScreen,
        label: 'Báo cáo KM',
        icon: 'md-stats',
    },
    {
        router: 'Goods',
        screen: ProductScreen,
        label: 'Hàng hóa',
        icon: 'ios-cube',
    },
    {
        router: 'CustomerReport',
        screen: CustomerReportScreen,
        label: 'Báo cáo khách hàng',
        icon: 'md-stats',
    },
    {
        router: 'AllSupplierReport',
        screen: SupplierReportScreen,
        label: 'Báo cáo NCC',
        icon: 'md-stats',
    },
    // {
    //     router: 'SupplierDebt',
    //     screen: SupplierDebtScreen,
    //     label: 'Báo cáo NCC - công nợ',
    //     icon: 'md-stats',
    // },
    // {
    //     router: 'Supplier',
    //     screen: SupplierScreen,
    //     label: 'Báo cáo NCC - nhập hàng',
    //     icon: 'md-stats',
    // },
    // {
    //     router: 'SupplierDepotScreen',
    //     screen: SupplierDepotScreen,
    //     label: 'Báo cáo NCC - hàng nhập',
    //     icon: 'md-stats',
    // },
    {
        router: 'ProductReportScreen',
        screen: ProductReportScreen,
        label: 'Báo cáo hàng hóa',
        icon: 'md-stats',
    },
    {
        router: 'EndDayReportScreen',
        screen: EndDayReportScreen,
        label: 'Báo cáo cuối ngày',
        icon: 'md-stats',
    },
    {
        router: 'PermissionScreen',
        screen: PermissionScreen,
        label: 'Phân quyền',
        icon: 'ios-people',
    },
];

const listDrawerNavigator = [];
forEach(listRouter, (v) => {
    const item = {
        screen: v.screen,
        navigationOptions: {
            drawerLabel: v.label,
            drawerIcon: ({ tintColor }) => (
                <Ionicons name={v.icon} style={{ color: tintColor, fontSize: 20 }} />
            ),
        },
    };
    listDrawerNavigator[v.router] = item;
});

const DrawerNavigator = createDrawerNavigator(
    listDrawerNavigator,
    {
        initialRouteName: 'Dashboard',
        drawerBackgroundColor: "#fff",
        drawerType: 'slide',
        contentOptions: {
            inactiveLabelStyle: '#fff',
            activeLabelStyle: '#fff',
            activeTintColor: '#000',
            activeBackgroundColor: '#ddd',
            inactiveTintColor: '#000',
            itemsContainerStyle: {
                marginVertical: 0,
                paddingVertical: 0,
            },
            iconContainerStyle: {
                opacity: 1
            }
        },
        contentComponent: props => <DrawerContent {...props} listRouter={listRouter} />
    }
);

export default DrawerNavigator;

