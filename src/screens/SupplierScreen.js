import React, { PureComponent } from 'react';
import { Button } from 'react-native-elements';
import { createStackNavigator, } from 'react-navigation';
import { MenuCss } from '../styles/menu';
import HeaderLeft from '../navigation/HeaderLeft';
import SupplierReport from '../components/SupplierReport/Supplier/Report';
import NavigatorService from '../services/NavigatorService';
import Icon from "react-native-vector-icons/Ionicons";


export default SupplierScreen = createStackNavigator({
    CustomerReport: {
        screen: SupplierReport,
        navigationOptions: ({ navigation }) => ({
            title: 'Báo cáo NCC-nhập hàng',
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