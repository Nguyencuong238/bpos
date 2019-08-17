import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text,FlatList, Modal, Button,TextInput } from 'react-native';
import { ListItem, SearchBar, Avatar, Input } from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons"
import moment from 'moment';
import { connect } from 'react-redux';
import { goodsCss } from '../../styles/goods';
import { order_api, receipts_api } from '../../services/api/fetch';
import { isEmpty, find, sumBy } from 'lodash';
import ActionSheet from 'react-native-actionsheet';
import { showMessage}  from "react-native-flash-message";
import FlashMessage  from "react-native-flash-message";
import NumberFormat from 'react-number-format';
import DateTimePicker from "react-native-modal-datetime-picker";
import Spinner from 'react-native-loading-spinner-overlay';
import waterfall from 'async/waterfall';

class Modal_PayDebt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: 'Giới tính',
            image: null,
            isDateTimePickerVisible: false,
            date: 'Ngày sinh',
            loadingPayDebt: false,
            customer: null,
            modalVisible:false,
            debt_after: props.total_debt,
            listInvoices: null,
            spinner:false,
            total_paying_debt: 0,
            ke:0,
            debt: {
                note: '',
                created_time: moment().format('YYYY-MM-DD H:mm'),
                type_payment: 1,
                personnel_id: props.profile.personnel_id,

            },
        }
    }

    componentDidMount() {
        this.getListInvoiceDebt();
    }

    getListInvoiceDebt() {
        const { info_customer } = this.props;
        const params = {};
        this.setState({ loadingPayDebt: true });
        params.customer_id = info_customer.customer_id.value;
        params.mtype = 'getInvoiceDebtbyCustomer';
        order_api(params).then((v) => {
            if (v.status === true) {
                this.setState({ 
                    listInvoices: v.listInvoices,
                    loadingPayDebt: false,
                });
            } else {
                this.setState({ listInvoices: [],loadingPayDebt: false  });
            }
        });
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = date => {
        const {debt} = this.state;
        debt['created_time'] = moment(date).format('YYYY-MM-DD H:mm');
        this.setState({debt});
        this.hideDateTimePicker();
    };

    showActionSheet = () => {
        //To show the Bottom ActionSheet
        this.ActionSheet.show();
    };

    onChangeFormInput(type, e) {
        const { debt } = this.state;
        if (type === 'note') {
            debt[type] = e;
        }
        this.setState({ debt });
    }

    onChangeFormInputInvoice(e, k, debt) {
        const { total_debt } = this.props;
        const { listInvoices } = this.state;
        if (e === '') {
            e = 0;
        }
        if (parseFloat(debt) < parseFloat(e)) {
            listInvoices[k].paying_debt = parseFloat(debt);
            this.setState({listInvoices });
        } else {
            listInvoices[k].paying_debt = parseFloat(e);
            this.setState({ listInvoices });
        }
        //     this.setState({debt_after:debt_after });
        const total_paying = sumBy(listInvoices, (o) => parseFloat(o.paying_debt, 10));
        const debt_after = parseFloat(total_debt) - parseFloat(total_paying);
        this.setState({ total_paying_debt: total_paying, debt_after });
    }
                              
    renderSeparator = () => {
		return (
			<View
				style={{
					height: 1,
					width: "100%",
					backgroundColor: "#CED0CE",
					marginTop: 15,
				}}
			/>
		);
    };

    submitForm() {
        const { listInvoices, total_paying_debt, debt } = this.state;
        const { depot_current, info_customer } = this.props;
        waterfall([
            (callback) => {
                const check = find(listInvoices, (o) => o.paying_debt > 0);
                if (isEmpty(check)) {
                    this.refs.myLocalFlashMessage.showMessage({
                        message: "Bạn chưa nhập giá trị Thu từ khách.",
                        description: "",
                        type: "danger",
                        duration: 10000,
                    });
                } else {
                    callback(null, 'next');
                }
            },
        ], () => {
            const params = {
                mtype: 'createCashFlowbyCustomer',
                depot_id: depot_current,
                listInvoices,
                total_paying_debt,
                type_payment: debt.type_payment,
                created_time: debt.created_time,
                note: debt.note,
                type: 'THU',
                group_person: 1,
                person_info: info_customer.customer_id.value,
                personnel_id: debt.personnel_id,
                bank_account_id: '',
            };
            // console.log(params)
            this.createCashFlow(params);
        });
    }

    async createCashFlow(params) {
        const {onVisible, resfreshList} = this.props;
        onVisible(spinner = true);
        // this.setState({ spinner: true });
        await receipts_api(params).then((v) => {
            // this.setState({ spinner:false });
            if (v.status) {
                this.resetForm();
                resfreshList();
                console.log('chay modal');
                showMessage({
                    message: "Cập nhật công nợ thành công.",
                    description: "",
                    type: "success",
                    duration: 8000,
                });
            } else {
                showMessage({
                    message: "Vui lòng thử lại sau.",
                    description: "",
                    type: "danger",
                    duration: 8000,
                });
            }
        });
    }

    resetForm() {
        const { total_debt } = this.props;
        const { debt,clone_listInvoices } = this.state;
        debt.type_payment = 1;
        debt.note = '';
        debt.created_time = moment().format('YYYY-MM-DD H:mm');
        this.setState({ 
            debt,
            debt_after: total_debt,
            total_paying_debt: 0,
        });
    }

    renderItem = (item,index) => {
        console.log(item,'bug ne');
        return (
            <View>
                <View style={styles.container2}>
                    <View style={{marginTop:15,marginLeft:15,marginRight:15}}>
                        <Text>
                            {item.invoice}
                        </Text>
                        <Text style={{marginTop:7}}>{item.created_at}</Text>
                    </View>
                    <View style={{marginTop:15,marginLeft:15,marginRight:15}}>
                        <NumberFormat
                            value={parseFloat(item.total)}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={' đ'}
                            renderText={value => <Text>Tổng:{value}</Text>}
                        />    
                        <NumberFormat
                            value={parseFloat(item.paying_amount)}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={' đ'}
                            renderText={value => <Text style={{marginTop:7}}>Thu trước:{value}</Text>}
                        />
                        <NumberFormat
                            value={parseFloat(item.debt_amount)}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={' đ'}
                            renderText={value => <Text style={{marginTop:7}}>Cần thu:{value}</Text>}
                        />
                        <Input
                            keyboardType='number-pad'
                            onChangeText={(text) => this.onChangeFormInputInvoice(text, index, item.debt_amount)}  
                            value={item.paying_debt.toString()}                                  
                        />
                    </View>         
                </View>
            </View>
        )
    }

    render() {
        const {total_debt,modalVisible, onVisible,resfreshList} = this.props;
        const { debt,total_paying_debt,listInvoices, loadingPayDebt } = this.state;
        const optionsArray = [
            { value: 1, label: 'Tiền mặt' },
            { value: 2, label: 'Chuyển khoản' },
        ];
        const tmp = ['Hủy'];
        optionsArray.map((v) => tmp.push(v.label));
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>
                <View>
                    <FlashMessage ref="myLocalFlashMessage" />
                    <Button
                        title="Trở về"
                        onPress={() => {
                            onVisible();
                            this.resetForm();
                            
                        }}
                    />
                    <Button
                        title="Lưu"
                        onPress={() => {
                            this.submitForm();
                        }}
                    />
					<View style={goodsCss.goods_details_list}>
                        <View style={{ flex: 50 }}>
                            <Text> Nợ hiện tại:</Text>
                        </View>
                        <View style={{ flex: 50 }}>
                            <NumberFormat
                                value={parseFloat(total_debt)}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={' đ'}
                                renderText={value => <Text style={{ fontWeight: '600' }}>{value}</Text>}
                            />  
                        </View>
                    </View>
                    <View style={goodsCss.goods_details_list}>
                        <View style={{ flex: 50 }}>
                            <Text> Nợ sau:</Text>
                        </View>
                        <View style={{ flex: 50 }}>
                            <NumberFormat
                                value={parseFloat(total_debt)}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={' đ'}
                                renderText={value => <Text style={{ fontWeight: '600' }}>{value}</Text>}
                            />
                        </View>
                    </View>
                    <TouchableOpacity onPress={this.showDateTimePicker}>
                        <View style={goodsCss.goods_details_list}>
                            <View style={{ flex: 50 }}>
                                <Text> Thời gian:</Text>
                            </View>
                            <View style={{ flex: 50 }}>
                                <Text style={{ fontWeight: '600' }}>{debt.created_time}</Text>
                                {/* <Text style={{ fontWeight: '600' }}>Hahaha</Text> */}
                            </View>
                        </View>
                    </TouchableOpacity> 
                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this.handleDatePicked}
                        onCancel={this.hideDateTimePicker}
                    />
                    <TouchableOpacity onPress={this.showActionSheet}>
                        <View style={goodsCss.goods_details_list}>
                            <View style={{ flex: 50 }}>
                                <Text> Loại thanh toán:</Text>
                            </View>
                            <View style={{ flex: 50 }}>
                                <Text style={{ fontWeight: '600' }}>{debt.type_payment === 1 ?'Tiền mặt':'Chuyển khoản'}</Text>
                            </View>
                        </View>
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
                                    debt['type_payment'] = optionsArray[index - 1].value;
                                    this.setState({ debt });
                                }
                            }}
                        />
                    </TouchableOpacity>
                    <View style={goodsCss.goods_details_list}>
                        <View style={{ flex: 50 }}>
                            <Text> ghi chú:</Text>
                        </View>
                        <View style={{ flex: 50 }}>
                            <Input
                                onChangeText={(text) => this.onChangeFormInput('note', text)}                
                            />
                        </View>
                    </View>
                    <View style={goodsCss.goods_details_list}>
                        <View style={{ flex: 50 }}>
                            <Text> Tổng hóa đơn:</Text>
                        </View>
                        <View style={{ flex: 50 }}>
                            <NumberFormat
                                value={parseFloat(total_paying_debt)}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={' đ'}
                                renderText={value => <Text style={{ fontWeight: '600' }}>{value}</Text>}
                            />
                        </View>
                    </View>
                </View>
                <View>        
                    <FlatList
                        data={listInvoices}
                        extraData={this.state}
                        renderItem={({ item, index }) => (
                            this.renderItem(item, index)
                        )}
                        keyExtractor={item => item.id}
                        ItemSeparatorComponent={this.renderSeparator}
                    />
                </View>
                <Spinner
                    visible={this.state.spinner}
                    // textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
                />           
            </Modal>

        );
    }
}

