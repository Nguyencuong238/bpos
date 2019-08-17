import React, { PureComponent } from 'react';
import { Button } from 'react-native-elements';
import { createStackNavigator, } from 'react-navigation';
import { MenuCss } from '../styles/menu';
import HeaderLeft from '../navigation/HeaderLeft';
import DebtReport from '../components/SupplierReport1/Debt/Report';
import DepotReport from '../components/SupplierReport1/Depot/Report';
import SupplierReport from '../components/SupplierReport1/Supplier/Report';
import AllSupplierReport from '../components/SupplierReport1/index';
// import CustomerDebt from '../components/CustomerReport/CustomerDebt copy/CustomerDebt';
import CustomerDebt from '../components/CustomerReport/CustomerDebt/CustomerDebt';
import CustomerProfit from '../components/CustomerReport/CustomerProfit/CustomerProfit';
import NavigatorService from '../services/NavigatorService';
import Icon from "react-native-vector-icons/Ionicons";


export default CustomerReportScreen = createStackNavigator({
    AllSupplierReport: {
        screen: AllSupplierReport,
        navigationOptions: ({ navigation }) => ({
            title: 'Báo cáo NCC',
            headerLeft: <HeaderLeft navigationProps={navigation} />,
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
        }),
    },
    DebtReport: {
        screen: DebtReport,
        navigationOptions: ({ navigation }) => ({
            title: 'Báo cáo NCC - công nợ',
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
    DepotReport: {
        screen: DepotReport,
        navigationOptions: ({ navigation }) => ({
            title: 'Báo cáo NCC - nhập hàng',
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
    SupplierReport: {
        screen: SupplierReport,
        navigationOptions: ({ navigation }) => ({
            title: 'Báo cáo NCC - hàng nhập',
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
});