import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Text, ActivityIndicator, Modal, Button } from 'react-native';
import { ListItem, SearchBar, Avatar, Input } from 'react-native-elements';
import { getAddress_api, customer_api, validation_api } from '../../services/api/fetch';
import Icon from "react-native-vector-icons/Ionicons"
import { ImagePicker, Permissions, Constants } from 'expo';
import ActionSheet from 'react-native-actionsheet';
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';
import { connect } from 'react-redux';
import waterfall from 'async/waterfall';
import { isEmpty } from 'lodash';
import { showMessage } from "react-native-flash-message";
import { R_CUSTOMER_FORM } from '../../reducers/actions/index';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { DataTable } from 'react-native-paper';
import DetailCustomer from './DetailCustomer';
import Customer_Debt from './Customer_Debt';
import Order_History from './Order_History';
import Point_History from './Point_History';

class InfoCustomer extends Component {
    constructor(props) {
        super(props);
        this.reRenderSomething = this.props.navigation.addListener('willFocus', () => {
            console.log('quang');
            this.getInfo();
        });
        this.state = {
            selected: 'Giới tính',
            image: null,
            isDateTimePickerVisible: false,
            date: 'Ngày sinh',
            loading: false,
            customer: null,
        }
    }

    componentWillMount() {
         this.getInfo();   
    }

    componentWillUnmount() {
        const { info_customer, dispatch } = this.props;
        info_customer.full_name.value = '';
        info_customer.mobile_phone.value = '';
        info_customer.address.value = ''; 
        info_customer.email.value = '';
        info_customer.gender.value=1;
        info_customer.province.value = '';
        info_customer.province_id.value = 0;
        info_customer.district_id.value = 0;
        info_customer.district.value = '';
        info_customer.ward_id.value = 0;
        info_customer.ward.value = '';
        info_customer.type.value = 1;
        info_customer.birthday.value = '';
        dispatch({ type: R_CUSTOMER_FORM, payload: { ...info_customer } });
    }

    getInfo() {
        const { info_customer, dispatch } = this.props;
        const { navigation } = this.props;
        const customer = navigation.getParam('item', 'NO-ID');
        this.setState({ loading: true }, () => {
            customer_api({
                mtype: 'getInfo',
                customer_id: customer.customer_id,
            }).then(({ customer }) => {
                if (!isEmpty(customer)) {
                    info_customer.customer_id.value = customer.customer_id || '';
                    info_customer.full_name.value = customer.full_name || '';
                    info_customer.email.value = customer.email || '';
                    info_customer.mobile_phone.value = customer.mobile_phone || '';
                    info_customer.address.value = customer.address.address || '';
                    info_customer.gender.value = parseInt(customer.gender) || '';
                    info_customer.birthday.value = customer.birthday || '';
                    info_customer.avatar.value = customer.avatar || '';
                    info_customer.position.value = customer.address.position || '';
                    info_customer.address_id.value = customer.address.id || 0;
                    info_customer.province_id.value = customer.address.province_id || 0;
                    info_customer.province.value = customer.address.province || '';
                    info_customer.district_id.value = customer.address.district_id || 0;
                    info_customer.district.value = customer.address.district || '';
                    info_customer.ward_id.value = customer.address.ward_id || 0;
                    // info_customer.ward.value = customer.address.ward || '';
                    info_customer.type.value = customer.address.type || 0;
                    info_customer.debt = customer.debt || [];
                    info_customer.tagCustomerId = customer.tagCustomerId || [];
                    console.log(info_customer ,'customer');
                    this.getWard(customer.address.district_id, customer.address.ward_id);
                    
                    dispatch({ type: R_CUSTOMER_FORM, payload: { ...info_customer } });
                }
            });
        });
    }

    async getWard(district_id, ward_id) {
        console.log(district_id,'chay chua ward');
        const { info_customer, dispatch } = this.props;
        if (district_id) {
            await getAddress_api({
                mtype: 'listWard',
                district_id:district_id,
            }).then(({ wards }) => {
                wards.map((v, k) => {
                    if (ward_id === v.wardid.toString()) {
                        info_customer.ward.value = v.name;
                    }
                });
                dispatch({ type: R_CUSTOMER_FORM, payload: { ...info_customer } });
            });
        }
        this.setState({ loading:false });
        console.log(this.state.loading,'chay chua m');
    }

