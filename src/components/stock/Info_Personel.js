import qs from 'qs';
import React, {Component} from 'react';
import {  ActionSheetIOS, Platform,ScrollView, StyleSheet,Text,View,TouchableOpacity ,TextInput,Picker,FlatList,Modal,TouchableHighlight,Alert,AsyncStorage} from 'react-native';
import axios from 'axios';
import { Input, Button } from 'react-native-elements';
import { isEmptyStatement } from '@babel/types';
import { isEmpty, debounce, reduce as _reduce } from 'lodash';
import moment from 'moment';
import { personnel_api } from '../../services/api/fetch'
import Icon from "react-native-vector-icons/Ionicons";
import { stocktakesCss } from '../../styles/stock';
import { Main } from '../../styles/main';
import { goodsCss } from '../../styles/goods';

class Info_Personel extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            info_data:'',
            invoice:'',
            info:'',
            info_ios:'Người tạo',
        };
    }
    

    componentDidMount(){
        this.getInfo();
        const { navigation } = this.props;
        navigation.setParams({
            dispatch: this.onShowType.bind(this)
        });
    }

    getInfo = async () => {
        this.setState({loading:true})
        const params = {
            mtype: 'getAll',
        };
        // try {
        //     const res = await axios('https://wdevapi.bpos.vn/api/crm/personnel', {
        //         method: 'post',
        //         headers: {
        //             authcode: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1NjE5NjQxMjQsImV4cCI6MTU5MzU4NjUyNCwidWlkIjoxLCJhdXRoX2NvZGUiOiJmZjNjMWUxODBiNTIzNjQxZGQxODIyYWY1YmYwZjk4MyIsIm5vZGVfaWQiOjMwMSwiY2xhaW1zIjp7Im5vZGVfaWQiOiIzMDEifX0.X0HrLbSaWKa5BZGyyTJVreDf2wr12AHQYGJic0jIdJECS7Egm0-a6Nd07koiMNrAXR4NvAJEUn4DLYo2c0aNiLCsKfIZyBHsVmOMylogJoYZUeqhXh8nTgWrpsKkK_R_nJY7_IOr1dtNSZ-wEWGtUaIfBBgYMfsxtRqhA6OmFEO-iSmAscPx9t8jUWQcvmo9uw-wjvV-nGke8bIUZB7yT4W8IsOENrRIOAtXBegu8I4V72cl2TcSqhraOT2D97L2EilSj5TeuXat9QZjr3NQfbHLESVFmqFaNn_Zl7NWzXKQv9MCLFh9WcRyQM41_ajtAA8DKo5GUo_aNMHGR-MR1Q',
        //         },
        //         data: qs.stringify(params),
        //     });
        //     this.setState({info_data:res.data.data.personnels,loading:false})
        // } catch (error) {
        //     this.setState({loading:false})
        // }

        personnel_api(params).then((data) => {
            this.setState({info_data:data.personnels,loading:false})
        })
    }


    onShowType = () => {
        const { invoice,info} = this.state;
        console.log(invoice)
        console.log(info)
        this.props.navigation.navigate('CreateStockTake',{
            invoice_stock:invoice,
            info_person:info,
        });
    }

    renderInfo = (info) =>{
        const htm = info.map((v, k) => {
            return (
                <Picker.Item label={v.full_name} value={v.personnel_id} />
            );
        });
        return htm;
    }


    updateUser = (user) => {
        this.setState({ info: user })
    }

    // static navigationOptions = ({ navigation }) => {
    //     return {
    //     headerTitle: "Title",
    //     headerRight: (
    //        <Icon 
    //             name='ios-save' 
    //             size={30}
    //             color="red"
    //             style={{paddingHorizontal:15}}
    //             onPress={() => navigation.navigate('CreateStockTake',{

    //         })}
    //        />
    //       ),
    //     };
    // }

    showDateIOS(options) {
        const tmp = ['Hủy'];
        options.map((v) => tmp.push(v.full_name));
        ActionSheetIOS.showActionSheetWithOptions(
            { options: tmp, cancelButtonIndex: 0 }, (index) => {
                if (index !== 0) {
                    this.setState({ info: options[index - 1].personnel_id, info_ios: tmp[index] });
                }
            },
        );
    }

    render() {
        const { invoice,info,info_data,info_ios } = this.state;
        const { navigation } = this.props
        return (
            <View>
                <View style={goodsCss.goods_details_list}>
                    <View style={{ flex: 50,alignSelf:'center' }}>
                        <Text>Mã phiếu</Text>
                    </View>
                    <View style={{ flex: 50 }}>
                        <TextInput
                            placeholder="Mã phiếu tự động"
                            style={{height: 40, borderColor: '#ddd', borderWidth: 1,paddingHorizontal:15}}
                            value={this.state.invoice}
                            onChangeText={(invoice) => this.setState({invoice})}
                        />
                    </View>
                </View>
                <View style={goodsCss.goods_details_list}>
                    <View style={{ flex: 50 }}>
                        <Text>Ngày tạo</Text>
                    </View>
                    <View style={{ flex: 50 }}>
                        <Text style={{ fontWeight: '600' }}>{moment().startOf('day').format("YYYY-MM-DD")}</Text>
                    </View>
                </View>
                <View style={goodsCss.goods_details_list}>
                    <View style={{ flex: 50 }}>
                        <Text>Ngày cân bằng</Text>
                    </View>
                    <View style={{ flex: 50 }}>
                        <Text style={{ fontWeight: '600' }}>{moment().startOf('day').format("YYYY-MM-DD")}</Text>
                    </View>
                </View>
                <View style={goodsCss.goods_details_list}>
                    <View style={{ flex: 50 }}>
                        <Text>Người tạo</Text>
                    </View>
                    {!isEmpty(info_data)
                        &&(
                        <View style={{ flex: 50 }}>
                            {Platform.OS === 'ios' ? (
                                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.showDateIOS(info_data)}>
                                    <Text style={{ marginRight: 10 }}>{this.state.info_ios}</Text>
                                    <Icon
                                        name='ios-arrow-down'
                                        size={17}
                                        color="#000"
                                    />
                                </TouchableOpacity>
                            ) : (
                                <Picker
                                    selectedValue={this.state.info}
                                    style={{ width: 200}}
                                    onValueChange = {this.updateUser}
                                >
                                    {this.renderInfo(info_data)}
                                </Picker>
                            )}
                        </View>
                        )}
                </View>
            </View>
        );
    }
}

export default Info_Personel;

Info_Personel.navigationOptions = {
    title: 'Thông tin',
    drawerLabel: () => null,
};