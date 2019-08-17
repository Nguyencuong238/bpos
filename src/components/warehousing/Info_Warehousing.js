import React, {Component} from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet,Text,View,TouchableOpacity ,ActivityIndicator,TextInput,Picker,FlatList,TouchableHighlight,Alert,ActionSheetIOS, Platform } from 'react-native';
import { Input, Button ,CheckBox } from 'react-native-elements';
import axios from 'axios';
import qs from 'qs';
import Modal from "react-native-modal";
import { R_PRODUCT_STOCK, R_STOCK_TAKES, R_EDIT_STOCKTAKES,R_EDIT_WAREHOUSING,R_WAREHOUSING } from '../../reducers/actions';
import moment from 'moment';
import { isEmpty, findKey, includes, isArray, forEach, sumBy, filter,remove,  reduce as _reduce, chunk ,isNumber} from 'lodash';
import Icon from "react-native-vector-icons/Ionicons";
import { bankaccount_api,purchase_order_api } from '../../services/api/fetch';
import waterfall from 'async/waterfall';
import { showMessage } from "react-native-flash-message";
class Info_Warehousing extends Component{
    constructor(props) {
        super(props);
        this.state = {
            price_sell: 0,
            total_product: 0,
            selectedValue: 'cash',
            selectedLabel: 'VNĐ',
            selectedValue1: 'cash',
            selectedLabel1: 'TIền mặt',
            bankaccount: [],
            visible:false,
            price_pay: 0,
            animating:false,
            form: {
                manufacturer_id: 0,
                manufacturer_id_select: '',
                user_id: '',
                user_id_select: '',
                note_order: '',
                shipping_fee: 0,
                surcharge_fee: 0,
                special_amount: 0,
                paying_amount: 0,
                status: '',
                type_payment: 1,
                MethodStr: '',
                Amount: '',
                bank_account_id: 0,
                discount_type: 'cash',
                discount_amount: 0,
                create_time: { value: moment().format('YYYY-MM-DD H:mm') },
                invoice:''
            },
        };
    }
    // componentWillReceiveProps(){
    //     const { navigation } = this.props;
    //     const invoice_id = navigation.getParam('invoice_id');
    //     if(isNumber(invoice_id)){
    //         const params = {
    //             id: parseFloat(invoice_id),
    //             mtype: 'getPurchaseOrder',
    //         };
    //         this.purchase_order_api(params);
    //     }
    // }

    purchase_order_api = (params) =>{
        const { form} = this.state;
        purchase_order_api(params).then(({ order_info }) => {
            form.invoice = order_info.invoice;
            form.status = order_info.status;
            form.user_id_select = { value: order_info.user_id, label: order_info.personel.full_name };
            form.manufacturer_id = order_info.manufacturer_id;
            if (!isEmpty(order_info.shipping_fee)) { form.shipping_fee = parseFloat(order_info.shipping_fee, 10); }
            if (!isEmpty(order_info.surcharge_fee)) { form.surcharge_fee = parseFloat(order_info.surcharge_fee, 10); }
            // if (!isEmpty(order_info.special_amount)) { form.special_amount = parseFloat(order_info.special_amount, 10); }
            if (!isEmpty(order_info.special_amount)) { form.discount_amount = parseFloat(order_info.special_amount, 10); }
            form.note_order = order_info.note_order;
            form.paying_amount = parseFloat(order_info.paying_amount);
            this.setState({ form });
        })
    }


    componentDidMount() {
        const { navigation} = this.props;
        const price_sell = navigation.getParam('total_price');
        this.listBankAccount();
        this.setState({price_pay:price_sell})
        const invoice_id = navigation.getParam('invoice_id');
        if(isNumber(invoice_id)){
            const params = {
                id: parseFloat(invoice_id),
                mtype: 'getPurchaseOrder',
            };
            this.purchase_order_api(params);
        }
    }

    listBankAccount() {
        bankaccount_api({ mtype: 'getall' }).then(({ listBankAccount }) => {
            if (listBankAccount !== undefined) {
                this.setState({ bankaccount: listBankAccount });
            }
        });
    }

    onChangePicker(v) {
        const { form } = this.state;
        form.discount_type = v;
        this.setState({ selectedValue: v ,form});
        this.changeDiscountType(v)
    }

