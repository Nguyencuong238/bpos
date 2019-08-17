import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Text, ActivityIndicator, Modal,ScrollView,Image  } from 'react-native';
import { ListItem, SearchBar,CheckBox, Input } from 'react-native-elements';
import { receiptsType_api, customer_api, validation_api, getTags, upload_api } from '../../services/api/fetch';
import Icon from "react-native-vector-icons/Ionicons"
import { ImagePicker, Permissions, Constants } from 'expo';
import ActionSheet from 'react-native-actionsheet';
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';
import { connect } from 'react-redux';
import waterfall from 'async/waterfall';
import { isEmpty } from 'lodash';
import { showMessage } from "react-native-flash-message";
import { R_CUSTOMER_FORM, R_CUSTOMER_EDIT } from '../../reducers/actions/index';
import NavigatorService from '../../services/NavigatorService';
import MultiSelect from '../../components/library/MultiSelect/react-native-multi-select';

class EditTypeReceipt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            current_id: 0,
            onDelete: '',
            typeReceipts: '',
            forms: {
                name: { value: '', validate: true, msg: null },
                description: { value: '', validate: true, msg: null },
                is_accounting: { value: false, validate: true, msg: null },
            },  
           
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            dispatch: this.submitForm.bind(this)
        });
        const param= this.props.navigation.getParam('param', 'NO-PARAM');
        const {Receiptstype} = param
        const {forms} = this.state;
        console.log(param,'eeeec');
        if (param.id !== 0) {
            const myObject = [];
            myObject.type = param.Receiptstype;
            const params = {
                mtype: 'getbyid',
                params: myObject,
                id: param.id,
            };
            this.setState({ loading: true, Receiptstype:Receiptstype }, () => {
                receiptsType_api(params).then(({ branch_info }) => {
                    if (branch_info) {
                        forms.name.value = branch_info.name || '';
                        forms.description.value = branch_info.description || '';
                        forms.is_accounting.value = branch_info.is_accounting || '';
                        if (branch_info.is_accounting === 1) {
                            forms.is_accounting.value = true;
                        } else {
                            forms.is_accounting.value = false;
                        }
                        this.setState({ forms, current_id: param.id, loading: false });
                    }
                });
            });
        } else {
            this.setState({Receiptstype:Receiptstype});
        }
    }

    submitForm() {
        const self = this;
        const { forms, current_id, Receiptstype } = this.state;
        waterfall([
            (callback) => {
                if (forms.name.value.length > 0) {
                    forms.name.validate = true;
                } else {
                    forms.name.validate = false;
                    forms.name.msg = 'Tên loại không được để trống';
                    showMessage({
                        message: "Tên loại không được để trống.",
                        description: "",
                        type: "danger",
                        duration: 5000,
                    });
                }
                self.setState({ forms }, () => {
                    if (forms.name.validate) callback(null, 'next');
                });
            },
        ], () => {
            let accounting = '';
            if (forms.is_accounting.value === true) {
                accounting = 1;
            } else {
                accounting = 0;
            }
            const params = {
                name: forms.name.value,
                description: forms.description.value,
                type: Receiptstype,
                is_accounting: accounting,
                mtype: 'create',
            };
            if (current_id !== 0) {
                params.mtype = 'update';
               params.id = current_id;
            }
            console.log(params,'msnsk');
            this.createManufacturer(params);
        });
    }

    createManufacturer(params) {
        receiptsType_api(params).then((data)=>{
            if (data.status === true) {
                showMessage({
                    message: "Thêm thành công.",
                    description: "",
                    type: "success",
                    duration: 8000,
                });
            } else {
                showMessage({
                    message: "Thêm không thành công.",
                    description: "",
                    type: "danger",
                    duration: 8000,
                });
            }
            
        });
    }

    editCheck = () => {
        const { forms } = this.state;
        forms.is_accounting.value = !forms.is_accounting.value;
        this.setState({ forms });
    }

    onChangeFormInput(type, text) {
        const {forms} = this.state;
        forms[type].value = text;
        forms[type].validate = true;
        this.setState({ forms });
    }

    render() {  
        const { forms, loading } = this.state;
        let { typeReceipts } = this.state;
        if (typeReceipts) typeReceipts = null;
        return (
            <ScrollView>
                <View style={styles.container}>
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
                        placeholder='Tên loại'
                        onChangeText={(text) => this.onChangeFormInput('name', text)}
                        value={forms.name.value}
                        leftIcon={
                            <Text style={styles.title}>Tên loại</Text>
                        }
                    />
                    <Input
                        style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1 }}
                        placeholder='Mô tả'
                        onChangeText={(text) => this.onChangeFormInput('description', text)}
                        value={forms.description.value}
                        leftIcon={
                            <Text style={styles.title}>Mô tả</Text>
                        }
                    />  
                    <CheckBox
                        title='Hạch toán hoạt động kinh doanh'
                        checked={forms.is_accounting.value}
                        onPress={() => this.editCheck()}
                        style={{margin:0,marginBottom:10,}}
                    />               

                </View>
            </ScrollView>    
        );
    }
}


const mapStateToProps = ({ state, persist }) => ({
    info_customer: state.info_customer,
    depot_current: persist.depot_current,
});
export default connect(mapStateToProps)(EditTypeReceipt);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor:'#4CAF50',
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
    photo: {
        height: 80,
        width: 80,
        borderRadius: 40,
    },

});


