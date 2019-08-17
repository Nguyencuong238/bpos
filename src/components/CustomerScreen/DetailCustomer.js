import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Text, ActivityIndicator, Modal, Button } from 'react-native';
import { ListItem, SearchBar, Avatar, Input } from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons"
import moment from 'moment';
import { connect } from 'react-redux';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';

class DetailCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: 'Giới tính',
            image: null,
            isDateTimePickerVisible: false,
            date: 'Ngày sinh',
            loading: false,
            customer: null,
        }
    }

    render() {
        const { info_customer, loading } = this.props;
        return (
                <View>
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
                    </View>
                    <View style={styles.gender}>
                        <TouchableOpacity >
                            <Input
                                style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1, textAlign: 'center' }}
                                pointerEvents="none"
                                editable={false}
                                placeholder='ngay sinh'
                                value={info_customer.birthday.value === '' ? '':moment(info_customer.birthday.value).format('YYYY-MM-DD')}
                                leftIcon={
                                    <Text style={styles.title4} >Ngày sinh</Text>
                                }
                            />
                        </TouchableOpacity>
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
                </View> 
            
        );
    }
}

const mapStateToProps = ({ state, persist }) => ({
    info_customer: state.info_customer,
    depot_current: persist.depot_current,
});

export default connect(mapStateToProps)(DetailCustomer);

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

