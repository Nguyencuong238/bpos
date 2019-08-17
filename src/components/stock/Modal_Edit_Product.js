import React, {Component} from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet,Text,View,TouchableOpacity ,TextInput,Picker,FlatList,TouchableHighlight,Alert} from 'react-native';
import { Input, Button } from 'react-native-elements';
import axios from 'axios';
import qs from 'qs';
import Modal from "react-native-modal";
import { R_PRODUCT_STOCK, R_STOCK_TAKES, R_EDIT_STOCKTAKES } from '../../reducers/actions';
import moment from 'moment';
import { isEmpty, findKey, includes, isArray, forEach, sumBy, filter,remove,  reduce as _reduce, chunk ,isNumber} from 'lodash';
import { stocktakesCss } from '../../styles/stock';
import { Main } from '../../styles/main';
import { goodsCss } from '../../styles/goods';

class Modal_Edit_Product extends Component{
    constructor(props) {
        super(props);
        this.state = {
            current_id:0,
            quantity_1:0,
            query: '',
            listProduct:null,
            barcode:'',
            isModalVisible: false,
            isModalVisibleProduct: false,
            isModalVisibleLo: false,
            quantity_1:0,
            listBatch:null,
            product:null
        };
    }

    componentWillReceiveProps(nextProps){
        this.setState ({product :nextProps.edit_product})
    }
    
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

    renderFooter = () => {
        if (!this.state.refreshing) return null;
         return (
            <ActivityIndicator
             size="large" color="#0000ff"
            />
         );
    };

    deProduct = () =>{ 
        if(parseInt(this.state.quantity_1) == 0){
           this.setState({quantity_1 : 0})
        }else{
            this.setState({ quantity_1: parseInt(this.state.quantity_1) - 1 });
        }
    }

    
    inProduct = () =>{
        this.setState({ quantity_1: parseInt(this.state.quantity_1) + 1 });
    }

    onChangeInputLo(e, type, batch_id) {
        const { product, listBatch } = this.state;
        if (type === 'number_product') {
            const value = e.target.value;
            this.setState({ number_product: value });
        }
        if (type === 'batch_name') {
            const value = e.target.value;
            this.setState({ batch_name: value });
        }
        if (type === 'quantity_batch') {
            const key = findKey(product.list_batch, (o) => o.batch_id === batch_id);
            if (key !== undefined) {
                let value = e;
                if(parseInt(e) > 0 || parseInt(e) < 0){
                    value = e;
                }else {
                    value = 0;
                }
                product.list_batch[key].quantity_sub = value;
                this.setState({ product },()=>{
                    this.onChangeInput('list_batch', product.list_batch, null, product.product_id, product.properties_id);
                });
            }
        }
    }


    // submitForm= ()=> {
    //     const { listBatch,product } = this.state;
    //     this.onChangeInput('list_batch', product.list_batch, null, product.p_id, product.p_properties_id)
    // }

    _renderLo = (product) => {
        const htm = product.list_batch.map((v, k) => {
            if (v.quantity_sub === undefined) {
                v.quantity_sub = v.quantity;
            }
            v.batch_active = 1;
            return (
                <View>
                    <View >
                        <Text style={{fontSize:13,marginVertical:15}}>Tên lô: {v.batch_name}</Text>
                        <TextInput
                            keyboardType='numeric'
                            style={{height: 40, borderColor: '#ddd', borderWidth: 1,borderRadius:3,paddingHorizontal:15}}
                            value={(parseInt(v.quantity_sub)).toString()}
                            onChangeText={(e) => this.onChangeInputLo(e, 'quantity_batch', v.batch_id)}
                        />
                    </View>
                </View>     
            );
        });
        return htm;
    };