    changeDiscountType(type) {
        const { form } = this.state;
        const { navigation} = this.props;
        const price_sell = navigation.getParam('total_price');
        form.discount_type = type;
        this.setState({ form });
        if (type === 'cash') {
            if (form.discount_amount !== 0) {
                const amount = (parseFloat(form.discount_amount, 10) * price_sell / 100);
                //const amount = parseFloat(form.special_amount,10);
                form.discount_amount = amount;
                this.setState({ form });
            }
        } else if (type === 'percent') {
            if (form.discount_amount !== 0) {
                const amount = (parseFloat(form.discount_amount, 10) * 100 / price_sell);
                form.discount_amount = parseInt(amount);
                this.setState({ form });
            }
        }
    }
    onChangePicker1(v) {
        // this.setState({ selectedValue1: v });
        const { form } = this.state;
        if(v==='card'){
            this.setState({visible:true});
            // form[type_payment] = 2;
            form.type_payment = 2;
            form.MethodStr = 'Thẻ';
        }else{
            this.setState({visible:false});
            // form[type_payment] = 1;
            form.type_payment = 1;
            form.MethodStr = 'tiền mặt';
        }

        this.setState({ form,selectedValue1: v });
    }

    onVisibleLocal = () =>{
        this.setState({visible: !this.state.visible})
    }

    showDateIOS(options) {
        const tmp = ['Hủy'];
        options.map((v) => tmp.push(v.label));
        ActionSheetIOS.showActionSheetWithOptions(
            { options: tmp, cancelButtonIndex: 0 }, (index) => {
                if (index !== 0) {
                    this.setState({ selectedValue: options[index - 1].value, selectedLabel: tmp[index] });
                }
            },
        );
    }



    showDateIOS1(options) {
        const tmp = ['Hủy'];
        options.map((v) => tmp.push(v.label));
        ActionSheetIOS.showActionSheetWithOptions(
            { options: tmp, cancelButtonIndex: 0 }, (index) => {
                if (index !== 0) {
                    this.setState({ selectedValue: options[index - 1].value, selectedLabel: tmp[index] });
                }
            },
        );
    }

    onVisibleLocal1 =(item)=>{
        this.setState({visible :!this.state.visible})
    }

    _renderItem = (bankaccount) => {
        const htm = bankaccount.map((v, k) => {
            const idx = k + 1;
            return ( 
                <View key={idx} style={{backgroundColor:'white'}}>
                    <Text
                        onPress={() => this.onVisibleLocal1(v)}
                        style={{fontSize:15}}
                    > 
                        {v.name} 
                    </Text>
                    <View style={{
                        height:1,
                        backgroundColor: '#ddd'
                    }}/>
                </View>
            );
        });
        return htm;
    };
    

    renderSeparator = () => {
        return (
          <View
            style={{
              height: 2,
              width: '100%',
              backgroundColor: '#CED0CE'
            }}
          />
        );
    };

    onChangeInput = (type, e) => {
        const { navigation} = this.props;
        const { form } = this.state;
        const price_sell = navigation.getParam('total_price');
        if (type === 'special_amount') {
            let value = e;
            if(parseInt(e) > 0 || parseInt(e) < 0){
                value = parseInt(e);
            }else {
                value = 0;
            }
            if (value > price_sell) {
                value = price_sell;
            }
            form[type] = value;
            if (form.discount_type === 'cash') {
                form.discount_amount = value;
                const price = price_sell + parseFloat(form.surcharge_fee, 10) + parseFloat(form.shipping_fee, 10) - parseFloat(value, 10);
                this.setState({ price_pay: price, form });
            } else if (form.discount_type === 'percent') {
                if (value > 100) {
                    value = 100;
                }
                form[type] = (parseFloat(value, 10) * price_sell / 100);
                form.discount_amount = value;
                const price = price_sell + parseFloat(form.surcharge_fee, 10) + parseFloat(form.shipping_fee, 10) - (parseFloat(value, 10) * price_sell / 100);
                this.setState({ price_pay: price, form });
            }
        } else if (type === 'shipping_fee') {
            let value = e;
            if(parseInt(e) > 0 || parseInt(e) < 0){
                value = parseInt(e);
            }else {
                value = 0;
            }
            form[type] = value;
            const price = price_sell + parseFloat(form.surcharge_fee, 10) + parseFloat(value, 10) - (parseFloat(form.special_amount, 10));
            this.setState({ price_pay: price, form });
        } else if (type === 'surcharge_fee') {
            let value = e;
            if(parseInt(e) > 0 || parseInt(e) < 0){
                value = parseInt(e);
            }else {
                value = 0;
            }
            form[type] = value;
            const price = price_sell + parseFloat(value, 10) + parseFloat(form.shipping_fee, 10) - parseFloat(form.special_amount, 10);
            this.setState({ price_pay: price, form });
        } else if (type === 'paying_amount') {
            let value = e;
            if(parseInt(e) > 0 || parseInt(e) < 0){
                value = parseInt(e);
            }else {
                value = 0;
            }
            form[type] = value;
            this.setState({ form });
        } else if (type === 'note_order') {
            form[type] = e;
            this.setState({ form });
        } else {
            e.target.value = e.target.value_number;
            form[type] = e.target.value;
            this.setState({ form });
        }
    }

