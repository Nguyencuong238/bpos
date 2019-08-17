import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Text, ActivityIndicator, Modal, Button } from 'react-native';
import { ListItem, SearchBar, Avatar, Input } from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons"
import moment from 'moment';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';

class DetailOrder_History extends Component {
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
        const item = this.props.navigation.getParam('item', 'NO-ADD');
        return (
                <View style={styles.container}>
                    <Input
                        style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1, textAlign: 'center' }}
                        pointerEvents="none"
                        value= {item.invoice} 
                        leftIcon={
                            <Text style={styles.title3} >Mã hóa đơn</Text>
                        }
                    />
                    <Input
                        style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1, textAlign: 'center' }}
                        pointerEvents="none"
                        value= {item.created_at} 
                        leftIcon={
                            <Text style={styles.title3} >Thời gian</Text>
                        }
                    />
                    <Input
                        style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1, textAlign: 'center' }}
                        pointerEvents="none"
                        value= {item.seller_name} 
                        leftIcon={
                            <Text style={styles.title3} >Người bán</Text>
                        }
                    />
                       
                    <NumberFormat
                        value={parseFloat(item.sub_total)}
                        displayType={'text'}
                        thousandSeparator={true}
                        suffix={' đ'}
                        renderText={value => (
                            <Input
                                style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1, textAlign: 'center' }}
                                pointerEvents="none"
                                value= {value} 
                                leftIcon={
                                    <Text style={styles.title3} >Tổng tiền hàng</Text>
                                }
                            />
                        )}
                    />
                    <NumberFormat
                        value={parseFloat(item.special_amount)}
                        displayType={'text'}
                        thousandSeparator={true}
                        suffix={' đ'}
                        renderText={value => (
                            <Input
                                style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1, textAlign: 'center' }}
                                pointerEvents="none"
                                value= {value} 
                                leftIcon={
                                    <Text style={styles.title3} >Giảm giá</Text>
                                }
                            />
                        )}
                    />
                    <NumberFormat
                        value={parseFloat(item.paying_amount)}
                        displayType={'text'}
                        thousandSeparator={true}
                        suffix={' đ'}
                        renderText={value => (
                            <Input
                                style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1, textAlign: 'center' }}
                                pointerEvents="none"
                                value= {value} 
                                leftIcon={
                                    <Text style={styles.title3} >Đã trả</Text>
                                }
                            />
                        )}
                    />
                     <Input
                        style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1, textAlign: 'center' }}
                        pointerEvents="none"
                        value= {item.status_name} 
                        leftIcon={
                            <Text style={styles.title3} >Trạng thái</Text>
                        }
                    />
                    
                </View> 
            
        );
    }
}

const mapStateToProps = ({ state, persist }) => ({
    info_customer: state.info_customer,
    depot_current: persist.depot_current,
});

export default connect(mapStateToProps)(DetailOrder_History);

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
        flex: 1, 
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop:7,
        height:30
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

