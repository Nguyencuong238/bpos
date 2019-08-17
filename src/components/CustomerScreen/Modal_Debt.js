import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text,FlatList, Modal, Button,ActivityIndicator } from 'react-native';
import { ListItem, SearchBar, Avatar, Input } from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons"
import moment from 'moment';
import { connect } from 'react-redux';
import { goodsCss } from '../../styles/goods';
import { order_api, customer_api } from '../../services/api/fetch';
import { isEmpty, find, sumBy } from 'lodash';
import ActionSheet from 'react-native-actionsheet';
import FlashMessage from "react-native-flash-message";
import NumberFormat from 'react-number-format';
import { showMessage}  from "react-native-flash-message";
import DateTimePicker from "react-native-modal-datetime-picker";
import Spinner from 'react-native-loading-spinner-overlay';
import waterfall from 'async/waterfall';

class Modal_Debt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            customer_id: null,
            spinner:false,
            debt: {
                amount: 0,
                note_order: '',
                create_time: moment().format('YYYY-MM-DD H:mm'),
            },
        }
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
        this.ActionSheet.show();
    };

    onChangeFormInput(type, text) {
        const { debt } = this.state;
        if (type === 'amount') {
            if (text === '') {
                text = 0;
            }
            debt[type] = text;
        }
        debt[type] = text;
        this.setState({ debt });
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

    async submitForm() {
        const {  resfreshList, info_customer,onVisible1} = this.props;
        const { debt, customer_id } = this.state;
        const params = { ...debt };
        params.customer_id = info_customer.customer_id.value;
        params.mtype = 'createDebt';
        // onVisible1();
        onVisible1(spinner = true);
        // this.setState({ spinner: true });
        await customer_api(params).then((data) => {
            console.log(data,'Modal_Debt');
            if (data.status === true) {
                // this.setState({ spinner: false });
                // onVisible1();
                this.resetForm();
                resfreshList();
                showMessage({
                    message: "thêm thành công.",
                    description: "",
                    type: "success",
                    duration: 8000,
                });
            }
        });
    }


    resetForm() {
        console.log('chay resetForm');
        const { debt } = this.state;
        debt.amount = 0;
        debt.note_order = '';
        debt.created_time = '';
        this.setState({ debt });
    }

    render() {
        const {total_debt,modalVisible1, onVisible1,resfreshList} = this.props;
        const { debt, loading } = this.state;
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible1}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>
                <FlashMessage ref="myLocalFlashMessage" />
                <View style = {{marginTop:100}}>
                    
                    <Input
                        style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1,marginTop:100 }}
                        value={parseFloat(debt.amount)}
                        keyboardType='number-pad'
                        onChangeText={(text) => this.onChangeFormInput('amount', text)}
                        leftIcon={
                            <Text style={styles.title}>Số tiền:</Text>
                        }
                    />
                    <TouchableOpacity onPress={this.showDateTimePicker}>
                        <Input
                            style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1, textAlign: 'center' }}
                            pointerEvents="none"
                            // value={moment(info_customer.birthday.value).format('YYYY-MM-DD')}
                            value={debt.created_time}
                            leftIcon={
                                <Text style={styles.title4} >Ngày nợ:</Text>
                            }
                        />
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={this.handleDatePicked}
                            onCancel={this.hideDateTimePicker}
                        />
                    </TouchableOpacity>
                    <Input
                        style={{ height: 40, borderColor: '#d6d7da', borderWidth: 1 }}
                        placeholder='Tự động'
                        onChangeText={(text) => this.onChangeFormInput('note_order', text)}
                        value={debt.note_order}
                        leftIcon={
                            <Text style={styles.title}>Nội dung:</Text>
                        }
                    />  
                    <Button
                        title="Trở về"
                        onPress={() => {
                            onVisible1();
                            this.resetForm();
                            
                        }}
                    />
                    <Button
                        title="Lưu"
                        onPress={() => {
                            // onVisible1(spinner = true);
                            this.submitForm();
                            
                        }}
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

export default connect(mapStateToProps)(Modal_Debt);

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

