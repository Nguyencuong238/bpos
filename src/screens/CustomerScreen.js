import React from 'react'; // Version can be specified in package.json
import ListCustomer from '../components/CustomerScreen/ListCustomer';
import EditCustomer from '../components/CustomerScreen/EditCustomer';
import InfoCustomer from '../components/CustomerScreen/InfoCustomer';
import ListCity from '../components/CustomerScreen/ListCity';
import ListDistrict from '../components/CustomerScreen/ListDistrict';
import Listwards from '../components/CustomerScreen/Listwards';
import GroupCustomer from '../components/CustomerScreen/GroupCustomer';
import DetailOrder_History from '../components/CustomerScreen/DetailOrder_History';
import Receipts from '../components/CustomerScreen/Receipts';
import TypeReceipts from '../components/CustomerScreen/TypeReceipts';
import BankAccount from '../components/CustomerScreen/BankAccount';
import Personnel from '../components/CustomerScreen/Personnel';
import Submitter from '../components/CustomerScreen/Submitter';
import EditTypeReceipt from '../components/CustomerScreen/EditTypeReceipt';
import HeaderLeft from '../navigation/HeaderLeft';
import { MenuCss } from '../styles/menu';
import { createStackNavigator, NavigationActions} from "react-navigation";
import {  Button, Platform,TouchableOpacity,StyleSheet } from 'react-native';
import NavigatorService from '../services/NavigatorService';
import Icon from "react-native-vector-icons/Ionicons";

export default  Customers_StackNavigator = createStackNavigator({
    Cutomers: {
        screen: ListCustomer,
        navigationOptions: ({ navigation }) => ({
            title: 'Danh sách khách hàng',
            headerLeft: <HeaderLeft navigationProps={navigation} />,
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
            headerRight: (
                <TouchableOpacity style={Main.select_box_item_action_add} >
					<Icon
						name="ios-add"
						size={40}
						color="#545454"
						onPress = {() => NavigatorService.navigate('EditCustomer',{item:0})}
					/>
				</TouchableOpacity>
            ),
        }),
    },
    InfoCustomer: {
        screen: InfoCustomer,
        navigationOptions: ({ navigation }) => ({
            title: 'Thông tin khách hàng',
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
            headerRight: (
                <Button
                    onPress={() => {
                        NavigatorService.navigate('EditCustomer', {
                            item: navigation.state.params.item,
                        })
                    }}
                    title="Sửa"
                    color="#fff"
                    buttonStyle={{ backgroundColor: 'transparent' }}
                />
            ),
        }),
    },
    EditCustomer: {
        screen: EditCustomer,
        navigationOptions: ({ navigation }) => ({
            headerTitle: navigation.getParam('item', 'NO-ITEM') === 'NO-ITEM' ?'Thêm khách hàng':'Sửa khách hàng',
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
            headerRight: (
                <Button
                    onPress={() => navigation.state.params.dispatch()}
                    title="Lưu"
                    color={Platform.OS === 'ios' ? '#fff' : null}
                />
            ),    
        }),
    },
    City: {
        screen: ListCity,
        navigationOptions: ({ navigation }) => ({
            title: 'Chọn Tỉnh/Thành',
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
            headerRight: (
                <Button
                    onPress={() => navigation.state.params.dispatch()}
                    title="Lưu"
                    color={Platform.OS === 'ios' ? '#fff' : null}
                />
            ),  
        }),
    },
    District: {
        screen: ListDistrict,
        navigationOptions: ({ navigation }) => ({
            title: 'Quận/Huyện',
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
        }),
    },
    Wards: {
        screen: Listwards,
        navigationOptions: ({ navigation }) => ({
            title: 'Chọn Xã/Phường',
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
        }),
    },
    GroupCustomer: {
        screen: GroupCustomer,
        navigationOptions: ({ navigation }) => ({
            title: 'Nhóm KH',
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
        }),
    },
    DetailOrder_History: {
        screen: DetailOrder_History,
        navigationOptions: ({ navigation }) => ({
            title: 'Chi tiêt',
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
        }),
    },
    TypeReceipts: {
        screen: TypeReceipts,
        navigationOptions: ({ navigation }) => ({
            title: 'Nhóm KH',
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
            headerRight: (
                <TouchableOpacity style={Main.select_box_item_action_add} >
					<Icon
						name="ios-add"
						size={40}
						color="#545454"
						onPress = {() => NavigatorService.navigate('EditTypeReceipt',{param:{id:0,Receiptstype:'THU'}})}
					/>
				</TouchableOpacity>
            ),
        }),
    },
    Receipts: {
        screen: Receipts,
        navigationOptions: ({ navigation }) => ({
            title: 'Nhóm KH',
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
            headerRight: (
                <Button
                    onPress={() => navigation.state.params.dispatch()}
                    title="Lưu"
                    color={Platform.OS === 'ios' ? '#fff' : null}
                />
            ), 
        }),
    },
    BankAccount: {
        screen: BankAccount,
        navigationOptions: ({ navigation }) => ({
            title: 'Nhóm KH',
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
        }),
    },
    Personnel: {
        screen: Personnel,
        navigationOptions: ({ navigation }) => ({
            title: 'Nhóm KH',
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
        }),
    },
    Submitter: {
        screen: Submitter,
        navigationOptions: ({ navigation }) => ({
            title: 'Nhóm KH',
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
        }),
    },
    EditTypeReceipt: {
        screen: EditTypeReceipt,
        navigationOptions: ({ navigation }) => ({
            title: 'Nhóm KH',
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
            headerRight: (
                <Button
                    onPress={() => navigation.state.params.dispatch()}
                    title="Lưu"
                    color={Platform.OS === 'ios' ? '#fff' : null}
                />
            ), 
        }),
    },

   
});

const Main = StyleSheet.create({
	select_box_item_action_add: {
		alignItems: 'center',
        flexDirection: 'row',
        marginRight:5,
	},
	
});

