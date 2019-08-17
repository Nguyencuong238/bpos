import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text,FlatList, Modal, Button,ActivityIndicator } from 'react-native';
import { ListItem, SearchBar, CheckBox, Input } from 'react-native-elements';
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
import waterfall from 'async/waterfall';
import NavigatorService from '../../services/NavigatorService';


class Receipts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: 'Giới tính',
            image: null,
            isDateTimePickerVisible: false,
            date: 'Ngày sinh',
            loading: false,
            customer: null,
            namegroup_people:'Khách hàng',
            modalVisible:false,
            debt_after: props.total_debt,
            Receiptstype: '',
            listInvoices: null,
            checkEditBankaccount: true,
            total_paying_debt: 0,
            forms: {
                name: { value: '', validate: true, msg: null },
                number: { value: '', validate: true, msg: null },
                idType: { value: 0, validate: true, msg: null },
                nameType:'',
                depot: { value: '', validate: true, msg: null },
                bankaccount: { value: '', validate: true, msg: null },
                namebank: '',
                tags: { value: '', validate: true, msg: null },
                note: { value: '', validate: true, msg: null },
                amount: { value: 0, validate: true, msg: null },
                type: { value: '', validate: true, msg: null },
                type_payment: { value: 1, validate: true, msg: null },
                account_name: { value: '', validate: true, msg: null },
                is_accounting: { value: true, validate: true, msg: null },
                created_time: { value: moment().format('YYYY/MM/DD H:mm'), validate: true, msg: null },
                group_people: { value: 1, validate: true, msg: null },
                person_info: { value: false, validate: true, msg: null },
                person_info_select: '',
                personnel_id: { value: props.profile.personnel_id, validate: true, msg: null },
                personnel_id_select: '',
                user_id_select : { value: 0, label:'' },
            },
            idType: 0,
            person_info: '',
            check_user_other: false,
        }
    }

    componentWillMount() {
        this.props.navigation.setParams({
            dispatch: this.submitForm.bind(this)
        });
    }

    componentDidMount() {
        const item = this.props.navigation.getParam('item', 'NO-ADD');
        const {typeReceipts} = item;
        console.log(item,'hehheeh');
        this.setState({typeReceipts,Receiptstype:typeReceipts});
        this.getListInvoiceDebt();
    }
    
    componentWillReceiveProps(nextProps) {
        const type= nextProps.navigation.getParam('type', 'NO-TYPE');
        console.log(type,'type');
        const { forms } = this.state;
        if (type.account_branch){
            forms['bankaccount'].value = type.id;
            forms['bankaccount'].validate = true;
            forms['namebank']=type.account_branch;
            this.setState({ forms });
        } else if (type.description) {
            forms.idType.value = type.id;
            forms['nameType'] = type.name;
            this.setState({ idType: type.id,forms });
        } else if (type.personnel_id) {
            forms['personnel_id'].value = type.personnel_id;
            forms['personnel_id'].validate = true;
            forms.user_id_select = { value: type.personnel_id, label: type.full_name };
            this.setState({ forms });
        } else {
            forms['person_info'].value = type.value;
            forms['person_info'].validate = true;
            forms.person_info_select = { value: type.value, label: type.label };
            this.setState({ forms });
            if (forms.group_people.value === 4) {
                this.setState({ person_info: type.value });
            }
        }
        
    }

    submitForm() {
        const self = this;
        const { depot_current } = this.props;
        const { forms, Receiptstype } = this.state;
        waterfall([
            (callback) => {
                if (forms.amount.value > 0) {
                    forms.amount.validate = true;
                } else {
                    forms.amount.validate = false;
                    forms.amount.msg = 'Giá trị không được để trống';
                    showMessage({
                        message: "Giá trị không được để trống.",
                        description: "",
                        type: "danger",
                        duration: 8000,
                    });
                }
                self.setState({ forms }, () => {
                    if (forms.amount.validate) callback(null, 'next');
                });
            },
            (next, callback) => {
                if (forms.note.value.length > 0) {
                    callback(null, 'next');
                } else {
                    showMessage({
                        message: "Ghi chú không được để trống.",
                        description: "",
                        type: "danger",
                        duration: 8000,
                    });
                }
            },
        ], () => {
            let accounting = '';
            if (forms.is_accounting.value === true) {
                accounting = 1;
            } else {
                accounting = 0;
            }
            // let value  = forms.amount.value.replace(/\./g,'')
            const params = {
                invoice: forms.name.value,
                depot_id: depot_current,
                bank_account_id: forms.bankaccount.value,
                group_person: forms.group_people.value,
                category: forms.idType.value,
                note: forms.note.value,
                amount: parseInt(forms.amount.value),
                type: Receiptstype,
                personnel_id: forms.personnel_id.value,
                person_info: forms.person_info.value,
                created_time: forms.created_time.value,
                type_payment: forms.type_payment.value,
                is_accounting: accounting,
                mtype: 'create',
                status: 1,
            };
            console.log(params,'params');
            this.createReceipts(params);
        });
    }

    createReceipts(params) {
        this.setState({ loading: true });
        receipts_api(params).then(() => {
            showMessage({
                message: "Thêm thành công.",
                description: "",
                type: "success",
                duration: 8000,
            });
            this.setState({ loading: false });
        });
    }

    getListInvoiceDebt() {
        const { info_customer } = this.props;
        const params = {};
        this.setState({ loading: true });
        params.customer_id = info_customer.customer_id.value;
        params.mtype = 'getInvoiceDebtbyCustomer';
        order_api(params).then((v) => {
            if (v.status === true) {
                this.setState({ listInvoices: v.listInvoices });
            } else {
                this.setState({ listInvoices: [] });
            }
            this.setState({ loading: false });
        });
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = date => {
        const {forms} = this.state;
        forms['created_time'].value = moment(date).format('YYYY-MM-DD H:mm');
        this.setState({forms});
        this.hideDateTimePicker();
    };

    onChangeFormInput(type, e) {
        const {forms} = this.state;
        if (type === 'amount') {
            if (e === '') {
                e =0;
            }
            forms[type].value = e;
            console.log(forms[type].value,'gia tri');
            forms[type].validate = true;
            this.setState({ forms });
        } else {
            forms[type].value = e;
            forms[type].validate = true;
            this.setState({ forms });
        }
    }

    onChangeFormInputInvoice(e, k, debt) {
        const { total_debt } = this.props;
        const { listInvoices } = this.state;
        if (e === '') {
            e = 0;
        }
        if (parseFloat(debt) < parseFloat(e)) {
            listInvoices[k].paying_debt = parseFloat(debt);
            this.setState({ listInvoices });
        } else {
            listInvoices[k].paying_debt = e;
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

    showActionSheet = () => {
        //To show the Bottom ActionSheet
        this.ActionSheet.show();
    };

    showActionSheet1 = () => {
        //To show the Bottom ActionSheet
        this.ActionSheet1.show();
    };

    onChangeInput(type, text) {
        const { forms } = this.state;
        if (type === 'amount' && text === '' ) {
            text = 0;
        } 
        forms[type].value = text;
        forms[type].validate = true;
        this.setState({ forms });
    }

    editCheck = () => {
        const { forms } = this.state;
        forms.is_accounting.value = !forms.is_accounting.value;
        this.setState({ forms });
    }

    render() {
        const {modalVisible1, onVisible1} = this.props;
        const { typeReceipts,forms, checkEditBankaccount,namegroup_people, loading } = this.state;
        const group_people = forms.group_people.value;
        const optionsArray = [
            { value: false, label: 'Tiền mặt' },
            { value: true, label: 'Chuyển khoản' },
        ];
        const tmp = ['Hủy'];
        optionsArray.map((v) => tmp.push(v.label));
        const optionsArray1 = [
            { value: 1, label: 'Khách hàng' }, 
            { value: 2, label: 'Nhà cung cấp' },
            { value: 3, label: 'Nhân viên' },
            { value: 4, label: 'Khác' },
        ];
        const tmp1 = ['Hủy'];
        optionsArray1.map((v) => tmp1.push(v.label));
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
                <Input
                    style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1 }}
                    placeholder='Tự động'
                    onChangeText={(text) => this.onChangeFormInput('name', text)}
                    value={forms.name.value}
                    leftIcon={
                        <Text style={styles.title}>Mã phiếu:</Text>
                    }
                />       
                <Input
                    style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1 }}
                    value={parseFloat(forms.amount.value)}
                    keyboardType='number-pad'
                    onChangeText={(text) => this.onChangeFormInput('amount', text)}
                    keyboardType='number-pad'
                    leftIcon={
                        <Text style={styles.title}>Giá trị:</Text>
                    }
                />
                <TouchableOpacity onPress={this.showActionSheet}>
                    <Input
                        style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1, textAlign: 'center' }}
                        pointerEvents="none"
                        value={checkEditBankaccount === false ? 'Tiền mặt':'Chuyển khoản'}
                        leftIcon={
                            <Text style={styles.title3} >Loại thanh toán:</Text>
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
                            const checkEditBankaccount = optionsArray[index - 1].value;
                            if(checkEditBankaccount === false) {
                                forms['type_payment'].value = 1;
                            } else {
                                forms['type_payment'].value = 2;
                            }
                            this.setState({ forms,checkEditBankaccount });
                            // dispatch({ type: R_CUSTOMER_FORM, payload: { ...info_customer } });
                        }
                    }}
                />
                {typeReceipts === 'THU'
                    &&  (
                        <TouchableOpacity onPress={this.showActionSheet1}>    
                            <Input
                                style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1, textAlign: 'center' }}
                                pointerEvents="none"
                                placeholder="Chọn nhóm người nộp"
                                value={namegroup_people}
                                leftIcon={
                                    <Text style={styles.title3} >Nhóm người nộp</Text>
                                }
                            />
                        </TouchableOpacity>    
                    )
                }
                {typeReceipts === 'CHI'
                    && (
                    <TouchableOpacity onPress={this.showActionSheet1}>
                        <Input
                            style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1, textAlign: 'center' }}
                            pointerEvents="none"
                            placeholder="Chọn nhóm người nhận"
                            value={namegroup_people}
                            leftIcon={
                                <Text style={styles.title3} >Nhóm người nhận:</Text>
                            }
                        />
                    </TouchableOpacity>    
                    )
                } 
                <ActionSheet
                    ref={o => (this.ActionSheet1 = o)}
                    //Title of the Bottom Sheet
                    title={'Tùy chọn'}
                    //Options Array to show in bottom sheet
                    options={tmp1}
                    //Define cancel button index in the option array
                    //this will take the cancel option in bottom and will highlight it
                    cancelButtonIndex={0}
                    //If you want to highlight any specific option you can use below prop
                    onPress={index => {
                        //Clicking on the option will give you the index of the option clicked
                        if (index !== 0) {
                            forms.group_people.value = optionsArray1[index - 1].value;
                            forms.person_info_select = '';
                            const namegroup_people   = optionsArray1[index - 1].label;
                            this.setState({ forms,namegroup_people });
                            if (optionsArray1[index - 1].value === 4) {
                                this.setState({ check_user_other: true });
                            } else {
                                this.setState({ check_user_other: false });
                            }
                        }
                    }}
                />  
                <TouchableOpacity onPress={this.showDateTimePicker}>
                    <Input
                        style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1, textAlign: 'center' }}
                        pointerEvents="none"
                        // value={moment(info_customer.birthday.value).format('YYYY-MM-DD')}
                        value={forms['created_time'].value}
                        leftIcon={
                            <Text style={styles.title4} >Thời gian:</Text>
                        }
                    />
                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this.handleDatePicked}
                        onCancel={this.hideDateTimePicker}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => checkEditBankaccount === true? this.props.navigation.navigate('BankAccount'): false}>
                    <Input
                        style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1 }}
                        pointerEvents='none'
                        placeholder='Thẻ ngân hàng'
                        value={forms['namebank']}
                        rightIcon={
                            <Icon
                                name='ios-arrow-forward'
                                size={18}
                                color='#ddd'
                            />
                        }
                        leftIcon={
                            <Text style={styles.title}>Thẻ ngân hàng</Text>
                        }
                    />
                </TouchableOpacity>   
                <TouchableOpacity onPress={() => this.props.navigation.navigate('TypeReceipts',{typeReceipts})}>
                    <Input
                        style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1 }}
                        pointerEvents="none"
                        placeholder='Loại thu/chi'
                        value={forms['nameType']}
                        rightIcon={
                            <Icon
                                name='ios-arrow-forward'
                                size={18}
                                color='#ddd'
                            />
                        }
                        leftIcon={
                            <Text style={styles.title}>Loại thu/chi</Text>
                        }
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Personnel')}>
                    <Input
                        style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1 }}
                        pointerEvents="none"
                        placeholder='Nhân viên'
                        value={forms['user_id_select'].label}
                        rightIcon={
                            <Icon
                                name='ios-arrow-forward'
                                size={18}
                                color='#ddd'
                            />
                        }
                        leftIcon={
                            <Text style={styles.title}>Nhân viên</Text>
                        }
                    />
                </TouchableOpacity>
                {  typeReceipts === 'THU' && (   
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Submitter',{group_people})}>
                        <Input
                            style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1 }}
                            pointerEvents="none"
                            placeholder='Người nộp'
                            value={forms['person_info_select'].label}
                            rightIcon={
                                <Icon
                                    name='ios-arrow-forward'
                                    size={18}
                                    color='#ddd'
                                />
                            }
                            leftIcon={
                                <Text style={styles.title}>Người nộp</Text>
                            }
                        />
                    </TouchableOpacity>
                    )
                }
                {  typeReceipts === 'CHI' && (   
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Submitter',{group_people})}>
                        <Input
                            style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1 }}
                            pointerEvents="none"
                            placeholder='Người nộp'
                            value={forms['person_info_select'].label}
                            rightIcon={
                                <Icon
                                    name='ios-arrow-forward'
                                    size={18}
                                    color='#ddd'
                                />
                            }
                            leftIcon={
                                <Text style={styles.title}>Người nhận</Text>
                            }
                        />
                    </TouchableOpacity>
                    )
                }  
                <Input
                    style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1 }}
                    placeholder='Ghi chú'
                    onChangeText={(text) => this.onChangeFormInput('note', text)}
                    value={forms.note.value}
                    leftIcon={
                        <Text style={styles.title}>Ghi chú:</Text>
                    }
                />
                <CheckBox
                    title='Hạch toán hoạt động kinh doanh'
                    checked={forms.is_accounting.value}
                    onPress={() => this.editCheck()}
                    style={{margin:0,marginBottom:10,}}
                />         
            </View>


        );
    }
}

const mapStateToProps = ({ state, persist }) => ({
    info_customer: state.info_customer,
    depots: persist.depots,
    profile: persist.profile,
    bankaccount: state.bankaccount,
    typereceipts: state.typereceipts,
    depot_current: persist.depot_current,
});

export default connect(mapStateToProps)(Receipts);

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