    render() {
        const { info_customer } = this.props;
        const {loading} = this.state;
        console.log(this.props,'aaa');
        return (
            <View style={styles.container}>
                <ScrollableTabView
                    initialPage={0}
                    // renderTabBar={() => <DefaultTabBar />}
                    tabBarUnderlineStyle={{ backgroundColor: '#28af6b', height: 3 }}
                    tabBarActiveTextColor={{ color: 'red', backgroundColor: '#28af6b' }}
                    tabBarInactiveTextColor={{ color: 'red', backgroundColor: '#28af6b' }}
                    tabBarBackgroundColor={{ color: 'red', backgroundColor: '#28af6b' }}
                    tabBarTextStyle={{ color: '#000' }}
                >
                    <ScrollView tabLabel='Thông tin' >
                        <DetailCustomer loading ={loading}/>
                    </ScrollView>
                    <View tabLabel="Công nợ" >
                        <Customer_Debt navigation = {this.props.navigation}/>
                    </View>
                    <View tabLabel="Lịch sử">
                        <Order_History navigation = {this.props.navigation}/>
                    </View>
                    <View tabLabel="Tích điểm">
                        <Point_History/>
                    </View>
                </ScrollableTabView>
                
            </View>
        );
    }
}

const mapStateToProps = ({ state, persist }) => ({
    info_customer: state.info_customer,
    depot_current: persist.depot_current,
});
export default connect(mapStateToProps)(InfoCustomer);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor:'#4CAF50',
    },
    container1: {
        flex: 1,
        backgroundColor:'#D3D3D3',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height:35,
    },
    container2: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    input: {
        marginTop: 20,
    },
    picker: {

        marginLeft: 10,
        marginTop: -10,

    },
    title: {
        marginRight: 37,
        fontSize: 18,
    },
    title1: {
        marginRight: 25,
        fontSize: 18,
    },
    title2: {
        marginRight: 32,
        fontSize: 18,
    },
    title3: {
        marginRight: 56,
        fontSize: 18,
    },
    title4: {
        marginRight: 42,
        fontSize: 18,
    },
    gender: {
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },


});

const Main1 = StyleSheet.create({
    color_link:{
       color:'#0084cc',
    },
    color_error:{
        color:'red',
    },
    no_bg:{
       backgroundColor:0,
    },
    padding_15:{
        padding:15,
    },
    margin_15:{
        margin:15,
    },
    table_container: { 
        padding: 10, 
        backgroundColor: '#FFF',
        height:230 
    },
    table_scroll: {
        height:120 
    },
    table_head: {  
        height: 40, 
        backgroundColor: '#f1f8ff'  
    },
    table_total:{
        height: 40, 
        backgroundColor: '#FFF'   
    },
    table_wrapper: { 
        flexDirection: 'row' 
    },
    table_title: { 
        flex: 1, 
        backgroundColor: '#f6f8fa' 
    },
    table_row: {  
        height: 30,
        backgroundColor: '#f9f9f9' 
    },
    table_text: { 
        textAlign: 'center' 
    },
    select_box_main:{
        backgroundColor:'#efefef',
        padding:15,
        flexDirection:'row',
        justifyContent: 'space-between',
        borderBottomWidth:1,
        borderBottomColor:'#ddd'
    },
    select_box_item:{
        flexDirection:'row',
        alignItems: 'center',
    },
    select_box_item_action_icon:{
        flexDirection:'row',
        alignItems: 'center',
    },
    btn_fixed:{
        position:'absolute',
        bottom:0,
        width:'100%',
        flexDirection:'row',
        backgroundColor:'#ddd',
        justifyContent:'space-around',
        padding:10,
        paddingHorizontal: 0,
    },
    btn_fixed_box:{
        flex:50,
        width:'33.33%',
        paddingHorizontal:15,
    },
    btn_submit_button:{
        width:'100%',
    },
    btn_submit_button_title:{
        fontSize:15,
    },
    btn_submit_button_success:{
        backgroundColor:'#28af6b',
    }
})