    submitWarehousing(status, type) {        
        const { form,  id, check } = this.state;
        const { list_warehousing,navigation } = this.props;
        const price_sell = navigation.getParam('total_price');
        const manufacturer_id = navigation.getParam('manufacturer_id');
        const info_person = navigation.getParam('info_person');
        const self = this;
        this.setState({animating:true});
        waterfall([
            (callback) => {
                if (isEmpty(list_warehousing)) {
                    showMessage({
                        message: "Bạn phải chọn sản phẩm",
                        description: "",
                         type: "error",
                     });
                     this.setState({animating:false});
                } else {
                    callback(null, 'next');
                }
                
              
            },
            (next, callback) => {
                if (!isNumber(manufacturer_id)) {
                    showMessage({
                        message: "Bạn phải chọn nhà cung cấp",
                        description: "",
                         type: "error",
                     });
                     this.setState({animating:false});
                } else {
                    callback(null, 'next');
                }
            },
            // (next, callback) => {
            //     if (!isNumber(info_person)) {
            //         showMessage({
            //             message: "Bạn phải chọn người tạo phiếu nhập kho",
            //             description: "",
            //              type: "error",
            //          });
            //          this.setState({animating:false});
            //     } else {
            //         callback(null, 'next');
            //     }
            // },
        ], () => {
            const total = parseFloat(form.shipping_fee, 10) + parseFloat(form.surcharge_fee, 10) + parseFloat(price_sell, 10) - parseFloat(form.special_amount, 10);
            const debt_amount = parseFloat(total, 10) - parseFloat(form.paying_amount, 10);
            const payment = [{
                type_payment: form.type_payment,
                MethodStr: form.MethodStr,
                Amount: parseFloat(form.paying_amount, 10),
                // bank_account_id: form.bank_account_id,
                bank_account_id: 0,
            }];
            const params = {
                products: list_warehousing,
                mtype: 'create',
                depot_id: 1,
                manufacturer_id,
                user_id: info_person,
                note_order: form.note_order,
                shipping_fee: parseFloat(form.shipping_fee, 10),
                surcharge_fee: parseFloat(form.surcharge_fee, 10),
                sub_total: price_sell,
                special_amount: parseFloat(form.special_amount, 10),
                total,
                payments: payment,
                paying_amount: parseFloat(form.paying_amount, 10),
                debt_amount,
                omni_chanel: 'POS',
                status,
                create_time: form.create_time.value,
                type_order: 'add_warehouse',
            } ;
            if (isEmpty(form.user_id)) {
                params.user_id = form.user_id_select.value;
            }

            const invoice_id = navigation.getParam('invoice_id');
            if(isNumber(invoice_id)){
                params.mtype = 'update';
                params.id = invoice_id;
            }

            self.apiWarehouse(params, type);
        });
    }