    onChangeInput = (type, e, k, p_id, p_properties_id) => {
        const {quantity_1} = this.state;
        const { list_stocktakes, dispatch } = this.props;
        const list_stocktakes_clone = [...list_stocktakes];
        if (type === 'quantity_product') {
            const key_product = findKey(list_stocktakes_clone, (o) => o.product_id === p_id && o.properties_id === p_properties_id);
            list_stocktakes_clone[key_product].quantity = quantity_1 ;
            dispatch({ type: R_STOCK_TAKES, payload: list_stocktakes_clone });
            dispatch({ type: R_EDIT_STOCKTAKES, payload: list_stocktakes_clone });
        }
        if (type === 'price_sell') {
            e.target.value = e.target.value.replace(/\./g, '');
            list_stocktakes_clone[k].price = e.target.value;
            dispatch({ type: R_STOCK_TAKES, payload: list_stocktakes_clone });
            dispatch({ type: R_EDIT_STOCKTAKES, payload: list_stocktakes_clone });
        }
        if (type === 'batch') {
            const key_product = findKey(list_stocktakes_clone, (o) => o.product_id === p_id && o.properties_id === p_properties_id);
            if (!isEmpty(e)) {
                list_stocktakes_clone[key_product].quantity = e.number_product;
                list_stocktakes_clone[key_product].batch_id = e.batch_id;
                list_stocktakes_clone[key_product].quantity_before = e.quantity;
                list_stocktakes_clone[key_product].batch_name = `${e.name} - ${moment(e.expired_date).format('YYYY-MM-DD')}`;
            }
            dispatch({ type: R_STOCK_TAKES, payload: list_stocktakes_clone });
            dispatch({ type: R_EDIT_STOCKTAKES, payload: list_stocktakes_clone });
        }
        if (type === 'list_batch') {
            const key_product = findKey(list_stocktakes_clone, (o) => o.product_id === p_id && o.properties_id === p_properties_id);
            if (!isEmpty(e)) {
                const total = sumBy(e, (o) => {
                    let value = parseFloat(o.quantity_sub);
                    if (!(value > 0) && !(value < 0)) {
                        value = 0;
                    }
                    return value;
                });

                const batch_ct = filter(e, (o) => o.batch_active === 1);
                let batch_name = batch_ct.length > 0 ? `${batch_ct.length} lô` : '';
                if (batch_ct.length === 1) {
                    batch_name = `${batch_ct[0].name} - ${moment(batch_ct[0].expired_date).format('YYYY-MM-DD')}`;
                }
                list_stocktakes_clone[key_product].quantity = total;
                list_stocktakes_clone[key_product].batch_id = 999;
                list_stocktakes_clone[key_product].list_batch = e;
                list_stocktakes_clone[key_product].batch_name = batch_name;
            }
            dispatch({ type: R_STOCK_TAKES, payload: list_stocktakes_clone });
            dispatch({ type: R_EDIT_STOCKTAKES, payload: list_stocktakes_clone });
        }
        // this.toggleModalLo();
    }

    resetForm = () => {
        const { onVisible } = this.props;
        this.props.onVisible();
    }

