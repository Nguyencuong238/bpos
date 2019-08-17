import React, {Component} from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet,Text,View,TouchableOpacity ,TextInput,Picker,FlatList,Modal,ActivityIndicator,TouchableHighlight,Alert,AsyncStorage} from 'react-native';
import { isEmpty, debounce, reduce as _reduce,reduce,sumBy,isNumber } from 'lodash';
import { Input, Button } from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons";
import moment from 'moment';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { R_PRODUCT_STOCK, R_STOCK_TAKES, R_EDIT_STOCKTAKES ,R_WAREHOUSING,R_EDIT_WAREHOUSING} from '../../reducers/actions';
import Modal_Edit_Product from './Modal_Edit_Product';
import Modal_Save from'./Modal_Save';
import { stock_api,purchase_order_api } from '../../services/api/fetch';
import { showMessage } from "react-native-flash-message";
import { waterfall } from 'async';
class CreateWarehouse extends Component {

    constructor(props) {
        super(props);
        this.state = {
            persistStock:null,
            language: 'NV1',
            product:[],
            id: 0,
            form: {
                depot_id_select: '',
                user_id: '',
                depot_id: 0,
                user_id_select: '',
                note_order: '',
                status: '',
                invoice: '',
                create_time: { value: moment().format('YYYY-MM-DD H:mm') },
            },
            listProduct:null,
            listProduct_match:null,
            listProduct_notmatch:null,
            listProduct_notcheck:null,
            number_total: 0,
            number_match: 0,
            number_notmatch: 0,
            number_notcheck: 0,
            edit_product:null,
            visible_edit: false,
            current_id: 0,
            animating:false,
            visible: false,
            visibleModal: true,
            price_sell: 0,
            price_pay: 0,
            total_product: 0,
            invoice_id_get:null,
        };
    }

    componentDidMount() {
        const { dispatch, list_warehousing_save } = this.props;
        //// Check tồn tại phiếu tạm
        if (!isEmpty(list_warehousing_save)) {
            const list_warehousing_save_clone = Object.assign([], list_warehousing_save);
            dispatch({ type: R_WAREHOUSING, payload: list_warehousing_save_clone });
            this.setState({ visibleModal: false, visible: true });

            const price = sumBy(list_warehousing_save_clone, (o) => parseFloat((parseFloat(o.price, 10) * parseFloat(o.quantity, 10))));
            const totalproduct = sumBy(list_warehousing_save_clone, (o) => parseFloat(o.quantity, 10));
            this.setState({ price_sell: price, total_product: totalproduct, price_pay: price });
        } else {
            dispatch({ type: R_WAREHOUSING, payload: [] });
        }
        this.setState({ loading: false });
        const { navigation } = this.props;
        const invoice_id = navigation.getParam('invoice_id');
        if(isNumber(invoice_id)){
            const params = {
                id: parseFloat(invoice_id),
                mtype: 'getPurchaseOrder',
            };
            purchase_order_api(params).then(({ order_info }) => {
                order_info.products.forEach((v, k) => {
                    if (v.batch_id > 0) {
                        order_info.products[k].is_batch = v.batch_id;
                    }
                    let batch_name = '';
                    if (!isEmpty(v.batch_info)) {
                        batch_name = `${v.batch_info.name} - ${moment(v.batch_info.expired_date).format('YYYY-MM-DD')}`;
                    }
                    order_info.products[k].batch_name = batch_name;
                });
                dispatch({ type: R_WAREHOUSING, payload: order_info.products });
            });
            this.setState({invoice_id_get:invoice_id});
        }
    }

    componentWillReceiveProps(nextProps) {

        // const { navigation,dispatch } = this.props;
        // const invoice_id = navigation.getParam('invoice_id');
        if (nextProps.list_warehousing) {
            const price = sumBy(nextProps.list_warehousing, (o) => parseFloat((parseFloat(o.price, 10) * parseFloat(o.quantity, 10))));
            const totalproduct = sumBy(nextProps.list_warehousing, (o) => parseFloat(o.quantity, 10));
            this.setState({ price_sell: price, total_product: totalproduct, price_pay: price });
        }

        // if(isNumber(invoice_id)){
        //     const params = {
        //         id: parseFloat(invoice_id),
        //         mtype: 'getPurchaseOrder',
        //     };
        //     purchase_order_api(params).then(({ order_info }) => {
        //         order_info.products.forEach((v, k) => {
        //             if (v.batch_id > 0) {
        //                 order_info.products[k].is_batch = v.batch_id;
        //             }
        //             let batch_name = '';
        //             if (!isEmpty(v.batch_info)) {
        //                 batch_name = `${v.batch_info.name} - ${moment(v.batch_info.expired_date).format('YYYY-MM-DD')}`;
        //             }
        //             order_info.products[k].batch_name = batch_name;
        //         });
        //         dispatch({ type: R_WAREHOUSING, payload: order_info.products });
        //     });
        //     this.setState({invoice_id_get:invoice_id});
        // }
    }


