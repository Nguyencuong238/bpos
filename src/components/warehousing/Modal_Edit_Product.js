import React, {Component} from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet,Text,View,TouchableOpacity ,TextInput,Picker,FlatList,TouchableHighlight,Alert} from 'react-native';
import { Input, Button } from 'react-native-elements';
import axios from 'axios';
import qs from 'qs';
import Modal from "react-native-modal";
import { R_PRODUCT_STOCK, R_STOCK_TAKES, R_EDIT_STOCKTAKES ,R_WAREHOUSING,R_EDIT_WAREHOUSING} from '../../reducers/actions';
import moment from 'moment';
import { isEmpty, findKey, includes, isArray, forEach, sumBy, filter,remove,  reduce as _reduce, chunk ,isNumber} from 'lodash';
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
        const { product,listBatch } = this.state;
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
                    this.onChangeInput('list_batch', product.list_batch, null, product.product_id, product.properties_id)
                });


            }
        }
    }

    _renderLo = (product) => {
        const htm = product.list_batch.map((v, k) => {
            if (v.quantity_sub === undefined) {
                v.quantity_sub = 0;
            }
            v.batch_active = 1;
            return (
                <View>
                    <View >
                        <View>
                            <Text>
                                Chọn lô, hạn sử dụng
                            </Text>
                        </View>
                        <View >
                            <Text style={stocktakesCss.stocktakesCss_list_code}>Tên lô :{v.batch_name}</Text>
                            <TextInput
                                keyboardType='numeric'
                                style={{height: 40, borderColor: 'red', borderWidth: 1}}
                                value={(parseInt(v.quantity_sub)).toString()}
                                onChangeText={(e) => this.onChangeInputLo(e, 'quantity_batch', v.batch_id)}
                            />
                        </View>
                        <View >
                        </View>
                    </View>
                    <View style={{
                        height:1,
                        backgroundColor: '#ddd'
                    }}>
                    </View>
                </View>     
            );
        });
        return htm;
    };




    


    onChangeInput = (type, e, k, p_id, p_properties_id) => {
        const {product} = this.state;
        const { list_warehousing, dispatch } = this.props;
        const list_warehousing_clone = Object.assign([], list_warehousing);
        if (type === 'quantity_product') {
            // console.log(e)
            const key_product = findKey(list_warehousing_clone, (o) => o.product_id === p_id && o.properties_id === p_properties_id);
            let value = e;
            if(parseInt(e) > 0 || parseInt(e) < 0){
                value = e;
            }else {
                value = 0;
            }
            product.quantity = value;
            list_warehousing_clone[key_product].quantity = value;
            this.setState({product});
        }
        if (type === 'price') {
            let value1 = e;
            if(parseInt(e) > 0 || parseInt(e) < 0){
                value1 = e;
            }else {
                value1 = 0;
            }
            product.price = value1;
            list_warehousing_clone[k].price = value1;
            this.setState({product});
        }
        if (type === 'batch') {
            const key_product = findKey(list_warehousing_clone, (o) => o.product_id === p_id && o.properties_id === p_properties_id);
            if (!isEmpty(e)) {
                list_warehousing_clone[key_product].quantity = e.number_product;
                list_warehousing_clone[key_product].batch_id = e.id;
                list_warehousing_clone[key_product].batch_name = `${e.name} - ${moment(e.expired_date).format('YYYY-MM-DD')}`;
            }
        }
        if (type === 'list_batch') {
            const key_product = findKey(list_warehousing_clone, (o) => o.product_id === p_id && o.properties_id === p_properties_id);
            if (!isEmpty(e)) {
                const total = sumBy(e, (o) => {
                    let value = 0;
                    if (o.batch_active === 1) {
                        value = parseFloat(o.quantity_sub);
                        if (!(value > 0) && !(value < 0)) {
                            value = 0;
                        }
                    }
                    return value;
                });

                const batch_ct = filter(e, (o) => o.batch_active === 1);
                let batch_name = batch_ct.length > 0 ? `${batch_ct.length} lô` : '';
                if (batch_ct.length === 1) {
                    batch_name = `${batch_ct[0].name} - ${moment(batch_ct[0].expired_date).format('YYYY-MM-DD')}`;
                }
                list_warehousing_clone[key_product].quantity = total;
                list_warehousing_clone[key_product].batch_id = 999;
                list_warehousing_clone[key_product].list_batch = e;
                list_warehousing_clone[key_product].batch_name = batch_name;

                product.quantity = total;
                this.setState({product});
            }
        }
       
        dispatch({ type: R_WAREHOUSING, payload: list_warehousing_clone });
        dispatch({ type: R_EDIT_WAREHOUSING, payload: list_warehousing_clone });
        
    }

    resetForm = () => {
        const { onVisible } = this.props;
        this.props.onVisible();
    }

    onDelete = (product) => {
        const { list_warehousing, dispatch } = this.props;
        const list_warehousing_clone = Object.assign([], list_warehousing);
        remove(list_warehousing_clone, (v) => parseFloat(v.barcode_id, 10) === parseFloat(product.barcode_id, 10));
        dispatch({ type: R_WAREHOUSING, payload: list_warehousing_clone });
        dispatch({ type: R_EDIT_WAREHOUSING, payload: list_warehousing_clone });
        this.props.onVisible();
    }
    render() {
        const { visible_edit,edit_product } = this.props;       
        const { product } = this.state;
        return (
            <View>
                { product != null
                    &&(
                        <Modal isVisible={visible_edit}>
                            <View style={styles.modalContent}>
                                <Text>{product.name}</Text>
                                <Text>Mã sản phẩm :{product.barcode_id}</Text>
                                {!isEmpty(product.list_batch)
                                    &&(
                                        <View>
                                            {this._renderLo(product)}
                                        </View>    
                                    )
                                }   
                            </View>
                            {isEmpty(product.list_batch)
                            &&(
                            <View>
                                <View style={{height: 40, backgroundColor: 'white'}} >
                                    <View style={{flex: 1, flexDirection: 'row',marginLeft:20}}>
                                        <View style={{width: 80}} >
                                            <Text style={{fontSize:15}}>Số lượng</Text> 
                                        </View>
                                        <View style={{width: 80}} >
                                            <TextInput
                                                keyboardType='numeric'
                                                style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                                                value={parseFloat(product.quantity).toString()}
                                                onChangeText={(e) =>this.onChangeInput('quantity_product', e, product.key, product.product_id, product.properties_id)}
                                            /> 
                                        </View>
                                        <View style={{width: 40,fontSize:20}} >
                                            <Button title="-" onPress={this.deProduct} />
                                        </View>
                                        <View style={{width: 40,fontSize:20}} >
                                            <Button title="+" onPress={this.inProduct} />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            )}
                            {isEmpty(product.list_batch)
                                &&(
                                <View>
                                    <View style={{height: 40, backgroundColor: 'white'}} >
                                        <View style={{flex: 1, flexDirection: 'row',marginLeft:20}}>
                                            <View style={{width: 80}} >
                                                <Text style={{fontSize:15}}>Đơn giá</Text> 
                                            </View>
                                            <View style={{width: 80}} >
                                                
                                            </View>
                                            <View style={{width: 80,fontSize:20}}>
                                                <TextInput
                                                        keyboardType='numeric'
                                                        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                                                        value={parseFloat(product.price).toString()}
                                                        onChangeText={(e) => this.onChangeInput('price', e, product.key)}
                                                    /> 
                                            </View>
                                        </View>
                                    </View>
                                </View>
                             )}
                             {isEmpty(product.list_batch)
                                &&(
                             <View>
                                <View style={{height: 40, backgroundColor: 'white'}} >
                                    <View style={{flex: 1, flexDirection: 'row',marginLeft:20}}>
                                        <View style={{width: 80}} >
                                            <Text style={{fontSize:15}}>Thành tiền</Text> 
                                        </View>
                                        <View style={{width: 80}} >
                                            
                                        </View>
                                        <View style={{width: 80,fontSize:20}} >
                                            {/* <TextInput
                                                    keyboardType='numeric'
                                                    style={{height: 40}}
                                                    value={(parseFloat((parseFloat(product.quantity, 10) * parseFloat(product.price, 10)))).toString()}
                                                    
                                                />  */}
                                            <Text>
                                                {(parseFloat((parseFloat(product.quantity, 10) * parseFloat(product.price, 10)))).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            )}
                            <Button title=" Cập nhật " onPress={this.resetForm}/>
                            <Button title="Đóng" onPress={this.resetForm} />
                            {isEmpty(product.list_batch)
                            &&(
                            <Button title="Xóa" onPress={()=>this.onDelete(product)} />
                            )}
                            {!isEmpty(product.list_batch)
                            &&(
                            <Button title="Xóa" onPress={()=>this.onDelete(product)} />
                            )}
                        </Modal>
                    )
                }  
            </View>   
        );
    }
}

const mapStateToProps = ({ persist }) => ({
    product_stock: persist.product_stock,
    list_stocktakes: persist.list_stocktakes,
    list_stocktakes_save: persist.list_stocktakes_save,

    list_warehousing: persist.list_warehousing,
    list_warehousing_save: persist.list_warehousing_save,
});
export default connect(mapStateToProps)(Modal_Edit_Product);


  
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