    onDelete = (product) => {
        console.log(product)
        const { list_stocktakes, dispatch } = this.props;
        const list_stocktakes_clone = [...list_stocktakes];
        remove(list_stocktakes_clone, (v) => parseFloat(v.barcode_id, 10) === parseFloat(product.barcode_id, 10));
        dispatch({ type: R_STOCK_TAKES, payload: list_stocktakes_clone });
        dispatch({ type: R_EDIT_STOCKTAKES, payload: list_stocktakes_clone });
        const { onVisible } = this.props;
        this.props.onVisible();
    }
    render() {
        const { visible_edit,edit_product } = this.props;       
        const { product } = this.state;
        return (
            <View>
                { edit_product != null
                    &&(
                        <Modal isVisible={visible_edit}>
                            <View style={stocktakesCss.modal_header_top}>
                                <Text style={stocktakesCss.modal_header_top_title}>{edit_product.p_fullname}</Text>
                                <Text style={stocktakesCss.modal_header_top_code}>{edit_product.p_barcode}</Text>
                                {/* {!isEmpty(edit_product.list_batch) */}
                            </View>
                            {!isEmpty(product)
                            &&(
                                <View style={{padding:15, backgroundColor: '#fff'}}>
                                    <View>
                                        <Text style={{fontWeight:'700'}}>
                                            Chọn lô, hạn sử dụng
                                        </Text>
                                    </View>
                                    {this._renderLo(product)}
                                </View>    
                            )}   
                            {isEmpty(edit_product.list_batch) 
                            &&(
                            <View style={{padding:15, backgroundColor: '#fff'}}>
                                <View style={{textAlign:'center'}} >
                                    <View style={{flexDirection: 'row',justifyContent:'center'}}>
                                        <View style={{width: 80}} >
                                            <Text style={{fontSize:15,textAlign:'center'}}>Tồn kho</Text> 
                                        </View>
                                        <View style={{width: 80}} >
                                            <Text style={{fontSize:15,textAlign:'center'}}>Đã kiểm</Text> 
                                        </View>
                                        <View style={{width: 80}} >
                                            <Text style={{fontSize:15,textAlign:'center'}}>Chênh lệch</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{marginTop:10}}>
                                    <View style={{flexDirection: 'row',justifyContent:'center'}}>
                                        <View style={{width: 80}} >
                                            <Text style={{fontSize:15,textAlign:'center'}}>{edit_product.quantity_before}</Text> 
                                        </View>
                                        <View style={{width: 80}} >
                                            <Text style={{fontSize:15,textAlign:'center',color:'#28af6b'}}>{edit_product.quantity}</Text> 
                                        </View>
                                        <View style={{width: 80}} >
                                            <Text style={{fontSize:15,textAlign:'center',color:'red'}}>{edit_product.quantity_before-edit_product.quantity}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            )}
                            {/* <View style={{
                                height:1,
                                backgroundColor: '#ddd'
                            }}>
                            </View> */}
                            {isEmpty(edit_product.list_batch)
                                &&(  
                                <View style={{padding:15, backgroundColor: 'white'}} >
                                    <View style={{flexDirection: 'row',alignItems:'center',alignSelf:'center',justifyContent:'center'}}>
                                        <View>
                                            <Text style={{fontSize:15,marginRight:15}}>Số lượng</Text> 
                                        </View>
                                        <View style={{width: 40,fontSize:20}} >
                                            <Button 
                                                title="-" 
                                                onPress={this.deProduct} 
                                                buttonStyle={{borderRadius:0,backgroundColor:'#28af6b'}}
                                            />
                                        </View>
                                        <View>
                                            <TextInput
                                                keyboardType='numeric'
                                                style={{height: 40,width:70, borderColor: '#efefef', borderWidth: 1,textAlign:'center'}}
                                                value={this.state.quantity_1.toString()}
                                                onChangeText={(quantity_1) => this.setState({quantity_1},()=>{
                                                    this.onChangeInput('quantity_product', quantity_1 ,edit_product.key, edit_product.product_id, edit_product.properties_id)
                                                })}
                                            />
                                        </View>
                                        <View style={{width: 40,fontSize:20}} >
                                            <Button 
                                                title="+" 
                                                onPress={this.inProduct} 
                                                buttonStyle={{borderRadius:0,backgroundColor:'#28af6b'}}
                                            />
                                        </View>
                                    </View>
                                </View>
                            )}                     
                            <View style={{
                                height:1,
                                backgroundColor: '#ddd'
                            }}>
                            </View>
                            {/* <Button title=" Cập nhật " onPress={()=>this.addStock(product)} /> */}
                            <View style={{padding:15,backgroundColor:'#fff'}}>
                                <View style={Main.row}>
                                    <View style={Main.col_3}>
                                        {isEmpty(edit_product.list_batch)
                                        &&(
                                        <Button 
                                            title="Xóa" 
                                            onPress={()=>this.onDelete(edit_product)} 
                                            buttonStyle={{backgroundColor:'red',width:'100%'}}
                                            titleStyle={{fontSize:13}}
                                        />
                                        )}
                                        {!isEmpty(edit_product.list_batch)
                                        &&(
                                        <Button 
                                            title="Xóa" 
                                            onPress={()=>this.onDelete(product)} 
                                            buttonStyle={{backgroundColor:'red',width:'100%'}}
                                            titleStyle={{fontSize:13}}
                                        />
                                        )}
                                        </View>
                                    <View style={Main.col_3}>
                                        <Button 
                                            title="Đóng" 
                                            onPress={this.resetForm} 
                                            buttonStyle={{backgroundColor:'#ffc107',width:'100%'}}
                                            titleStyle={{fontSize:13}}
                                        />
                                    </View>
                                    <View style={Main.col_3}>
                                        <Button 
                                            title=" Cập nhật " 
                                            onPress={this.resetForm}
                                            buttonStyle={{backgroundColor:'#28af6b',width:'100%'}}
                                            titleStyle={{fontSize:13}}
                                        />
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    )
                }  
            </View>   
        );
    }
}

// persist
// const mapStateToProps = ({ state }) => ({
//     product_stock: state.product_stock,
//     list_stocktakes: state.list_stocktakes,
//     list_stocktakes_save: state.list_stocktakes_save,
// });

const mapStateToProps = ({ persist }) => ({
    product_stock: persist.product_stock,
    list_stocktakes: persist.list_stocktakes,
    list_stocktakes_save: persist.list_stocktakes_save,
});
export default connect(mapStateToProps)(Modal_Edit_Product);
