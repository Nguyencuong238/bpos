import React, { PureComponent } from 'react';
import { Button } from 'react-native-elements';
import { createStackNavigator, } from 'react-navigation';
import { MenuCss } from '../styles/menu';
import HeaderLeft from '../navigation/HeaderLeft';
import SupplierDebtReport from '../components/SupplierReport/Debt/Report';
import NavigatorService from '../services/NavigatorService';
import Icon from "react-native-vector-icons/Ionicons";


export default SupplierDebtScreen = createStackNavigator({
    CustomerReport: {
        screen: SupplierDebtReport,
        navigationOptions: ({ navigation }) => ({
            title: 'Báo cáo NCC-công nợ',
            headerLeft: <HeaderLeft navigationProps={navigation} />,
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
            // headerRight: (
            //     <Button
            //         onPress={() => navigation.state.params.dispatch()}
            //         color="#fff"
            //         style={{ fontSize: '11' }}
            //         buttonStyle={{ backgroundColor: 'transparent' }}
            //         icon={
            //             <Icon
            //                 name="logo-freebsd-devil"
            //                 size={32}
            //                 color="white"
            //             />
            //         }
            //     />
            // ),
        }),
    },
});