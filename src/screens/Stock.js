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

import StockScreen from '../components/stock/StockScreen';
import StockScreenDetail from '../components/stock/StockScreenDetail';
import CreateStockTake from '../components/stock/CreateStockTake';
import ScannerBarcode from '../components/stock/ScannerBarcode';
import SearchProduct from '../components/stock/SearchProduct';
import Modal_Category from '../components/stock/Modal_Category';
import Info_Personel from '../components/stock/Info_Personel'

import { Ionicons } from "@expo/vector-icons";
import { MenuCss } from '../styles/menu';
import NavigatorService from '../services/NavigatorService';
import { Button } from "react-native-elements";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
} from 'react-native';
const createStackNavigatorStock = createStackNavigator({
    StockScreen: {
      screen: StockScreen,
      navigationOptions: ({ navigation }) => ({
          title: 'Kiểm kho',
          headerLeft: <HeaderLeft navigationProps={navigation} />,
          headerStyle: MenuCss.headerStyle,
          headerTintColor: '#fff',
      }),
    },
    StockScreenDetail: {
        screen: StockScreenDetail,
        navigationOptions: ({ navigation }) => ({
          title: 'Chi tiết nhập kho',
          headerStyle: MenuCss.headerStyle,
          headerTintColor: '#fff',
      }),
    },
    CreateStockTake: {
      screen: CreateStockTake,
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
    ScannerBarcode: {
      screen: ScannerBarcode,
      navigationOptions: ({ navigation }) => ({
        title: 'Quét mã vạch',
        headerStyle: MenuCss.headerStyle,
        headerTintColor: '#fff',
    }),
    },
    SearchProduct: {
      screen: SearchProduct,
      navigationOptions: ({ navigation }) => ({
        title: 'Tìm kiếm sản phẩm',
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
        headerRight: (
          <Button
              onPress={() => navigation.state.params.dispatch()}
              title="Áp dụng"
              color="#fff"
              buttonStyle={{ backgroundColor: 'transparent' }}
          />
      ),
    }),
    },
    Modal_Category: {
      screen: Modal_Category,
      navigationOptions: ({ navigation }) => ({
        title: 'Danh mục sản phẩm',
        headerStyle: MenuCss.headerStyle,
        headerTintColor: '#fff',
        headerRight: (
          <Button
               titleStyle={{fontSize: 15,color:'#fff'}}
               buttonStyle={{backgroundColor:'none'}}
               title="Cập nhật"
               onPress={() => navigation.state.params.dispatch()}
               // onPress={this.onShowType}
           />
       ),
    }),
    },
});

const Stock = createAppContainer(createStackNavigatorStock);
Stock.navigationOptions = {
    title: 'Kiểm kho',
};
export default Stock;

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