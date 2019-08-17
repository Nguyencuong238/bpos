// import React from 'react';
import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from "react-navigation";
// import StockScreen from './StockScreen';
// import StockScreenDetail from './StockScreenDetail';
// import CreateStockTake from './CreateStockTake';
// import ScannerBarcode from './ScannerBarcode';
// import SearchProduct from './SearchProduct';
// import Modal_Category from './Modal_Category';
// import Info_Personel from './Info_Personel'

import WarehousingScreen from '../components/warehousing/WarehousingScreen';

import WarehousingScreenDetail from '../components/warehousing/WarehousingScreenDetail';
import CreateWarehouse from '../components/warehousing/CreateWarehouse';
import ListWarehouse from '../components/warehousing/ListWarehouse';
import SearchProductWarehouse from '../components/warehousing/SearchProductWarehouse';
import Info_Warehousing from '../components/warehousing/Info_Warehousing';
import Info_Personel from '../components/warehousing/Info_Personel';
import ScannerBarcode from '../components/warehousing/ScannerBarcode';
// import CreateStockTake from '../components/stock/CreateStockTake';
// import ScannerBarcode from '../components/stock/ScannerBarcode';
// import SearchProduct from '../components/stock/SearchProduct';
import Modal_Category from '../components/stock/Modal_Category';
// import Info_Personel from '../components/stock/Info_Personel'

import { Ionicons } from "@expo/vector-icons";
import { MenuCss } from '../styles/menu';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
} from 'react-native';
const createStackNavigatorStock = createStackNavigator({
    WarehousingScreen: {
      screen: WarehousingScreen,
      navigationOptions: ({ navigation }) => ({
          title: 'Nhập kho',
          headerLeft: <HeaderLeft navigationProps={navigation} />,
          headerStyle: MenuCss.headerStyle,
          headerTintColor: '#fff',
      }),
    },
    WarehousingScreenDetail: {
        screen: WarehousingScreenDetail,
        navigationOptions: ({ navigation }) => ({
          title: 'Chi tiết nhập kho',
          headerStyle: MenuCss.headerStyle,
          headerTintColor: '#fff',
      }),
    },
    CreateWarehouse: {
      screen: CreateWarehouse,
      navigationOptions: ({ navigation }) => ({
          title: 'Thêm mới',
          headerStyle: MenuCss.headerStyle,
          headerTintColor: '#fff',
        //   header: ({navigate}) => ({
        //     right: (
        //         <Info_Personel navigate={navigate}/>
        //     ),
        // }),
      }),
    },
    ListWarehouse: {
      screen: ListWarehouse,
      navigationOptions: ({ navigation }) => ({
          title: 'Danh sách nhà cung cấp',
          headerStyle: MenuCss.headerStyle,
          headerTintColor: '#fff',
      }),
    },
    Info_Warehousing: {
      screen: Info_Warehousing,
      navigationOptions: ({ navigation }) => ({
          title: 'Thanh toán',
          headerStyle: MenuCss.headerStyle,
          headerTintColor: '#fff',
      }),
    },
    ScannerBarcode: {
      screen: ScannerBarcode,
      navigationOptions: ({ navigation }) => ({
        title: 'Quét mã vạch',
        headerStyle: MenuCss.headerStyle,
        headerTintColor: '#fff',
    }),
    },
    SearchProductWarehouse: {
      screen: SearchProductWarehouse,
      navigationOptions: ({ navigation }) => ({
        title: 'Tìm kiếm sản phẩmxx',
        headerStyle: MenuCss.headerStyle,
        headerTintColor: '#fff',
    }),
    },
    Info_Personel: {
      screen: Info_Personel,
      navigationOptions: ({ navigation }) => ({
        title: 'Thông tin',
        headerStyle: MenuCss.headerStyle,
        headerTintColor: '#fff',
    }),
    },
    Modal_Category: {
      screen: Modal_Category,
      navigationOptions: ({ navigation }) => ({
        title: 'Danh mục sản phẩm',
        headerStyle: MenuCss.headerStyle,
        headerTintColor: '#fff',
    }),
    },
});

const Warehousing = createAppContainer(createStackNavigatorStock);
Warehousing.navigationOptions = {
    title: 'Nhập kho',
};
export default Warehousing;

class HeaderLeft extends Component {
  toggleDrawer = () => {
      this.props.navigationProps.toggleDrawer();
  };
  render() {
      return (
          <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
                  <Ionicons
                      name="md-menu"
                      size={32}
                      color="#fff"
                      style={{ marginLeft: 15 }}
                  />
              </TouchableOpacity>
          </View>
      );
  }
}

const styles = StyleSheet.create({
  headerStyle: {
      backgroundColor: '#28af6b',
  },
});