    apiWarehouse(params, type) {
        // const { check, id } = this.state;
        const { dispatch } = this.props;
        const self = this;
        // if (self.props.onLoading) self.props.onLoading();
        if (type === 'add_request') {
            warehouse_request_api(params).then((v) => {
                if (v.status === true) {
                    // if (self.props.onLoading) self.props.onLoading();
                    const list_warehousing_clone = [];
                    dispatch({ type: R_EDIT_WAREHOUSING, payload: list_warehousing_clone });
                    dispatch({ type: R_WAREHOUSING, payload: list_warehousing_clone });
                    notification('success', '', 'Tạo phiếu thành công');
                    self.props.history.push('/bpos/depot/List_WarehouseRequest');
                } else {
                    notification('error', 'Tạo phiếu không thành công', 'Bạn vui lòng thử lại');
                }
            });
        } else {
            purchase_order_api(params).then((v) => {
                if (v.status === true) {
                    // if (self.props.onLoading) self.props.onLoading();
                    const list_warehousing_clone = [];
                    dispatch({ type: R_EDIT_WAREHOUSING, payload: list_warehousing_clone });
                    dispatch({ type: R_WAREHOUSING, payload: list_warehousing_clone });
                    showMessage({
                        message: "Tạo phiếu nhập kho thành công",
                        description: "",
                        type: "success",
                    });
                    this.onShowType();
                } else {
                    showMessage({
                        message: "Tạo phiếu nhập kho không thành công",
                        description: "",
                         type: "error",
                     });
                }
                this.setState({animating:false});
            });
            // if (check) {
            //     warehouse_request_api({ mtype: 'update', status: 1, id }).then(() => {});
            // }
        }
    }

    onShowType = () => {
        this.props.navigation.navigate("WarehousingScreen",{
            loadWarehouse: 'loadingrepat',
        });
    }

