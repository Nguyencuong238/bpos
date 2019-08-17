import React, { PureComponent } from 'react';
import { Button } from 'react-native-elements';
import { createStackNavigator, } from 'react-navigation';
import { MenuCss } from '../styles/menu';
import HeaderLeft from '../navigation/HeaderLeft';
import ProductReport from '../components/ProductReport/ProductReport';
import ReportProductInStock from '../components/ProductReport/ReportProductInStock';
import ReportProductInOutStock from '../components/ProductReport/ReportProductInOutStock';
import ReportCustomerProduct from '../components/ProductReport/ReportCustomerProduct';
import ReportProductByUserId from '../components/ProductReport/ReportProductByUserId';
import ReportProductByManufacturer from '../components/ProductReport/ReportProductByManufacturer';
import NavigatorService from '../services/NavigatorService';
import Icon from "react-native-vector-icons/Ionicons";


export default ProductReportScreen = createStackNavigator({
    ProductReport: {
        screen: ProductReport,
        navigationOptions: ({ navigation }) => ({
            title: 'Báo cáo hàng hóa',
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
    ReportProductInStock: {
        screen: ReportProductInStock,
        navigationOptions: ({ navigation }) => ({
          title: 'Báo cáo hàng hóa trong kho',
          headerStyle: MenuCss.headerStyle,
          headerTintColor: '#fff',
      }),
    },
    ReportProductInOutStock: {
        screen: ReportProductInOutStock,
        navigationOptions: ({ navigation }) => ({
          title: 'Báo cáo xuất nhập tồn',
          headerStyle: MenuCss.headerStyle,
          headerTintColor: '#fff',
      }),
    },
    ReportCustomerProduct: {
        screen: ReportCustomerProduct,
        navigationOptions: ({ navigation }) => ({
          title: 'Báo cáo khách theo hàng bán',
          headerStyle: MenuCss.headerStyle,
          headerTintColor: '#fff',
      }),
    },
    ReportProductByUserId: {
      screen: ReportProductByUserId,
      navigationOptions: ({ navigation }) => ({
        title: 'Báo Cáo Nhân Viên Theo Hàng Hóa',
        headerStyle: MenuCss.headerStyle,
        headerTintColor: '#fff',
    }),
    },
    ReportProductByManufacturer: {
      screen: ReportProductByManufacturer,
      navigationOptions: ({ navigation }) => ({
        title: 'Báo cáo NCC theo hàng bán',
        headerStyle: MenuCss.headerStyle,
        headerTintColor: '#fff',
    }),
    },
});