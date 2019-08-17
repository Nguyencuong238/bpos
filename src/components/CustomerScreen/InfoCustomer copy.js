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
            info_customer: {
                customer_id: { value: 0, validate: true, msg: null },
                full_name: { value: '', validate: true, msg: null },
                mobile_phone: { value: '', validate: true, msg: null },
                email: { value: '', validate: true, msg: null },
                address: { value: '', validate: true, msg: null },
                province_id: { value: 0, validate: true, msg: null },
                province: { value: '', validate: true, msg: null },
                district_id: { value: 0, validate: true, msg: null },
                district: { value: '', validate: true, msg: null },
                ward_id: { value: 0, validate: true, msg: null },
                ward: { value: '', validate: true, msg: null },
                address_id: { value: 0, validate: true, msg: null },
                gender: { value: 1, validate: true, msg: null },
                birthday: { value: '', validate: true, msg: null },
                avatar: { value: '', validate: true, msg: null },
                position: { value: '', validate: true, msg: null },
                type: { value: 1, validate: true, msg: null },
                receipeint_id: { value: '', validate: true, msg: null },
                debt: [],
            },
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
                console.log(customer,'aaaa');
                console.log(info_customer,'bbbb');
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
        if (district_id !== null) {
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


    componentWillReceiveProps(nextProps) {
        console.log('prop chay');
        const address = nextProps.navigation.getParam('address', 'NO-ADD');
        const { info_customer, dispatch } = this.props;
        if (address !== 'NO-ADD') {
            if (address.type === 'Tỉnh' || address.type === 'Thành phố') {
                info_customer['province'].value = address.name;
                info_customer['province_id'].value = address.provinceid;
                info_customer['district'].value = '';
                info_customer['district_id'].value = 0;
                info_customer['ward'].value = '';
                info_customer['ward_id'].value = 0;
            }
            if (address.type === 'Huyện' || address.type === 'Quận' || address.type === 'Thị Xã') {
                info_customer['district'].value = address.name;
                info_customer['district_id'].value = address.districtid;
                info_customer['ward'].value = '';
                info_customer['ward_id'].value = 0;
            }
            if (address.type === 'Thị Trấn' || address.type === 'Xã') {
                info_customer['ward'].value = address.name;
                info_customer['ward_id'].value = address.wardid;
            }
            dispatch({ type: R_CUSTOMER_FORM, payload: { ...info_customer } });
        }
    }


    render() {
        const optionArray4 = [
            'Chọn từ thư viện',
            'Chụp từ Camera',
            'Hủy',
        ];
        const optionsArray = [
            { value: 1, label: 'Nữ' },
            { value: 0, label: 'Nam' },
        ];
        const tmp = ['Hủy'];
        optionsArray.map((v) => tmp.push(v.label));
        const { navigation } = this.props;
        const { info_customer } = this.props;
        const { loading } = this.state;
        const province_id = info_customer.province_id.value;
        const district_id = info_customer.district_id.value;
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
                        <Modal
                            transparent={true}
                            animationType={'none'}
                            visible={loading}
                            onRequestClose={() => { console.log('close modal') }}>
                            <View style={styles.modalBackground}>
                                <View style={styles.activityIndicatorWrapper}>
                                    <ActivityIndicator
                                        animating={loading} 
                                        size='large'
                                    />
                                </View>
                            </View>
                        </Modal>
                        <Avatar
                            size="large"
                            rounded
                            icon={{ name: 'user', type: 'font-awesome' }}
                            source={{ uri: info_customer.avatar.value === '' ? '' : info_customer.avatar.value, }}
                            
                        />
                        <Input
                            containerStyle={styles.input}
                            placeholder='Tên khách hàng'
                            editable={false}
                            value={info_customer.full_name.value}
                            onChangeText={(text) => this.onChangeFormInput(text, 'full_name')}
                            leftIcon={
                                <Icon
                                    name='ios-person'
                                    size={24}
                                    color='black'
                                />
                            }
                        />
                        <Input
                            containerStyle={styles.input}
                            placeholder='Điện thoại'
                            editable={false}
                            value={info_customer.mobile_phone.value}
                            onChangeText={(text) => this.onChangeFormInput(text, 'mobile_phone')}
                            leftIcon={
                                <Icon
                                    name='ios-call'
                                    size={24}
                                    color='black'
                                />
                            }
                        />
                        <Input
                            containerStyle={styles.input}
                            placeholder='Email'
                            editable={false}
                            value={info_customer.email.value}
                            onChangeText={(text) => this.onChangeFormInput(text, 'email')}
                            leftIcon={
                                <Icon
                                    name='ios-mail'
                                    size={24}
                                    color='black'
                                />
                            }
                        />
                        <Input
                            containerStyle={styles.input}
                            placeholder='Địa chỉ'
                            editable={false}
                            value={info_customer.address.value}
                            onChangeText={(text) => this.onChangeFormInput(text, 'address')}
                            leftIcon={
                                <Icon
                                    name='ios-call'
                                    size={24}
                                    color='black'
                                />
                            }
                        />
                        <View style={styles.gender}>
                            <TouchableOpacity>
                                <Input
                                    style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1, textAlign: 'center' }}
                                    pointerEvents="none"
                                    editable={false}
                                    placeholder='Giới tính'
                                    value={info_customer.gender.value === 1 ? 'Nữ' : 'Nam'}
                                    leftIcon={
                                        <Text style={styles.title3} >Giới tính</Text>
                                    }
                                />
                            </TouchableOpacity>
                            <ActionSheet
                                ref={o => (this.ActionSheet = o)}
                                //Title of the Bottom Sheet
                                title={'Tùy chọn'}
                                //Options Array to show in bottom sheet
                                options={tmp}
                                //Define cancel button index in the option array
                                //this will take the cancel option in bottom and will highlight it
                                cancelButtonIndex={0}
                                //If you want to highlight any specific option you can use below prop
                                onPress={index => {
                                    //Clicking on the option will give you the index of the option clicked
                                    if (index !== 0) {
                                        info_customer['gender'].value = optionsArray[index - 1].value;
                                        this.setState({ info_customer });
                                    }
                                }}
                            />
                        </View>
                        <View style={styles.gender}>
                            <TouchableOpacity >
                                <Input
                                    style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1, textAlign: 'center' }}
                                    pointerEvents="none"
                                    editable={false}
                                    placeholder='ngay sinh'
                                    value={moment(info_customer.birthday.value).format('YYYY-MM-DD')}
                                    leftIcon={
                                        <Text style={styles.title4} >Ngày sinh</Text>
                                    }
                                />
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this.handleDatePicked}
                                onCancel={this.hideDateTimePicker}
                            />
                        </View>
                        <View>
                            <TouchableOpacity >
                                <Input
                                    style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1 }}
                                    pointerEvents="none"
                                    editable={false}
                                    placeholder='Tỉnh thành'
                                    value={info_customer.province.value}
                                    rightIcon={
                                        <Icon
                                            name='ios-arrow-forward'
                                            size={18}
                                            color='#ddd'
                                        />
                                    }
                                    leftIcon={
                                        <Text style={styles.title}>Tỉnh thành</Text>
                                    }
                                />
                            </TouchableOpacity>
                        </View>
                        <View >
                            <TouchableOpacity >
                                <Input
                                    style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1 }}
                                    pointerEvents="none"
                                    placeholder='Quận huyện'
                                    editable={false}
                                    value={info_customer.district.value}
                                    rightIcon={
                                        <Icon
                                            name='ios-arrow-forward'
                                            size={18}
                                            color='#ddd'
                                        />
                                    }
                                    leftIcon={
                                        <Text style={styles.title1}>Quận huyện</Text>
                                    }
                                />
                            </TouchableOpacity>
                        </View>
                        <View >
                            <TouchableOpacity >
                                <Input
                                    style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1 }}
                                    pointerEvents="none"
                                    placeholder='Xã phường'
                                    editable={false}
                                    value={info_customer.ward.value}
                                    rightIcon={
                                        <Icon
                                            name='ios-arrow-forward'
                                            size={18}
                                            color='#ddd'
                                        />
                                    }
                                    leftIcon={
                                        <Text style={styles.title2}>Xã phường</Text>
                                    }
                                />
                            </TouchableOpacity>
                        </View>
                        <ActionSheet
                            ref={o => (this.ActionSheet4 = o)}
                            //Title of the Bottom Sheet
                            title={'Tùy chọn'}
                            //Options Array to show in bottom sheet
                            options={optionArray4}
                            //Define cancel button index in the option array
                            //this will take the cancel option in bottom and will highlight it
                            cancelButtonIndex={2}
                            //If you want to highlight any specific option you can use below prop
                            onPress={index => {
                                //Clicking on the option will give you the index of the option clicked
                                if (index !== 2) {
                                    if (index === 1) {
                                        this._pickCamera();
                                    } else {
                                        this._pickLibrary();
                                    }
                                }
                            }}
                        />
                        <View >
                            <TouchableOpacity>
                                <Input
                                    style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1 }}
                                    pointerEvents="none"
                                    placeholder='Nhóm khách hàng'
                                    rightIcon={
                                        <Icon
                                            name='ios-arrow-forward'
                                            size={18}
                                            color='#ddd'
                                        />
                                    }
                                    leftIcon={
                                        <Text style={styles.title2}>Nhóm khách hàng</Text>
                                    }
                                />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>   
                    <ScrollView tabLabel="Công nợ">
                        <View style={styles.container1}>
                            <Text style={{marginTop:10}}> 4 bản ghi</Text>
                            <Text style={{marginTop:10}}> Nợ cần thu :20,000</Text>
                        </View>
                        <View style={styles.container2}>
                            <View style={{marginTop:15,marginLeft:15,marginRight:15}}>
                                <Text>TTHD00001</Text>
                                <Text style={{marginTop:7}}>28/07/1997</Text>
                            </View>
                            <View style={{marginTop:15,marginLeft:15,marginRight:15}}>
                                <Text>Thanh toán</Text>
                                <Text style={{marginTop:7}}>Nợ :20,000</Text>
                            </View>         
                        </View>
                    </ScrollView>
                    <ScrollView tabLabel="Lịch sử">
                        <View >
                            <Text>Friends</Text>
                        </View>
                    </ScrollView>
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