    render() {
        const { navigation} = this.props;
        const {animating,selectedValue,selectedLabel,selectedValue1,selectedLabel1,visible,bankaccount,form,price_pay} = this.state;
        const total_price = navigation.getParam('total_price');
        const options = [
            { value: 'cash', label: 'VNĐ' },
            { value: 'percent', label: '%' },
        ];

        const options1 = [
            { value: 'cash', label: 'Tiền mặt' },
            { value: 'card', label: 'Thẻ' },
        ];
        if(animating){
            return  <ActivityIndicator
                    size="large" color="#0000ff"
                    />
        }
        return (
            <View style={stocktakesCss.createStockTake_box}>
                
                <ScrollView>
                    {/* <View> */}
                        <View >
                            <View style={{height: 30, backgroundColor: 'white' ,marginTop:20}} >
                                <View style={{flex: 1, flexDirection: 'row',marginLeft:20}}>
                                    <View style={{width: 200}} >
                                        <Text style={{fontSize:15}}> Phương thức thanh toán</Text> 
                                    </View>
                                    <View style ={{width:140}}>
                                        {Platform.OS === 'ios'
                                            ? (
                                                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.showDateIOS1(options1)}>
                                                    <Text style={{ marginRight: 10 }}>{selectedLabel1}</Text>
                                                    <Icon
                                                        name='ios-arrow-down'
                                                        size={17}
                                                        color="#000"
                                                    />
                                                </TouchableOpacity>
                                            )
                                            : (
                                                <Picker
                                                    selectedValue={selectedValue1}
                                                    style={{ height: 50, width: 140, textAlign: 'center' }}
                                                    onValueChange={(v) => this.onChangePicker1(v)}
                                                >
                                                    {options1.map((v, k) => <Picker.Item key={k} label={v.label} value={v.value} /> )}
                                                </Picker>
                                            )
                                        }
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{
                            height:1,
                            backgroundColor: '#ddd'
                        }}>
                        </View>
                        <View >
                            <View style={{height: 30, backgroundColor: 'white',marginTop:20}} >
                                <View style={{flex: 1, flexDirection: 'row',marginLeft:20}}>
                                    <View style={{width: 260}} >
                                        <Text style={{fontSize:15}}> Tổng tiền hàng</Text> 
                                    </View>
                                    <View style={{width: 80,fontSize:20}} >
                                        <Text style={{fontSize:15}}>{total_price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{
                            height:1,
                            backgroundColor: '#ddd'
                        }}>
                        </View>
                        <View >
                            <View style={{height: 30, backgroundColor: 'white',marginTop:20}} >
                                <View style={{flex: 1, flexDirection: 'row',marginLeft:20}}>
                                    <View style={{width: 120}} >
                                        <Text style={{fontSize:15}}> Giảm giá</Text> 
                                    </View>
                                    <View style ={{width:100}}>
                                        {Platform.OS === 'ios'
                                            ? (
                                                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.showDateIOS(options)}>
                                                    <Text style={{ marginRight: 10 }}>{selectedLabel}</Text>
                                                    <Icon
                                                        name='ios-arrow-down'
                                                        size={17}
                                                        color="#000"
                                                    />
                                                </TouchableOpacity>
                                            )
                                            : (
                                                <Picker
                                                    selectedValue={selectedValue}
                                                    style={{ height: 50, width: 100, textAlign: 'center' }}
                                                    onValueChange={(v) => this.onChangePicker(v)}
                                                >
                                                    {options.map((v, k) => <Picker.Item key={k} label={v.label} value={v.value} /> )}
                                                </Picker>
                                            )
                                        }
                                    </View>
                                    <View style={{width: 120,fontSize:20}} >
                                        <TextInput
                                            keyboardType='numeric'
                                            style={{ borderBottomColor: 'gray', borderWidth: 1}}
                                            value={parseInt(form.discount_amount).toString()}
                                            onChangeText={(e) => this.onChangeInput('special_amount', e)}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{
                            height:1,
                            backgroundColor: '#ddd'
                        }}>
                        </View>
                        <View >
                            <View style={{height: 30, backgroundColor: 'white',marginTop:20}} >
                                <View style={{flex: 1, flexDirection: 'row',marginLeft:20}}>
                                    <View style={{width: 200}} >
                                        <Text style={{fontSize:15}}>Tiền ship</Text> 
                                    </View>
                                    <View style={{width: 120,fontSize:20}} >
                                        <TextInput
                                                keyboardType='numeric'
                                                style={{ borderBottomColor: 'gray', borderWidth: 1}}
                                                value={form.shipping_fee.toString()}
                                                onChangeText={(e) => this.onChangeInput('shipping_fee', e)}
                                            />
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{
                            height:1,
                            backgroundColor: '#ddd'
                        }}>
                        </View>
                        <View >
                            <View style={{height: 30, backgroundColor: 'white',marginTop:20}} >
                                <View style={{flex: 1, flexDirection: 'row',marginLeft:20}}>
                                    <View style={{width: 200}} >
                                        <Text style={{fontSize:15}}> Phụ phí</Text> 
                                    </View>
                                    <View style={{width: 120,fontSize:20}} >
                                        <TextInput
                                            keyboardType='numeric'
                                            style={{ borderBottomColor: 'gray', borderWidth: 1}}
                                            value={form.surcharge_fee.toString()}
                                            onChangeText={(e) => this.onChangeInput('surcharge_fee', e)}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{
                            height:1,
                            backgroundColor: '#ddd'
                        }}>
                        </View>
                        <View >
                            <View style={{height: 30, backgroundColor: 'white',marginTop:20}} >
                                <View style={{flex: 1, flexDirection: 'row',marginLeft:20}}>
                                    <View style={{width: 260}} >
                                        <Text style={{fontSize:15}}>Cần trả NCC</Text> 
                                    </View>
                                    <View style={{width: 80,fontSize:20}} >
                                        <Text style={{fontSize:15}}>{price_pay}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{
                            height:1,
                            backgroundColor: '#ddd'
                        }}>
                        </View>
                        <View >
                            <View style={{height: 30, backgroundColor: 'white',marginTop:20}} >
                                <View style={{flex: 1, flexDirection: 'row',marginLeft:20}}>
                                    <View style={{width: 200}} >
                                        <Text style={{fontSize:15}}>Tiền trả NCC</Text> 
                                    </View>
                                    <View style={{width: 120,fontSize:20}} >
                                        {/* <Text style={{fontSize:15}}>30000</Text> */}
                                        <TextInput
                                            keyboardType='numeric'
                                            style={{ borderBottomColor: 'gray', borderWidth: 1}}
                                            value={form.paying_amount.toString()}
                                            onChangeText={(e) => this.onChangeInput('paying_amount', e)}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{
                            height:1,
                            backgroundColor: '#ddd'
                        }}>
                        </View>

                        <View >
                            <View style={{height: 30, backgroundColor: 'white',marginTop:20}} >
                                <View style={{flex: 1, flexDirection: 'row',marginLeft:20}}>
                                    <View style={{width: 260}} >
                                    <CheckBox
                                        title='Tính vào công nợ'
                                        checked={true}
                                        center
                                    />
                                    </View>
                                    <View style={{width: 80,fontSize:20}} >
                                        <Text style={{fontSize:15}}>{(price_pay - parseFloat(form.paying_amount, 10)).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{
                            height:1,
                            backgroundColor: '#ddd'
                        }}>
                        </View>
                        <View >
                            <View style={{height: 30, backgroundColor: 'white',marginTop:20}} >
                                <View style={{flex: 1, flexDirection: 'row',marginLeft:20}}>
                                    <View style={{width: 100}} >
                                        <Text style={{fontSize:15}}>Ghi chú</Text> 
                                    </View>
                                    <View style={{width: 200,fontSize:20}} >
                                        {/* <Text style={{fontSize:15}}>30000</Text> */}
                                        <TextInput
                                            style={{ borderBottomColor: 'gray', borderWidth: 1}}
                                            value={form.note_order}
                                            onChangeText={(e) => this.onChangeInput('note_order', e)}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    {/* </View> */}
                </ScrollView>

                <Modal
                    isVisible={visible}
                >   
                    {!isEmpty(bankaccount)
                        &&(
                            this._renderItem(bankaccount)

                        )}                    
                    <Button
                        title="Đóng"
                        onPress={() => this.onVisibleLocal()}
                    />
                </Modal>
                <View style={Main.btn_fixed}>
                    <View style={Main.btn_fixed_box}>
                        <Button
                            title="Lưu tạm"
                            onPress={() => this.submitWarehousing(0)}
                            buttonStyle={Main.btn_submit_button}
                            containerStyle={Main.btn_submit_button_box}
                            titleStyle={Main.btn_submit_button_title}
                        />
                    </View>
                    <View style={Main.btn_fixed_box}>
                        <Button
                            title="Hoàn thành"
                            onPress={() => this.submitWarehousing(1)}
                            buttonStyle={[Main.btn_submit_button, Main.btn_submit_button_success]}
                            containerStyle={Main.btn_submit_button_box}
                            titleStyle={Main.btn_submit_button_title}
                        />
                    </View>
                    {/* <View style={Main.btn_fixed_box}>
                        <Button
                            title="Trở về"
                            onPress={this.onShowType}
                            buttonStyle={[Main.btn_submit_button, Main.btn_submit_button_success]}
                            containerStyle={Main.btn_submit_button_box}
                            titleStyle={Main.btn_submit_button_title}
                        />
                    </View> */}
                </View> 
            </View>

            
        );
    }
}
const mapStateToProps = ({ persist }) => ({
    list_warehousing: persist.list_warehousing,
    list_warehousing_save: persist.list_warehousing_save,
});
export default connect(mapStateToProps)(Info_Warehousing);


  
const stocktakesCss = StyleSheet.create({
      menu_action:{
          backgroundColor:'#ddd',
          padding:10,
          justifyContent: 'flex-end',
          flexDirection: 'row',
      },
      stocktakesCss_list_right:{
          textAlign:'right',
      },
      stocktakesCss_list_code:{
          fontWeight:'700',
          fontSize:15,
          marginBottom: 5,
      },
      stocktakesCss_list_time:{
          fontSize:12,
          fontStyle:'italic',
          color:'#545454'
      },
      stocktakesCss_list_status:{
          fontSize:13,
          marginTop:5,
          color:'#545454'
      },
      stocktakesCss_list_user:{
          fontSize:12,
          color:'#28af6b',
          textAlign:'right',
          flexDirection:'row',
          alignItems:'center',
          justifyContent:'flex-end'
      },
      stocktakesCss_list_link:{
          paddingLeft: 5,
      },
      stocktakesCss_list_box:{
          flex:1,
          padding:10,
          flexDirection:'row',
          alignItems:'center',
          justifyContent: 'space-between',
          //backgroundColor: this.props.index % 2  == 0 ? 'red' : 'yellow'
      },
      stocktakesCss_list:{
          marginBottom:150,
          paddingBottom: 10,
      },
      createStockTake_box:{
          flex:1,
      },
      createStockTake_main:{
          paddingVertical:10,
          alignItems:'center'
      },
      search_form_control:{
          backgroundColor:'#fff',
          flex:30,
          padding:0,
      },
      search_form_input:{
          fontSize:14,
          paddingHorizontal: 10,
      },
      search_icon:{
          marginLeft:0,
      }
});
  
const Main = StyleSheet.create({
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
          padding:20,
          paddingHorizontal: 0,
      },
      btn_fixed_box:{
          flex:50,
          width:'50%',
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

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      backgroundColor: 'lightblue',
      padding: 12,
      margin: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 22,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
});