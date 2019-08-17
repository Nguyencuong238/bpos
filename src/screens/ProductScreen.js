import React, { PureComponent } from 'react';
import { Button } from 'react-native-elements';
import { createStackNavigator, } from 'react-navigation';
import { MenuCss } from '../styles/menu';
import HeaderLeft from '../navigation/HeaderLeft';
import Goods from '../components/Products/Goods';
import ItemGood from '../components/Products/ItemGood';
import SearchGoods from '../components/Products/SearchGoods';
import EditGood from '../components/Products/EditGood';
import ScannerBarcode from '../components/Products/ScannerBarcode';
import GoodCategory from '../components/Products/GoodCategory';
import NavigatorService from '../services/NavigatorService';
import Icon from "react-native-vector-icons/Ionicons";

export default ProductScreen = createStackNavigator({
    Goods: {
        screen: Goods,
        navigationOptions: ({ navigation }) => ({
            title: 'Hàng hóa',
            headerLeft: <HeaderLeft navigationProps={navigation} />,
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
            headerRight: (
                <Button
                    onPress={() => {
                        NavigatorService.navigate('editGood')
                    }}
                    // title="Thêm"
                    color="#fff"
                    style={{ fontSize: '11' }}
                    buttonStyle={{ backgroundColor: 'transparent' }}
                    icon={
                        <Icon
                            name="ios-add"
                            size={32}
                            color="white"
                        />
                    }
                />
            ),
        }),
    },
    itemGood: {
        screen: ItemGood,
        navigationOptions: ({ navigation }) => ({
            title: navigation.state.params.sku,
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
            headerRight: (
                <Button
                    onPress={() => {
                        NavigatorService.navigate('editGood', {
                            itemId: navigation.state.params.itemId,
                        })
                    }}
                    title="Sửa"
                    color="#fff"
                    style={{ fontSize: '11' }}
                    buttonStyle={{ backgroundColor: 'transparent' }}
                />
            ),
        }),
    },
    searchGood: {
        screen: SearchGoods,
        navigationOptions: ({ navigation }) => ({
            title: 'Tìm kiếm hàng hóa',
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
    editGood: {
        screen: EditGood,
        navigationOptions: ({ navigation }) => {
            const itemId = navigation.getParam('itemId');
            const title =   itemId ? 'Sửa sản phẩm' : 'Thêm sản phẩm';
            return ({
                title: title,
                headerRight: (
                    <Button
                        onPress={() => navigation.state.params.dispatch()}
                        title="Lưu"
                        color="#fff"
                        buttonStyle={{ backgroundColor: 'transparent' }}
                    />
                ),
                headerStyle: MenuCss.headerStyle,
                headerTintColor: '#fff',
            });
        },
    },
    ScannerBarcodeGood: {
        screen: ScannerBarcode,
        navigationOptions: ({ navigation }) => ({
            title: 'Quét mã vạch',
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
        }),
    },
    GoodCategory: {
        screen: GoodCategory,
        navigationOptions: ({ navigation }) => ({
            title: 'Danh mục',
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
        }),
    },
});