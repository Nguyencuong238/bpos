import React, { Component } from 'react';
import { StyleSheet, View,  TouchableOpacity, FlatList, Text } from 'react-native';
import {  ListItem, SearchBar, Avatar, Input } from 'react-native-elements';
import { getAddress_api } from '../../services/api/fetch';
import Icon from "react-native-vector-icons/Ionicons"
import moment from 'moment';


export default class InfoCustomer extends Component {
	constructor(props) {
		super(props);
		this.state = {
            selected: 'Giới tính',
            image: null,
            isDateTimePickerVisible: false,
            date: 'Ngày sinh',
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



	
	componentDidMount() {
		this.props.navigation.setParams({
            dispatch: this._submitForm.bind(this)
        });
        const { navigation } = this.props;
        const { info_customer } = this.state;
        const customer = navigation.getParam('item', 'NO-ID');
        if (customer !== 'NO-ID') {
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
            info_customer.ward.value = customer.address.ward || '';
            info_customer.type.value = customer.address.type || 0;
            info_customer.debt = customer.debt || [];
            info_customer.tagCustomerId = customer.tagCustomerId || [];
        }
        this.setState({ info_customer });
	
	}

	_submitForm = () => {
		alert('Save Details');
		console.log('quang ke');
    }


	render() {
        const { info_customer } = this.state;
		return (
			<View style={styles.container}>
                <Avatar
                    size="large"
                    rounded
                    icon={{ name: 'user', type: 'font-awesome' }}
                    source={{ uri: info_customer.avatar.value === '' ? '' : info_customer.avatar.value, }}
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
                </View>
                <View style={styles.gender}>
                    <TouchableOpacity onPress={this.showDateTimePicker}>
                        <Input
                            style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1, textAlign: 'center' }}
                            pointerEvents="none"
                            placeholder='ngay sinh'
                            value={moment(info_customer.birthday.value).format('YYYY-MM-DD')}
                            leftIcon={
                                <Text style={styles.title4} >Ngày sinh</Text>
                            }
                        />
                    </TouchableOpacity>
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
                
			</View>
		);
	}
}

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
    }


});