const mapStateToProps = ({ state, persist }) => ({
    info_customer: state.info_customer,
    depot_current: persist.depot_current,
});

export default connect(mapStateToProps)(Modal_PayDebt);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor:'#4CAF50',
    },
    container1: {
        flex: 1,
        backgroundColor: '#D3D3D3',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 35,
    },
    container2: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    color_link: {
        color: '#0084cc',
    },
    color_error: {
        color: 'red',
    },
    no_bg: {
        backgroundColor: 0,
    },
    padding_15: {
        padding: 15,
    },
    margin_15: {
        margin: 15,
    },
    table_container: {
        padding: 10,
        backgroundColor: '#FFF',
        height: 230
    },
    table_scroll: {
        height: 120
    },
    table_head: {
        height: 40,
        backgroundColor: '#f1f8ff'
    },
    table_total: {
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
    select_box_main: {
        backgroundColor: '#efefef',
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    select_box_item: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    select_box_item_action_icon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    btn_fixed: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#ddd',
        justifyContent: 'space-around',
        padding: 10,
        paddingHorizontal: 0,
    },
    btn_fixed_box: {
        flex: 50,
        width: '33.33%',
        paddingHorizontal: 15,
    },
    btn_submit_button: {
        width: '100%',
    },
    btn_submit_button_title: {
        fontSize: 15,
    },
    btn_submit_button_success: {
        backgroundColor: '#28af6b',
    }
})

