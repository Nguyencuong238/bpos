import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Text, ActivityIndicator, Modal,ScrollView,Image  } from 'react-native';
import { ListItem, SearchBar, Avatar, Input } from 'react-native-elements';
import { getAddress_api, customer_api, validation_api, getTags, upload_api } from '../../services/api/fetch';
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

class EditCustomer extends Component {
    constructor(props) {
        super(props);
        this.props.navigation.addListener('willFocus', () => {
            const { navigation } = this.props;
            const customer = navigation.getParam('item', 'NO-ID');
            if (customer === 0) {
                this.refreshForm();
            }

        });
        this.state = {
            selected: 'Giới tính',
            image: null,
            isDateTimePickerVisible: false,
            date: 'Ngày sinh',
            loading: false,
            customer: null,
            selectedItems :  [1,3],
            detail: [],
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

    refreshForm = () => {
        const { info_customer, dispatch } = this.props;
        info_customer.full_name.value = '';
        info_customer.mobile_phone.value = '';
        info_customer.address.value = ''; 
        info_customer.customer_id.value = 0;
        info_customer.email.value = '';
        info_customer.avatar.value = '';
        info_customer.gender.value=1;
        info_customer.province.value = '';
        info_customer.province_id.value = 0;
        info_customer.district_id.value = 0;
        info_customer.district.value = '';
        info_customer.ward_id.value = 0;
        info_customer.tagCustomerId = [];
        info_customer.ward.value = '';
        info_customer.type.value = 1;
        info_customer.birthday.value = '';
        dispatch({ type: R_CUSTOMER_FORM, payload: { ...info_customer } });
    }

    componentWillMount() {
        this.props.navigation.setParams({
            dispatch: this._submitForm.bind(this)
        });
        const { navigation } = this.props;
        const customer = navigation.getParam('item', 'NO-ID');
        if (customer !== 0) {
            this.getList(customer.customer_id);
        } else {
            this.getList(0);
        }    
    }

    getList(current_id) {
        const { info_customer, dispatch } = this.props;
        this.setState({ loading: true }, () => {
            customer_api({
                mtype: 'getInfo',
                customer_id: current_id,
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
                    this.getWard(customer.address.district_id,customer.address.ward_id);
                    dispatch({ type: R_CUSTOMER_FORM, payload: { ...info_customer } });
                } else {
                    this.setState({ loading:false });
                }
            });
        });
    }

     async getWard(district_id, ward_id) {
        const { info_customer, dispatch } = this.props;
        if (district_id) {
            await getAddress_api({
                mtype: 'listWard',
                district_id,
            }).then(({ wards }) => {
                if(!isEmpty(wards)) {
                    wards.map((v, k) => {
                        if (ward_id === v.wardid.toString()) {
                            info_customer.ward.value = v.name;
                        }
                    });
                } else {
                    info_customer.ward.value = '';
                }
                dispatch({ type: R_CUSTOMER_FORM, payload: { ...info_customer } });
                
            });
        }    
        this.setState({ loading:false });
    }

    _submitForm = () => {
        const { info_customer, dispatch } = this.props;
        waterfall([
            (callback) => {
                if (info_customer.full_name.value.length > 0) {
                    info_customer.full_name.validate = true;
                } else {
                    info_customer.full_name.validate = false;
                    info_customer.full_name.msg = 'Họ tên không được để trống';
                    showMessage({
                        message: "Họ tên không được để trống.",
                        description: "",
                        type: "danger",
                        duration: 5000,
                    });
                }
                dispatch({ type: R_CUSTOMER_FORM, payload: { ...info_customer } });
                if (info_customer.full_name.validate) callback(null, 'next');
            },
            (next, callback) => {
                if (info_customer.mobile_phone.value.length >= 10 && info_customer.mobile_phone.value.length <= 11) {
                    validation_api({ mtype: 'number_phone', number_phone: info_customer.mobile_phone.value }).then((data) => {
                        console.log(data,'data');
                        if (data.errors !== undefined) {
                            info_customer.mobile_phone.validate = false;
                            info_customer.mobile_phone.msg = 'Không xác định được';
                            showMessage({
                                message: "Không xác định được.",
                                description: "",
                                type: "danger",
                                duration: 5000,
                            });
                            dispatch({ type: R_CUSTOMER_FORM, payload: { ...info_customer } });

                        } else if (data.validate) {
                            info_customer.mobile_phone.validate = true;
                            if (info_customer.mobile_phone.validate) callback(null, 'next');
                            dispatch({ type: R_CUSTOMER_FORM, payload: { ...info_customer } });
                        } else {
                            info_customer.mobile_phone.validate = false;
                            info_customer.mobile_phone.msg = 'Không xác định được.';
                            showMessage({
                                message: "Không xác định được.",
                                description: "",
                                type: "danger",
                                duration: 5000,
                            });
                            dispatch({ type: R_CUSTOMER_FORM, payload: { ...info_customer } });
                        }
                    });
                } else {
                    info_customer.mobile_phone.validate = false;
                    info_customer.mobile_phone.msg = 'Không xác định được.';
                    showMessage({
                        message: "Không xác định được.",
                        description: "",
                        type: "danger",
                        duration: 5000,
                    });
                    dispatch({ type: R_CUSTOMER_FORM, payload: { ...info_customer } });
                }
            },
        ], () => {
            const myObject = [];
            myObject[0] = [];
            if (info_customer.customer_id.value === 0) {
                myObject[0].province_id = info_customer.province_id.value;
                myObject[0].district_id = info_customer.district_id.value;
                myObject[0].ward_id = info_customer.ward_id.value;
            }
            myObject[0].type = info_customer.type.value;
            myObject[0].address = info_customer.address.value;
            myObject[0].address_id = info_customer.address_id.value;
            myObject[0].position = info_customer.position.value;
            console.log(myObject,'my');
            const params = {
                full_name: info_customer.full_name.value,
                gender: info_customer.gender.value,
                email: info_customer.email.value,
                mobile_phone: info_customer.mobile_phone.value.trim(),
                birthday: info_customer.birthday.value ? moment(info_customer.birthday.value).format('YYYY-MM-DD') : null,
                avatar: info_customer.avatar.value,
                type: info_customer.type.value,
                debt: info_customer.debt,
                address_group: myObject,
                // depot_id: depot_current,
                receipeint_id: info_customer.receipeint_id.value,
                mtype: 'create',
            };
            if (info_customer.customer_id.value !== 0) {
                params.customer_id = info_customer.customer_id.value;
                params.mtype = 'edit';
            }
            this.createCustomer(params);

        });

    }

    createCustomer(params) {
        const { info_customer, dispatch } = this.props;
        this.setState({ loading: true });
        customer_api(params).then((data) => {
            this.setState({ loading: false });
            if (data.errors == null) {
                showMessage({
                    message: "Cập nhật khách hàng thành công.",
                    description: "",
                    type: "success",
                    duration: 8000,
                });
                const edit_customer = data.customer_id;
                if (params.mtype === 'create') {
                    dispatch({ type: R_CUSTOMER_EDIT, payload:edit_customer });
                } else {
                    dispatch({ type: R_CUSTOMER_EDIT, payload: edit_customer });
                }                  
            } else if (!isEmpty(data.errors)) {
                showMessage({
                    message: Object.values(data.errors.message)[0],
                    description: "",
                    type: "danger",
                    duration: 8000,
                });
                dispatch({ type: R_CUSTOMER_FORM, payload: { ...info_customer } });

            }
        });
    }


    onChangeFormInput = (text, name) => {
        const { info_customer, dispatch } = this.props;
        info_customer[name].value = text;
        info_customer[name].validate = true;
        dispatch({ type: R_CUSTOMER_FORM, payload: { ...info_customer } });

    }

    showActionSheet4 = () => {
        //To show the Bottom ActionSheet
        this.ActionSheet4.show();
    };

    showActionSheet = () => {
        //To show the Bottom ActionSheet
        this.ActionSheet.show();
    };

    showActionSheet1 = () => {
        //To show the Bottom ActionSheet
        this.ActionSheet1.show();
    };

    _pickCamera = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
        });
        if (!result.cancelled) {
            this.uploadImage(result.uri);
        }
    };

    _pickLibrary = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
        });
        this.uploadImage(result.uri);
    }

    uploadImage(uri) {
        const file = {
            uri,
            name: 'DSC_1134222.JPG',
            type: 'image/jpg'
        }
        const body = new FormData()
        body.append('mtype', 'upload');
        body.append('file_upload', file)
        upload_api(body).then((data) => {
            this.onChangeFormInput(data.message,'avatar');
        });
     
    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = date => {
        const { info_customer, dispatch } = this.props;
        info_customer['birthday'].value = moment(date).format('YYYY-MM-DD');
        dispatch({ type: R_CUSTOMER_FORM, payload: { ...info_customer } });
        this.hideDateTimePicker();
    };

    SaveAddress = (params) => {
        const { info_customer, dispatch } = this.props;
        this.setState({ loading: true });
        customer_api(params).then((data) => {
            this.setState({ loading: false });
        });
    }

    componentWillReceiveProps(nextProps) {
        const { info_customer, dispatch } = this.props;
        const myObject = [];
        myObject[0] = [];
        const address = nextProps.navigation.getParam('address', 'NO-ADD');
        console.log(address,'dia chi');
        if (address !== 'NO-ADD') {
            if (address.type === 'Tỉnh' || address.type === 'Thành Phố') {
                info_customer['province'].value = address.name;
                info_customer['province_id'].value = address.provinceid;
                info_customer['district'].value = '';
                info_customer['district_id'].value = 0;
                info_customer['ward'].value = '';
                info_customer['ward_id'].value = 0;
                if (info_customer.customer_id.value !== 0) {
                    myObject[0].province_id = address.provinceid;
                    myObject[0].district_id = 0;
                    myObject[0].ward_id =0;
                    const params = {
                        address_group: myObject,
                        mtype: 'edit',
                    };
                    params.customer_id = info_customer.customer_id.value;
                    this.SaveAddress(params);
                }
                
            }
            else if (address.type === 'Huyện' || address.type === 'Quận' || address.type === 'Thị Xã') {
                info_customer['district'].value = address.name;
                info_customer['district_id'].value = address.districtid;
                info_customer['ward'].value = '';
                info_customer['ward_id'].value = 0;
                if (info_customer.customer_id.value !== 0) {
                    myObject[0].province_id = info_customer.province_id.value;
                    myObject[0].district_id = address.districtid;
                    myObject[0].ward_id =0;
                    const params = {
                        address_group: myObject,
                        mtype: 'edit',
                    };
                    params.customer_id = info_customer.customer_id.value;
                    this.SaveAddress(params);
                }
            }
            else if (address.type === 'Thị Trấn' || address.type === 'Xã' || address.type === 'Phường' ) {
                info_customer['ward'].value = address.name;
                info_customer['ward_id'].value = address.wardid;
                if (info_customer.customer_id.value !== 0) {
                    myObject[0].province_id = info_customer.province_id.value;
                    myObject[0].district_id = info_customer.district_id.value;
                    myObject[0].ward_id = address.wardid;
                    const params = {
                        address_group: myObject,
                        mtype: 'edit',
                    };
                    params.customer_id = info_customer.customer_id.value;
                    this.SaveAddress(params);
                }
            }
            // dispatch({ type: R_CUSTOMER_FORM, payload: { ...info_customer } });
        }
           
    }

    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });

    };

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
        const optionsArray1 = [
            { value: 1, label: 'Cá nhân' },
            { value: 2, label: 'Công ty, tổ chức' },
        ];
        const tmp = ['Hủy'];
        optionsArray.map((v) => tmp.push(v.label));
        const tmp1 = ['Hủy'];
        optionsArray1.map((v) => tmp1.push(v.label));
        const { info_customer, dispatch } = this.props;
        const { loading, selectedItems } = this.state;
        const province_id = info_customer.province_id.value;
        const district_id = info_customer.district_id.value;
        const customer_id = info_customer.customer_id.value;
        console.log(info_customer,'hay');
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
                    <Avatar
                        size="large"
                        rounded
                        icon={{ name: 'user', type: 'font-awesome' }}
                        source={{ uri:`https:${info_customer.avatar.value}` }}
                        onPress={this.showActionSheet4}
                    />
                    <Input
                        containerStyle={styles.input}
                        placeholder='Tên khách hàng'
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
                        <TouchableOpacity onPress={this.showActionSheet1}>
                            <Input
                                style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1, textAlign: 'center' }}
                                pointerEvents="none"
                                value={info_customer.type.value === 1 ? 'Cá nhân' : 'Công ty, tổ chức'}
                                leftIcon={
                                    <Text style={styles.title3} >Loại</Text>
                                }
                            />
                        </TouchableOpacity>
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
                                    info_customer['type'].value = optionsArray1[index - 1].value;
                                    dispatch({ type: R_CUSTOMER_FORM, payload: { ...info_customer } });
                                }
                            }}
                        />
                        <TouchableOpacity onPress={this.showActionSheet}>
                            <Input
                                style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1, textAlign: 'center' }}
                                pointerEvents="none"
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
                                    dispatch({ type: R_CUSTOMER_FORM, payload: { ...info_customer } });
                                }
                            }}
                        />
                    </View>
                    <View style={styles.gender}>
                        <TouchableOpacity onPress={this.showDateTimePicker}>
                            <Input
                                style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1, textAlign: 'center' }}
                                pointerEvents="none"
                                placeholder='Ngày sinh'
                                // value={moment(info_customer.birthday.value).format('YYYY-MM-DD')}
                                value={info_customer.birthday.value === '' ?'':moment(info_customer.birthday.value).format('YYYY-MM-DD')}
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
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('City')}>
                            <Input
                                style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1 }}
                                pointerEvents="none"
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
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('District', { province_id })}>
                            <Input
                                style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1 }}
                                pointerEvents="none"
                                placeholder='Quận huyện'
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
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Wards', { district_id })}>
                            <Input
                                style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1 }}
                                pointerEvents="none"
                                placeholder='Xã phường'
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
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('GroupCustomer', { customer_id })}>
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
            </ScrollView>    
        );
    }
}

const mapStateToProps = ({ state, persist }) => ({
    info_customer: state.info_customer,
    depot_current: persist.depot_current,
});
export default connect(mapStateToProps)(EditCustomer);

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


