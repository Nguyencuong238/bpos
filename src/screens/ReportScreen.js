import React, { PureComponent } from 'react';
import { createStackNavigator, } from 'react-navigation';
import Report from '../components/reports/Report';
import RevenueDetail from '../components/reports/RevenueDetail';
import List_Bill from '../components/reports/List_Bill';
import BillDetail from '../components/reports/BillDetail';
import Depot_Revenue from '../components/reports/Depot_Revenue';
import { MenuCss } from '../styles/menu';
import HeaderLeft from '../navigation/HeaderLeft';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from 'react-native-picker-select';
import NavigatorService from '../services/NavigatorService';
import InfoCustomer from '../components/CustomerScreen/InfoCustomer';
import ItemGood from '../components/Products/ItemGood';
import EditGood from '../components/Products/EditGood';
import EditCustomer from '../components/CustomerScreen/EditCustomer';
import { Button } from 'react-native-elements';

// class LogoTitle extends React.Component {
//     onChangeSelect(type){
//         console.log(type);
//         NavigatorService.navigate(type);
//     }

//     render() {
//         const items = [
//             {
//                 label: 'Báo cáo cuối ngày',
//                 value: 'ReportEndDayScreen',
//             },
//             // {
//             //     label: 'Báo cáo 2',
//             //     value: 2,
//             // },
//             // {
//             //     label: 'Báo cáo 3',
//             //     value: 3,
//             // }
//         ];

//         return (
//             <View style={{ flexDirection: 'row' }}>
//                 <View style={{ 
//                     flex: 1,
//                 }}>
//                     <HeaderLeft navigationProps={this.props.navigationProps} />
//                 </View>
//                 <View style={{ flex: 1 }}>
//                     <RNPickerSelect
//                         placeholder={{
//                             label: 'Báo cáo',
//                             value: 'Report',
//                         }}
//                         items={items}
//                         onValueChange={(value) => this.onChangeSelect(value)}
//                         style={{
//                             ...pickerSelectStyles,
//                             iconContainer: {
//                                 top: 10,
//                                 right: 12,
//                             },
//                         }}
//                         Icon={() => {
//                             return <Ionicons name="md-arrow-dropdown" size={24} color="gray" />;
//                         }}
//                         value='Report'
//                     />
//                 </View>
                
//             </View>
//         );
//     }
// }

export default ReportScreen = createStackNavigator({
    Report: {
        screen: Report,
        navigationOptions: ({ navigation }) => ({
            title: 'Báo cáo',
            headerLeft: <HeaderLeft navigationProps={navigation} />,
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
            //headerTitle: <LogoTitle navigationProps={navigation} />,
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
    List_Bill: {
        screen: List_Bill,
        navigationOptions: ({ navigation }) => ({
            title: navigation.state.params.date,
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
    Depot_Revenue: {
        screen: Depot_Revenue,
        navigationOptions: ({ navigation }) => ({
            title: 'Doanh thu theo chi nhánh',
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
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
                    color="#28af6b"
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
                    color="#fff"
                    style={{ fontSize: '11' }}
                    buttonStyle={{ backgroundColor: 'transparent' }}
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
    editGood: {
        screen: EditGood,
        navigationOptions: ({ navigation }) => {
            const itemId = navigation.getParam('itemId');
            const title =   itemId ? 'Sửa sản phẩm' : 'Thêm sản phẩm';
            return ({
                title: title,
                headerRight: (
                    <Button
                        onPress={() => navigation.state.params.dispatch(true)}
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
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 14,
        // paddingTop: 13,
        // paddingHorizontal: 10,
        // paddingBottom: 12,
        // borderWidth: 1,
        // borderColor: '#E5E5E5',
        // borderRadius: 4,
        // backgroundColor: 'white',
        color: '#fff',
        // width: 150,
    },
});