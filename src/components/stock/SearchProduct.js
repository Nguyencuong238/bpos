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
import { R_PRODUCT_STOCK, R_STOCK_TAKES, R_EDIT_STOCKTAKES } from '../../reducers/actions';
import { isEmpty, findKey, includes, isArray, forEach, sumBy, filter,remove,  reduce as _reduce, chunk ,isNumber} from 'lodash';
// import { R_PRODUCT_STOCK } from '../reducers/actions';
import { product_api } from '../../services/api/fetch'
import { goodsCss } from '../../styles/goods';
import { stocktakesCss } from '../../styles/stock';
import { Main } from '../../styles/main';
import { Searchbar } from 'react-native-paper';

class SearchProduct extends Component{
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
            listBatch:null,
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
            const { list_stocktakes, dispatch } = this.props;
            const list_stocktakes_clone = [...list_stocktakes];
            remove(list_stocktakes_clone, (v) => parseFloat(v.barcode_id, 10) === parseFloat(item.p_barcode_id, 10));
            dispatch({ type: R_STOCK_TAKES, payload: list_stocktakes_clone });
            dispatch({ type: R_EDIT_STOCKTAKES, payload: list_stocktakes_clone });
        });
    };

    // static navigationOptions = {
    //     // headerTitle: <LogoTitle />,
    //     headerRight: (
    //       <Button
    //         onPress={() => alert('This is a button!')}
    //         title="Hủy"
    //         color="#fff"
    //       />
    //     ),
    // };

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
                            <Text style={stocktakesCss.stocktakesCss_list_time}>Mã hàng: {item.p_barcode}</Text>
                            <Text style={stocktakesCss.stocktakesCss_list_time}>Mã sản phẩm: {item.p_sku}</Text>
                        </View>
                        <View >
                            <Text style={stocktakesCss.stocktakesCss_list_time}>{item.p_updated_at}</Text>
                            <Text style={{textAlign:'right',fontSize:14,color:'#28af6b'}}>Giá: {item.p_price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}đ</Text>
                        </View>
                    </View>
                    {/* <View style={{
                        height:1,
                        backgroundColor: '#ddd'
                    }}>
                    </View> */}
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
        // try {
        //     const res = await axios('https://wdevapi.bpos.vn/api/pos/product?query_string=sync_product', {
        //         method: 'post',
        //         headers: {
        //             authcode: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1NjE5NjQxMjQsImV4cCI6MTU5MzU4NjUyNCwidWlkIjoxLCJhdXRoX2NvZGUiOiJmZjNjMWUxODBiNTIzNjQxZGQxODIyYWY1YmYwZjk4MyIsIm5vZGVfaWQiOjMwMSwiY2xhaW1zIjp7Im5vZGVfaWQiOiIzMDEifX0.X0HrLbSaWKa5BZGyyTJVreDf2wr12AHQYGJic0jIdJECS7Egm0-a6Nd07koiMNrAXR4NvAJEUn4DLYo2c0aNiLCsKfIZyBHsVmOMylogJoYZUeqhXh8nTgWrpsKkK_R_nJY7_IOr1dtNSZ-wEWGtUaIfBBgYMfsxtRqhA6OmFEO-iSmAscPx9t8jUWQcvmo9uw-wjvV-nGke8bIUZB7yT4W8IsOENrRIOAtXBegu8I4V72cl2TcSqhraOT2D97L2EilSj5TeuXat9QZjr3NQfbHLESVFmqFaNn_Zl7NWzXKQv9MCLFh9WcRyQM41_ajtAA8DKo5GUo_aNMHGR-MR1Q',
        //         },
        //         data: qs.stringify(params),
        //     });

        //     if(isEmpty(res.data.data.products)){
        //         this.setState({isModalVisible:true});
        //     }          
        //     this.setState({listProduct:res.data.data.products});          
        // } catch (error) {
        // }

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
              height: 1,
              width: '100%',
              backgroundColor: '#ddd'
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
        // let batch_info = find(listBatch, (o) => o.id === batch_id || o.batch_id === batch_id);

        // if (!isEmpty(batch_info)) {
        //     batch_info.number_product = number_product;
        // }
        // let type = 'batch';
        // if (multi_batch !== undefined && multi_batch) {
        //     type = 'list_batch';
        //     batch_info = listBatch;
        // }
        this.onChangeInput('list_batch', product.list_batch, null, product.p_id, product.p_properties_id)
    }

    _renderLo = (product) => {
        const htm = product.list_batch.map((v, k) => {
            if (v.quantity_sub === undefined) {
                v.quantity_sub = v.quantity;
            }
            v.batch_active = 1;
            return (
                <View style={{padding:15, backgroundColor: '#fff'}}>
                    <View>
                        <Text style={{fontWeight:'700'}}>
                            Chọn lô, hạn sử dụng
                        </Text>
                    </View>
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

    addStock = ( product, type) => {
        const { navigation,product_stock,dispatch } = this.props;
        if(!isEmpty(product)){
            product_stock.push(product)
        }
        dispatch({ type: R_PRODUCT_STOCK, payload: product_stock });
        // this.props.navigation.navigate('CreateStockTake',{
        //     productId:product_stock
        // });
        this.props.navigation.navigate('CreateStockTake',{
            // productId:product_stock
        });
    };

    onAddProduct(product, type, quantityExcel, batch_info) {
        const { list_stocktakes, dispatch,location } = this.props;
        const list_stocktakes_clone = Object.assign([], list_stocktakes);
        const check = list_stocktakes_clone.map((v, k) => {
            if (v.sku === product.p_sku && type !== 'excel') {
                list_stocktakes_clone[k].quantity = parseFloat(list_stocktakes_clone[k].quantity) + 1;
                return false;
            }
            return true;
        });
        const p_quantity = parseFloat(product.p_quantity);

        const tmp_tag = {
            product_id: product.p_id,
            name: product.p_fullname,
            price: parseFloat(product.p_price_market, 10),
            price_market: parseFloat(product.p_price_market, 10),
            properties_id: product.p_properties_id,
            sku: product.p_sku,
            barcode: product.p_barcode,
            barcode_id: product.p_barcode_id,
            quantity_before: p_quantity,
            quantity: type === 'excel' ? quantityExcel : p_quantity,
            is_batch: product.p_is_batch,
            list_batch: product.list_batch,
            batch_id: 0,
        };
        if (type === 'excel' && product.p_is_batch === 1 && !isEmpty(batch_info)) {
            let batch_info_list = batch_info.split(',');
            batch_info_list = filter(batch_info_list, (o) => !isEmpty(o));
            if (isArray(batch_info_list) && !isEmpty(tmp_tag.list_batch)) {
                forEach(batch_info_list, (v) => {
                    let batch_name = '';
                    let expired_date = '';
                    let quantity = '';

                    if (!isEmpty(v)) {
                        const info = v.split('|');
                        if (info[0] !== undefined && !isEmpty(info[0])) {
                            batch_name = info[0].trim();
                        }
                        if (info[1] !== undefined && !isEmpty(info[1])) {
                            expired_date = info[1].trim();
                        }
                        if (info[2] !== undefined && !isEmpty(info[2])) {
                            quantity = !isEmpty(info[2].trim()) ? parseFloat(info[2].trim()) : null;
                        }
                    }
                    if (!isEmpty(batch_name) && !isEmpty(batch_name) && quantity >= 0) {
                        const key_batch = findKey(tmp_tag.list_batch, (o) => o.batch_name.toLowerCase() === batch_name.toLowerCase() && moment(o.expired_date).format('YYYY-MM-DD') === expired_date);
                        if (key_batch !== undefined) {
                            tmp_tag.list_batch[key_batch].quantity_sub = quantity;
                            tmp_tag.list_batch[key_batch].batch_active = 1;
                        }
                    }
                });
            }

            const total = sumBy(tmp_tag.list_batch, (o) => {
                const { quantity_sub } = o;
                let quantity_sub_1 = quantity_sub;
                if (quantity_sub === undefined) {
                    quantity_sub_1 = o.quantity;
                }
                let value = parseFloat(quantity_sub_1);
                if (!(value > 0) && !(value < 0)) {
                    value = 0;
                }
                return value;
            });

            const batch_ct = filter(tmp_tag.list_batch, (o) => o.batch_active === 1);
            let batch_name = batch_ct.length > 0 ? `${batch_ct.length} lô` : '';
            if (batch_ct.length === 1) {
                batch_name = `${batch_ct[0].name} - ${moment(batch_ct[0].expired_date).format('YYYY-MM-DD')}`;
            }

            tmp_tag.quantity = total;
            tmp_tag.batch_id = 999;
            tmp_tag.batch_name = batch_name;
        }

        const lastKey = Object.keys(list_stocktakes_clone)[Object.keys(list_stocktakes_clone).length - 1];
        if (!isEmpty(lastKey)) {
            tmp_tag.key = parseInt(lastKey) + 1;
        } else {
            tmp_tag.key = 0;
        }

        if (!includes(check, false)) {
            list_stocktakes_clone.push(tmp_tag);
            dispatch({ type: R_STOCK_TAKES, payload: list_stocktakes_clone });
            dispatch({ type: R_EDIT_STOCKTAKES, payload: list_stocktakes_clone });
            // if (isEmpty(location.search)) {
            //     dispatch({ type: R_EDIT_STOCKTAKES, payload: list_stocktakes_clone });
            // }
        } else {
            dispatch({ type: R_STOCK_TAKES, payload: list_stocktakes_clone });
            dispatch({ type: R_EDIT_STOCKTAKES, payload: list_stocktakes_clone });
            // if (isEmpty(location.search)) {
            //     dispatch({ type: R_EDIT_STOCKTAKES, payload: list_stocktakes_clone });
            // }
        }
        this.setState({ show_product: false });
    }


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
        this.toggleModalLo();
    }

    quantityProduct = (product) =>{
        let quantityProduct = 0;
        product.list_batch.map((v) => {
            quantityProduct = quantityProduct+ parseInt(v.quantity_sub);
        });
        return quantityProduct;
    }

    render() {
        const { listProduct,product,quantity_1,isModalVisibleLo} = this.state;
        const { list_stocktakes } = this.props;
        return (
            <View>
                <View style={{padding:15}}>
                    <Searchbar
                        placeholder="Chọn hàng kiểm"
                        value={this.state.query}
                        onChangeText = {this.handleInputChange}
                        style={{fontSize:14}}
                        inputStyle={{fontSize:14}}
                    />
                </View>
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
                        <Text style={{marginBottom:10}}>Không tìm thấy sản phẩm !</Text>
                        <Button 
                            title="Đóng" 
                            onPress={this.toggleModal} 
                            titleStyle={{fontSize: 13}}
                            buttonStyle={{backgroundColor:'#dc3545',width:100}}
                        />
                    </View>
                </Modal>
                { product != null
                    &&(
                        <Modal isVisible={this.state.isModalVisibleProduct}>
                            <View style={stocktakesCss.modal_header_top}>
                            <Text style={stocktakesCss.modal_header_top_title}>{product.p_fullname}</Text>
                                <Text style={stocktakesCss.modal_header_top_code}>{product.p_barcode}</Text>
                                {!isEmpty(product.list_batch)
                                    &&(
                                        <View style={{textAlign:'center',justifyContent:'center'}}>
                                            <View style={{textAlign:'center',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                                                <Button 
                                                    title="Chọn lô" 
                                                    onPress={this.toggleModalLo} 
                                                    titleStyle={{fontSize: 13}}
                                                    buttonStyle={{marginTop:10,width:100}}
                                                />
                                            </View>
                                            <Modal isVisible={this.state.isModalVisibleLo}>
                                                {/* {this._stateLo(product)} */}
                                                {this._renderLo(product)}
                                                <View style={{padding:15,backgroundColor:'#fff'}}>
                                                    <View style={Main.row}>
                                                        <View style={Main.col_6}>
                                                            <Button 
                                                                title="Bỏ qua" 
                                                                onPress={this.toggleModalLo} 
                                                                buttonStyle={{backgroundColor:'#dc3545',width:'100%'}}
                                                                titleStyle={{fontSize:13}}
                                                            />
                                                        </View>
                                                        <View style={Main.col_6}>
                                                            <Button 
                                                                title="Lưu" 
                                                                onPress={this.submitForm} 
                                                                buttonStyle={{backgroundColor:'#28af6b',width:'100%'}}
                                                                titleStyle={{fontSize:13}}
                                                            />
                                                        </View>    
                                                    </View>
                                                </View>
                                            </Modal>
                                        </View>
                                        
                                    )
                                }
                            </View>

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
                                            <Text style={{fontSize:15,textAlign:'center'}}>{parseInt(product.p_quantity)}</Text> 
                                        </View>
                                        <View style={{width: 80}} >
                                            {isEmpty(product.list_batch) 
                                                &&(<Text style={{fontSize:15,textAlign:'center'}}>0</Text> 
                                            )}
                                            {!isEmpty(product.list_batch) 
                                                &&(<Text style={{fontSize:15,textAlign:'center'}}>
                                                    {this.quantityProduct(product)}
                                                </Text> 
                                            )}
                                        </View>
                                        <View style={{width: 80}} >
                                            {isEmpty(product.list_batch) 
                                                &&(<Text style={{fontSize:15,textAlign:'center'}}>{0-parseInt(product.p_quantity)}</Text>
                                            )}
                                            {!isEmpty(product.list_batch) 
                                                &&(<Text style={{fontSize:15,textAlign:'center'}}>
                                                    {/* {this.quantityProduct(product)-parseInt(product.p_quantity) } */}
                                                    {parseInt(product.p_quantity)-this.quantityProduct(product) }
                                                </Text> 
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {isEmpty(product.list_batch)
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
                                                    this.onChangeInput('quantity_product', quantity_1 ,product.key, product.p_id, product.p_properties_id)
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
                            {/* <Button  
                                onPress={() => {ActionSheetIOS.showActionSheetWithOptions({options: ['one', 'two', 'three', 'four', 'cancel', 'exit'], 
                                cancelButtonIndex: 4,       
                                destructiveButtonIndex: 5,       
                                title: 'Show case Action sheet',       
                                message: 'This is a simple action sheet sh2ow case'},(args) =>console.log(args)) }}
                             /> */}
                            {/* <Button title="Cộng thêm" onPress={()=>this.addStock(product,'add')} />
                            <Button title="Ghi đè" onPress={()=>this.addStock(product,'override')} /> */}
                            {/* <Button title=" Cập nhật " onPress={()=>this.onAddProduct(product)} /> */}
                            <View style={{padding:15,backgroundColor:'#fff'}}>
                                <View style={Main.row}>
                                    <View style={Main.col_6}>
                                        <Button 
                                            title="Đóng" 
                                            onPress={()=>this.toggleModalProduct_Cancel(product)} 
                                            buttonStyle={{backgroundColor:'#dc3545',width:'100%'}}
                                            titleStyle={{fontSize:13}}
                                        />
                                    </View>
                                    <View style={Main.col_6}>
                                        <Button 
                                            title=" Cập nhật " 
                                            onPress={()=>this.addStock(product)} 
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
export default connect(mapStateToProps)(SearchProduct);
// export default SearchProduct;

SearchProduct.navigationOptions = {
    title: 'Tìm kiếm sản phẩm',
    drawerLabel: () => null,
};
const styles = StyleSheet.create({
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