    onVisible = (v) => {
        
        this.onVisibleLocal(v);
    }

    onVisibleLocal(v) {
        const { visible_edit } = this.state;
        this.setState({ visible_edit: !visible_edit, current_id: visible_edit === true ? 0 : v.barcode,edit_product:v });
    }


    _renderItem = (list_warehousing) => {
        if(!isEmpty(list_warehousing)){
            const htm = list_warehousing.map((v, k) => {
                return (
                    <TouchableOpacity
                        onPress={()=>{
                            this.onVisible(v)
                        }}
                    >
                        <View>
                            <View style={stocktakesCss.stocktakesCss_list_box}>
                                <View style={{height: 40, backgroundColor: 'white'}} >
                                    <View style={{flex: 1, flexDirection: 'row',marginLeft:5}}>
                                        <View style={{width: 100}} >
                                            <Text style={{fontSize:15}}> {v.name}</Text> 
                                        </View>
                                        <View style={{width: 60}} >
                                            <Text style={{fontSize:15}}>{parseFloat(v.quantity)}</Text> 
                                        </View>
                                        <View style={{width: 80,fontSize:20}} >
                                            <Text style={{fontSize:15}}> {(parseFloat(v.price)).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</Text>
                                        </View>
                                        <View style={{width: 80,fontSize:20}} >
                                            <Text style={{fontSize:15}}>{(parseFloat(v.quantity)*parseFloat(v.price)).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</Text>
                                        </View>
                                        <View style={{width: 40,fontSize:20}} >
                                            <Icon
                                                name="ios-brush"
                                                size={20}
                                                onPress={() => {
                                                    this.onVisible(v);
                                                }}
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
                        </View>
                    </TouchableOpacity> 
                );
            });
            return htm;
        }
        
    };

    onShowType = () => {
        this.props.navigation.navigate("StockScreen",{
            loadStock: 'loadingrepat',
        });
    }

    onShowBarcode = () => {
        this.props.navigation.navigate("ScannerBarcode");
    }

    modalVisibleProduct() {
        this.props.navigation.navigate("SearchProductWarehouse");
    }

    modalVisibleCategory() {
        this.props.navigation.navigate("Modal_Category");
    }



    static navigationOptions = ({ navigation }) => {
        return {
        //   headerTitle: "Title",
        headerRight: (
           <Icon 
            name='ios-information-circle' 
            size={30}
            color="#ddd"
            onPress={() => navigation.navigate('Info_Personel')}
           />
          ),
        };
    }

    onVisible1 = () => {
        this.onVisibleLocal1();
    }

    onVisibleLocal1() {
        const { visible } = this.state;
        this.setState({ visible: !visible });
    }

    onVisibleModal1 = () => {
        const { visibleModal } = this.state;
        this.setState({ visibleModal: !visibleModal });
    }

    listWarehouse = () => {
        this.props.navigation.navigate("ListWarehouse");
    }

    info_warehouse = () =>{
        const {invoice_id_get} = this.state;
        const manufacturer_id_get = this.props.navigation.getParam('itemId');
        const info_person_get = this.props.navigation.getParam('info_person');
        const {price_sell} = this.state;
        this.props.navigation.navigate("Info_Warehousing",{
                total_price: price_sell,
                manufacturer_id:manufacturer_id_get,
                info_person:info_person_get,
                invoice_id:invoice_id_get
        });
    }

    render() {
        const { navigation,product_stock,list_stocktakes,list_warehousing } = this.props;
        const { total_product,price_sell,price_pay, animating,listProduct_match,listProduct_notmatch,listProduct_notcheck,number_match,number_total,number_notmatch,number_notcheck,current_id,visible_edit,visible } = this.state;
        const barcodeProduct = navigation.getParam('barcodeProduct','hihi');
        if(animating){
            return  <ActivityIndicator
                    size="large" color="#0000ff"
                    />
        }
        return (
            <View style={stocktakesCss.createStockTake_box}>
                <View style={stocktakesCss.createStockTake_top}>
                    <View style={[Main.select_box_main, stocktakesCss.createStockTake_main]}>
                        <Icon
                            name="ios-search"
                            size={30}
                            color="#ddd"
                            onPress={() => {
                                this.modalVisibleProduct();
                            }}
                        />
                        {/* <TouchableOpacity style={Main.select_box_item_action_icon} >
                            <Icon
                                name="ios-add"
                                size={30}
                                color="#545454"
                                style={{ paddingHorizontal:15,marginLeft:  40 }}
                                onPress={() => {
                                    this.modalVisibleCategory();
                                }}
                            />
                        </TouchableOpacity> */}
                        <TouchableOpacity style={Main.select_box_item_action_icon} >
                            <Icon
                                name="ios-barcode"
                                size={30}
                                color="red"
                                onPress={this.onShowBarcode}
                            />
                        </TouchableOpacity>
                    
                    </View>
                </View>

                <View style={stocktakesCss.createStockTake_top}>
                    <View style={[Main.select_box_main, stocktakesCss.createStockTake_main]}>
                        <Icon
                            name="ios-person"
                            size={30}
                            color="#ddd"
                            onPress={() => {
                                this.listWarehouse();
                            }}
                        />
                        <Text  
                            onPress={() => {
                                this.listWarehouse();
                            }}
                        >
                            Chọn nhà cung cấp
                        </Text>
                        <Icon
                            name="ios-arrow-forward"
                            size={30}
                            color="#ddd"
                            onPress={() => {
                                this.listWarehouse();
                            }}
                        />
                    </View>
                </View>
                <ScrollView>
                    {!isEmpty(list_warehousing)
                        &&(
                        <View style={stocktakesCss.stocktakesCss_list_box}>
                            <View style={{height: 40, backgroundColor: 'white'}} >
                                <View style={{flex: 1, flexDirection: 'row',marginLeft:5}}>
                                    <View style={{width: 100}} >
                                        <Text style={{fontSize:15}}>Tên sản phẩm</Text> 
                                    </View>
                                    <View style={{width: 60}} >
                                        <Text style={{fontSize:15}}>Số lượng</Text> 
                                    </View>
                                    <View style={{width: 80,fontSize:20}} >
                                        <Text style={{fontSize:15}}>Giá </Text>
                                    </View>
                                    <View style={{width: 80,fontSize:20}} >
                                        <Text style={{fontSize:15}}>Tổng hàng</Text>
                                    </View>
                                    <View style={{width: 40,fontSize:20}} >
                                        <Text style={{fontSize:15}}>TT</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                    
                    {this._renderItem(list_warehousing)}
                </ScrollView>
                <View  style={Main.btn_fixed} >
                    <View style={Main.btn_fixed_box}>
                        <Text
                            onPress={()=>{
                                this.props.navigation.navigate("Info_Warehousing");
                            }}
                        > Tổng sản phẩm :{total_product} </Text>
                    </View>
                    <View style={Main.btn_fixed_box}>

                    </View>
                    <View style={Main.btn_fixed_box}>
                        <Text
                            onPress={()=>this.info_warehouse()}
                        > 
                            Số tiền : {price_sell.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}
                            {/* <Icon
                                name="ios-arrow-forward"
                                size={30}
                                color="#1cb467"
                                onPress={() => {
                                    this.listWarehouse();
                                }}
                            /> */}
                        </Text>
                        
                    </View>
                    <View style={Main.btn_fixed_box}>
                        <Icon
                            name="ios-arrow-forward"
                            size={30}
                            color="#1cb467"
                            onPress={() => {
                                this.info_warehouse();
                            }}
                        />
                    </View>
                </View> 
                <Modal_Edit_Product  visible_edit={visible_edit} onVisible={this.onVisible} current_id={current_id} edit_product ={this.state.edit_product}/>
                <Modal_Save {...this.props} visible={visible} onVisible1={this.onVisible1} onVisibleModal1={this.onVisibleModal1} />
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
export default connect(mapStateToProps)(CreateWarehouse);
CreateWarehouse.navigationOptions = {
  title: 'Thêm phiếu kiểm kho',
  drawerLabel: () => null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
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
        paddingBottom: 150,
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
