import React, {Component} from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet,Text,View,TouchableOpacity ,TextInput,Picker,FlatList,TouchableHighlight,Alert} from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons";
import axios from 'axios';
import qs from 'qs';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view'
import Modal from "react-native-modal";
import moment from 'moment';
import { R_PRODUCT_STOCK, R_STOCK_TAKES, R_EDIT_STOCKTAKES,R_WAREHOUSING,R_EDIT_WAREHOUSING } from '../../reducers/actions';
import { isEmpty, findKey, includes, isArray, forEach, sumBy, filter,remove,  reduce as _reduce, chunk ,isNumber} from 'lodash';
import { product_api } from '../../services/api/fetch'
import { CheckBox } from 'react-native-elements'
class SearchProductWarehouse extends Component{
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            listProduct:null,
            product:null,
            barcode:'',
            isModalVisible: false,
            isModalVisibleProduct: false,
            isModalVisibleLo: false,
            quantity_1:0,
            productSet:null,
            listBatch:null,
            visible_check: {
                cash: false,
                percent: false,
            },
        };
    }

    componentWillReceiveProps(){
        const { navigation } = this.props;
        const sku = navigation.getParam('query','sku');
    }

    componentDidMount(){
        const { navigation } = this.props;
        const barcodeProduct = navigation.getParam('barcodeProduct','testdemo');
        if(barcodeProduct !== 'testdemo'){
            this.setState({barcode:barcodeProduct,query:barcodeProduct},()=>{
                this.getProduct();
            });    
        }
    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };

    toggleModalLo = () => {
        const{isModalVisibleLo} = this.state;
        this.setState({ isModalVisibleLo: !this.state.isModalVisibleLo },()=>{
            if(!isModalVisibleLo){
                this.setState({quantity:0});
            }
        });

    };

    toggleModalProduct = (item) => {
        const { isModalVisibleProduct} = this.state
        this.setState({ isModalVisibleProduct: !this.state.isModalVisibleProduct },()=>{
            if(!isModalVisibleProduct){
                this.setState({product:item,quantity_1:0});
                this.onAddProduct(item);
            }
        });
    };

    toggleModalProduct_Cancel = (item) => {
        const { isModalVisibleProduct} = this.state
        this.setState({ isModalVisibleProduct: !this.state.isModalVisibleProduct },()=>{
            const { list_warehousing, dispatch } = this.props;
            const list_warehousing_clone = Object.assign([], list_warehousing);
            // remove(list_stocktakes_clone, (v) => parseFloat(v.barcode_id, 10) === parseFloat(item.p_barcode_id, 10));
            remove(list_warehousing_clone, (v) => parseFloat(v.barcode_id, 10) === parseFloat(item, 10));
            dispatch({ type: R_WAREHOUSING, payload: list_warehousing_clone });
            dispatch({ type: R_EDIT_WAREHOUSING, payload: list_warehousing_clone });
        });
    };



    // static navigationOptions = {
    //     // headerTitle: <LogoTitle />,
    //     headerRight: (
    //       <Button
    //         onPress={() => this.props.navigation.navigate('CreateWarehouse')}
    //         title="Hủy"
    //         color="#fff"
    //       />
    //     ),
    // };

    static navigationOptions = ({ navigation }) => {
        return {
        //   headerTitle: "Title",
        headerRight: (
           <Button
            onPress={() => navigation.navigate('CreateWarehouse')}
            title="Hủy"
            color="#fff"
          />
          ),
        };
    }

    _renderProduct = (item,index) => {
        return (
            <TouchableOpacity 
                onPress={()=>{
                    this.toggleModalProduct(item)
                }}
            >
                <View>
                    <View style={stocktakesCss.stocktakesCss_list_box}>
                        <View style={stocktakesCss.stocktakesCss_list_left}>
                            <Text style={stocktakesCss.stocktakesCss_list_code}>{item.p_fullname}</Text>
                            <Text style={stocktakesCss.stocktakesCss_list_time}>Mã hàngxxx:{item.p_barcode}</Text>
                            <Text style={stocktakesCss.stocktakesCss_list_time}>Mã sản phẩm:{item.p_sku}</Text>
                        </View>
                        <View >
                            <Text style={stocktakesCss.stocktakesCss_list_time}>Thời gian :{item.p_updated_at}</Text>
                            <Text style={stocktakesCss.stocktakesCss_list_time}>Giá :{item.p_price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</Text>
                        </View>
                    </View>
                    <View style={{
                        height:1,
                        backgroundColor: '#ddd'
                    }}>
                    </View>
                </View>
            </TouchableOpacity>     
        );
    };

    handleInputChange = (text) => {
        this.setState({
          query: text
        }, () => {
            if (this.state.query && this.state.query.length > 2) {
                if (this.state.query.length % 2 === 0) {
                    this.getProduct();
                }
            } 
        })
    }

    getProduct = async () => {
        const params = {
            mtype: 'sync_sale',
            depot_id: 1,
            keyword:this.state.query,
            show_price_market:1,
            page:1,
            batch_status: 0,
        };
        product_api(params,'sync_product').then((data) => {
            if(isEmpty(data.products)){
                this.setState({isModalVisible:true});
            } 
            this.setState({listProduct:data.products});   
        })
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
        const { product, listBatch } = this.state
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
                this.setState({ product });
            }
        }
    }


    submitForm= ()=> {
        const { listBatch,product } = this.state;
        this.onChangeInput('list_batch', product.list_batch, null, product.p_id, product.p_properties_id)
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

    addStock = ( product, type) => {
        this.props.navigation.navigate('CreateWarehouse',{
        });
    };

   

    onAddProduct(product, type, quantityExcel, priceExcel) {
        const { list_warehousing, dispatch, location } = this.props;
        const list_warehousing_clone = Object.assign([], list_warehousing);

        const check = list_warehousing_clone.map((v, k) => {
            if (v.barcode_id === product.p_barcode_id) {
                list_warehousing_clone[k].quantity = parseFloat(list_warehousing_clone[k].quantity) + 1;
                return false;
            }
            return true;
        });
        const tmp_tag = {
            product_id: product.p_id,
            name: product.p_fullname,
            price: type === 'excel' ? priceExcel : parseFloat(product.p_price_market, 10),
            price_market: type === 'excel' ? priceExcel : parseFloat(product.p_price_market, 10),
            properties_id: product.p_properties_id,
            barcode: product.p_barcode,
            barcode_id: product.p_barcode_id,
            quantity_before: product.p_quantity,
            //quantity: type === 'excel' ? quantityExcel : 1,
            quantity: type === 'excel' ? quantityExcel : 0,
            list_batch: product.list_batch,
            is_batch: product.p_is_batch,
        };
       
        if (type === 'excel' && product.p_is_batch === 1) {
            const total = sumBy(product.list_batch, (o) => {
                let value = 0;
                if (o.batch_active === 1) {
                    value = parseFloat(o.quantity_sub);
                    if (!(value > 0) && !(value < 0)) {
                        value = 0;
                    }
                }
                return value;
            });

            const batch_ct = filter(product.list_batch, (o) => o.batch_active === 1);
            let batch_name = batch_ct.length > 0 ? `${batch_ct.length} lô` : '';
            if (batch_ct.length === 1) {
                batch_name = `${batch_ct[0].batch_name} - ${moment(batch_ct[0].expired_date).format('YYYY-MM-DD')}`;
            }
            tmp_tag.quantity = total;
            tmp_tag.batch_id = 999;
            tmp_tag.list_batch = product.list_batch;
            tmp_tag.batch_name = batch_name;
        }

        const lastKey = Object.keys(list_warehousing_clone)[Object.keys(list_warehousing_clone).length - 1];
        if (!isEmpty(lastKey)) {
            tmp_tag.key = parseInt(lastKey) + 1;
        } else {
            tmp_tag.key = 0;
        }
        this.setState({productSet:tmp_tag});
        if (!includes(check, false)) {
            list_warehousing_clone.push(tmp_tag);
            dispatch({ type: R_WAREHOUSING, payload: list_warehousing_clone });
            dispatch({ type: R_EDIT_WAREHOUSING, payload: list_warehousing_clone });
        } else {
            dispatch({ type: R_WAREHOUSING, payload: list_warehousing_clone });
            dispatch({ type: R_EDIT_WAREHOUSING, payload: list_warehousing_clone });
        }
        this.setState({ show_product: false });
    }

    onChangeInput = (type, e, k, p_id, p_properties_id) => {
        const {productSet} = this.state;
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
            productSet.quantity = value;
            list_warehousing_clone[key_product].quantity = value;
            this.setState({productSet});
        }
        if (type === 'price') {
            let value1 = e;
            if(parseInt(e) > 0 || parseInt(e) < 0){
                value1 = e;
            }else {
                value1 = 0;
            }
            productSet.price = value1;
            list_warehousing_clone[k].price = value1;
            this.setState({productSet});
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

                productSet.quantity = total;
                this.setState({productSet});
            }
        }
       
        dispatch({ type: R_WAREHOUSING, payload: list_warehousing_clone });
        dispatch({ type: R_EDIT_WAREHOUSING, payload: list_warehousing_clone });
        this.toggleModalLo();
    }
    quantityProduct = (product) =>{
        let quantityProduct = 0;
        product.list_batch.map((v) => {
            quantityProduct = quantityProduct+ parseInt(v.quantity_sub);
        });
        return quantityProduct;
    }

    setButton = (data) =>{
        this.setState({activeButton:data});
    }

    visible_check = (type) => {
        const { visible_check } = this.state;
        visible_check.cash = false;
        visible_check.percent = false;
        visible_check[type] = !visible_check[type];
        this.setState({ visible_check });
    }

    render() {
        const { listProduct,product,quantity_1,isModalVisibleLo,visible_check,productSet} = this.state;
        const { list_stocktakes } = this.props;
        return (
            <View>

                <Input
                    placeholder="Chọn hàng kiểm "
                    style={{ marginTop: 50 }}
                    leftIcon={(
                        <Icon
                            name="ios-search"
                            size={18}
                            color="#ddd"
                        />
                    )}
                    value={this.state.query}
                    onChangeText = {this.handleInputChange}
                /> 
                { listProduct !=null
                    &&(
                        <View style={stocktakesCss.stocktakesCss_list}>
                            <FlatList
                                data={listProduct}
                                renderItem={({item, index})=>{
                                    return( this._renderProduct(item, index));
                                }}
                                keyExtractor={(item, index) => index.toString()}
                                ItemSeparatorComponent={this.renderSeparator}
                                onEndReachedThreshold={0.4}
                                
                            >
                            </FlatList>
                        </View>
                    )
                }
                <Modal isVisible={this.state.isModalVisible}>
                    <View style={styles.modalContent}>
                        <Text>Không tìm thấy sản phẩm !</Text>
                        <Button title="Hide modal" onPress={this.toggleModal} />
                    </View>
                </Modal>
                { product != null
                    &&(
                        <Modal isVisible={this.state.isModalVisibleProduct}>
                            <View style={styles.modalContent}>
                                <Text>{product.p_fullname}</Text>
                                <Text>Mã sản phẩm :{product.p_barcode}</Text>
                                {!isEmpty(product.list_batch)
                                    &&(
                                        <View>
                                            <Button title="Chọn lô" onPress={this.toggleModalLo} />
                                            <Modal isVisible={this.state.isModalVisibleLo}>
                                                <View style={styles.modalContent}>
                                                    {this._renderLo(product)}
                                                    <Button title="Bỏ qua" onPress={this.toggleModalLo} /> 
                                                    <Button title="Lưu" onPress={this.submitForm} /> 
                                                </View>
                                            </Modal>
                                        </View>
                                        
                                    )
                                }
                                
                            </View>
                            <View>
                                <View style={{height: 40, backgroundColor: 'white'}} >
                                    <View style={{flex: 1, flexDirection: 'row',marginLeft:20}}>
                                        <View style={{width: 80}} >
                                            <Text style={{fontSize:15}}>Số lượng</Text> 
                                        </View>
                                        {isEmpty(product.list_batch)
                                        &&(
                                            <View>
                                                <View style={{width: 80}} >
                                                    <TextInput
                                                        keyboardType='numeric'
                                                        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                                                        value={parseFloat(productSet.quantity).toString()}
                                                        onChangeText={(e) =>this.onChangeInput('quantity_product', e, productSet.key, productSet.product_id, productSet.properties_id)}
                                                    /> 
                                                </View>
                                                <View style={{width: 40,fontSize:20}} >
                                                    <Button title="-" onPress={this.deProduct} />
                                                </View>
                                                <View style={{width: 40,fontSize:20}} >
                                                    <Button title="+" onPress={this.inProduct} />
                                                </View>
                                            </View>
                                        )}
                                        {!isEmpty(product.list_batch)
                                        &&(
                                            <View>
                                                <View style={{width: 80}} >
                                                    <Text>
                                                        {productSet.quantity}
                                                    </Text>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </View>
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
                                                    value={parseFloat(productSet.price).toString()}
                                                    onChangeText={(e) => this.onChangeInput('price', e, productSet.key)}
                                            /> 
                                        </View>
                                    </View>
                                </View>
                            </View>
                            
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
                                                    value={(parseFloat((parseFloat(productSet.quantity, 10) * parseFloat(productSet.price, 10)))).toString()}
                                                    onChangeText={(quantity_1) => this.setState({quantity_1},()=>{
                                                        this.onChangeInput('quantity_product', quantity_1 ,product.key, product.p_id, product.p_properties_id)
                                                    })}
                                                />  */}
                                            <Text style={{height: 40}}>
                                                {(parseFloat((parseFloat(productSet.quantity, 10) * parseFloat(productSet.price, 10)))).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <Button title=" Cập nhật " onPress={()=>this.addStock(product)} />
                            <Button title="Đóng" onPress={()=>this.toggleModalProduct_Cancel(product)} />
                        </Modal>
                    )
                }
               
            </View>
            
        );
    }
}


const mapStateToProps = ({ persist }) => ({
    list_warehousing: persist.list_warehousing,
    id_warehouseing: persist.id_warehouseing,
});
export default connect(mapStateToProps)(SearchProductWarehouse);

SearchProductWarehouse.navigationOptions = {
    title: 'Tìm kiếm sản phẩm',
    drawerLabel: () => null,
};

  
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