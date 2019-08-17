import React, {Component} from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet,Text,View,TouchableOpacity ,TextInput,Picker,FlatList,Modal,ActivityIndicator,TouchableHighlight,Alert,AsyncStorage} from 'react-native';
// import { ExpoLinksView } from '@expo/samples';
import { isEmpty, debounce, reduce as _reduce,reduce } from 'lodash';
import { Input, Button } from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons";
import axios from 'axios';
import qs from 'qs';
import moment from 'moment';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
// import flatListStockTakes from '../data/flatListStockProduct';
import { R_PRODUCT_STOCK, R_STOCK_TAKES, R_EDIT_STOCKTAKES } from '../../reducers/actions';
import Modal_Edit_Product from './Modal_Edit_Product';
import Modal_Save from'./Moda_Save';
import { stock_api } from '../../services/api/fetch';
import { showMessage } from "react-native-flash-message";
import { waterfall } from 'async';
import { DataTable } from 'react-native-paper';
import { Main } from '../../styles/main';
import { stocktakesCss } from '../../styles/stock';

class CreateStockTake extends Component {

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
        };
    }

    componentDidMount() {
        const { list_stocktakes, dispatch, list_stocktakes_save } = this.props;
        //// Check tồn tại phiếu tạm
        if (!isEmpty(list_stocktakes_save)) {
            const list_stocktakes_save_clone = Object.assign([], list_stocktakes_save);
            dispatch({ type: R_STOCK_TAKES, payload: list_stocktakes_save_clone });
            this.setState({ visibleModal: false, visible: true });
        } else {
            dispatch({ type: R_STOCK_TAKES, payload: [] });
        }

        if (!isEmpty(list_stocktakes)) {
            const match = [];
            const notmatch = [];
            const notcheck = [];
            reduce(list_stocktakes, (result, user) => {
                if (parseFloat(user.quantity) > parseFloat(user.quantity_before) || parseFloat(user.quantity) < parseFloat(user.quantity_before)) {
                    notmatch.push(user);
                }
                if (parseFloat(user.quantity) === parseFloat(user.quantity_before)) {
                    match.push(user);
                }
                if (user.quantity === '') {
                    notcheck.push(user);
                }
            }, {});
            const reduce_sub = {
                match,
                notmatch,
                notcheck,
            };
            this.setState({
                number_total: list_stocktakes ?list_stocktakes.length :0,
                number_notmatch: reduce.notmatch?reduce.notmatch.length:0,
                number_match: reduce.match?reduce.match.length:0,
                number_notcheck: reduce.notcheck?reduce.notcheck.length:0,
            });
        }
    }

    

    componentWillReceiveProps(nextProps) {
        const { listProduct, activeTab ,listProduct_match,listProduct_notmatch,listProduct_notcheck} = this.state;
        const match = [];
        const notmatch = [];
        const notcheck = [];
        const reduce = _reduce(nextProps.list_stocktakes, (result, user) => {
            if (parseFloat(user.quantity) > parseFloat(user.quantity_before) || parseFloat(user.quantity) < parseFloat(user.quantity_before)) {
                notmatch.push(user);
            }
            if (parseFloat(user.quantity) === parseFloat(user.quantity_before)) {
                match.push(user);
            }
            if (user.quantity === '') {
                notcheck.push(user);
            }
            return { notmatch, match, notcheck };
        }, {});
        this.setState({
            number_total: nextProps.list_stocktakes ?nextProps.list_stocktakes.length :0,
            number_notmatch: reduce.notmatch?reduce.notmatch.length:0,
            number_match: reduce.match?reduce.match.length:0,
            number_notcheck: reduce.notcheck?reduce.notcheck.length:0,
        });
        this.setState({ listProduct: nextProps.list_stocktakes,listProduct_match:reduce.match, listProduct_notmatch:reduce.notmatch,listProduct_notcheck:reduce.notcheck});
    }


    onVisible = (v) => {
        this.onVisibleLocal(v);
    }

    onVisibleLocal(v) {
        const { visible_edit } = this.state;
        this.setState({ visible_edit: !visible_edit, current_id: visible_edit === true ? 0 : v.barcode,edit_product:v });
    }


    _renderItem = (list_stocktakes) => {
        if(!isEmpty(list_stocktakes)){
            const htm = list_stocktakes.map((v, k) => {
                return (
                    // <TouchableOpacity
                    //     onPress={()=>{
                    //         this.onVisible(v)
                    //     }}
                    // >
                    //     <View>
                    //         <View style={stocktakesCss.stocktakesCss_list_box}>
                    //             <View style={{height: 40, backgroundColor: 'white'}} >
                    //                 <View style={{flex: 1, flexDirection: 'row',marginLeft:20}}>
                    //                     <View style={{width: 100}} >
                    //                         <Text style={{fontSize:15}}>{v.name}</Text> 
                    //                     </View>
                    //                     <View style={{width: 80}} >
                    //                         <Text style={{fontSize:15}}>{v.quantity_before}</Text> 
                    //                     </View>
                    //                     <View style={{width: 80,fontSize:20}} >
                    //                         <Text style={{fontSize:15}}>{v.quantity}</Text>
                    //                     </View>
                    //                     <View style={{width: 80,fontSize:20}} >
                    //                         <Text style={{fontSize:15}}>{v.quantity_before-v.quantity}</Text>
                    //                     </View>
                    //                 </View>
                    //             </View>
                    //         </View>
                    //         <View style={{
                    //             height:1,
                    //             backgroundColor: '#ddd'
                    //         }}>
                    //         </View>
                    //     </View>
                    // </TouchableOpacity> 
                    <DataTable.Row 
                        onPress={()=>{
                                 this.onVisible(v)
                             }}
                    >
                        <DataTable.Cell>{v.barcode}</DataTable.Cell>
                        <DataTable.Cell numeric>{v.name}</DataTable.Cell>
                        <DataTable.Cell numeric>{parseInt(v.quantity_before)}</DataTable.Cell>
                        <DataTable.Cell numeric>{parseInt(v.quantity)}</DataTable.Cell>
                        <DataTable.Cell numeric>{v.quantity_before-v.quantity}</DataTable.Cell>
                    </DataTable.Row>
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
        this.props.navigation.navigate("SearchProduct");
    }

    modalVisibleCategory() {
        this.props.navigation.navigate("Modal_Category");
    }

    submitWarehousing(status) {
        const { form, id } = this.state;
        const { list_stocktakes, depot_current,navigation } = this.props;
        const info_person = navigation.getParam('info_person','info');
        const invoice_stock = navigation.getParam('invoice_stock','invoice');
        const self = this;
        this.setState({animating:true});
        waterfall([
            (callback) => {
                if (isEmpty(list_stocktakes)) {
                    showMessage({
                       message: "Bạn phải lựa chọn sản phẩm",
                       description: "",
                        type: "error",
                    });
                    this.setState({animating:false});
                } else {
                    callback(null, 'next');
                }
            },
        ], () => {
            const params = {
                invoice: (!isEmpty(invoice_stock))?invoice_stock:form.invoice,
                products: list_stocktakes,
                mtype: 'inventory',
                depot_id: 1,
                user_id: (info_person !=='' && info_person !=='info')?info_person:form.user_id,
                note_order: form.note_order,
                status,
            };
            if (form.user_id!=='') {
                params.user_id = form.user_id_select.value;
            }
            if (params.status === 1) {
                params.create_time = form.create_time.value;
            }
            self.apiTransfer(params);
            
        });
        // const params = {
        //     invoice: (!isEmpty(invoice_stock))?invoice_stock:form.invoice,
        //     products: list_stocktakes,
        //     mtype: 'inventory',
        //     depot_id: 1,
        //     user_id: (info_person !=='' && info_person !=='info')?info_person:form.user_id,
        //     note_order: form.note_order,
        //     status,
        // };
        // if (form.user_id!=='') {
        //     params.user_id = form.user_id_select.value;
        // }
        // if (params.status === 1) {
        //     params.create_time = form.create_time.value;
        // }
        // // if (!isEmpty(location.search)) {
        // //     params.mtype = 'inventoryUpdate';
        // //     params.id = id;
        // //     params.status = status;
        // //     params.create_time = form.create_time.value;
        // // }
        // self.apiTransfer(params);
    }

    apiTransfer = async (params) => {
        const { dispatch, history } = this.props;
        // try {
        //     const res = await axios('https://wdevapi.bpos.vn/api/pos/stock', {
        //         method: 'post',
        //         headers: {
        //             authcode: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1NjE5NjQxMjQsImV4cCI6MTU5MzU4NjUyNCwidWlkIjoxLCJhdXRoX2NvZGUiOiJmZjNjMWUxODBiNTIzNjQxZGQxODIyYWY1YmYwZjk4MyIsIm5vZGVfaWQiOjMwMSwiY2xhaW1zIjp7Im5vZGVfaWQiOiIzMDEifX0.X0HrLbSaWKa5BZGyyTJVreDf2wr12AHQYGJic0jIdJECS7Egm0-a6Nd07koiMNrAXR4NvAJEUn4DLYo2c0aNiLCsKfIZyBHsVmOMylogJoYZUeqhXh8nTgWrpsKkK_R_nJY7_IOr1dtNSZ-wEWGtUaIfBBgYMfsxtRqhA6OmFEO-iSmAscPx9t8jUWQcvmo9uw-wjvV-nGke8bIUZB7yT4W8IsOENrRIOAtXBegu8I4V72cl2TcSqhraOT2D97L2EilSj5TeuXat9QZjr3NQfbHLESVFmqFaNn_Zl7NWzXKQv9MCLFh9WcRyQM41_ajtAA8DKo5GUo_aNMHGR-MR1Q',
        //         },
        //         data: qs.stringify(params),
        //     });
        //     const list_stocktakes_clone = [];
        //     dispatch({ type: R_EDIT_STOCKTAKES, payload: list_stocktakes_clone });
        //     dispatch({ type: R_STOCK_TAKES, payload: list_stocktakes_clone });
        //     this.onShowType();
          
        // } catch (error) {
           
        // }
        stock_api(params).then((data) => {
            this.setState({animating:false});
            const list_stocktakes_clone = [];
            dispatch({ type: R_EDIT_STOCKTAKES, payload: list_stocktakes_clone });
            dispatch({ type: R_STOCK_TAKES, payload: list_stocktakes_clone });
            this.onShowType();
            
        })
        
    }

    static navigationOptions = ({ navigation }) => {
        return {
        //   headerTitle: "Title",
        headerRight: (
           <Icon 
            name='ios-information-circle' 
            size={25}
            color="#ddd"
            style={{paddingHorizontal:15}}
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

    render() {
        const { navigation,product_stock,list_stocktakes } = this.props;
        const { animating,listProduct_match,listProduct_notmatch,listProduct_notcheck,number_match,number_total,number_notmatch,number_notcheck,current_id,visible_edit,visible } = this.state;
        const barcodeProduct = navigation.getParam('barcodeProduct','hihi');
        //const listProduct = navigation.getParam('listProduct','product');
        if(animating){
            return  <ActivityIndicator
                    size="large" color="#0000ff"
                    />
        }
        return (
            <View style={stocktakesCss.createStockTake_box}>
                <View style={stocktakesCss.createStockTake_top}>
                    <View style={[Main.select_box_main, stocktakesCss.createStockTake_main]}>
                        <View 
                            style={Main.select_box_item}
                            onPress={() => {
                                this.modalVisibleProduct();
                            }}
                        >
                            <Icon
                                name="ios-search"
                                size={20}
                                color="#545454"
                                onPress={() => {
                                    this.modalVisibleProduct();
                                }}
                            />
                            <Text style={{marginLeft:10,color:'#545454',fontSize:13}}>Chọn hàng kiểm</Text>
                        </View>
                        <View style={Main.select_box_item}>
                            <TouchableOpacity>
                                <Icon
                                    name="ios-list"
                                    size={20}
                                    color="#545454"
                                    onPress={() => {
                                        this.modalVisibleCategory();
                                    }}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft:15}}>
                                <Icon
                                    name="ios-barcode"
                                    size={20}
                                    color="red"
                                    onPress={this.onShowBarcode}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <ScrollableTabView
                    initialPage={0}
                    // renderTabBar={() => <DefaultTabBar />}
                    tabBarUnderlineStyle={{ backgroundColor: '#28af6b', height: 3 }}
                    tabBarActiveTextColor={{ color: 'red', backgroundColor: '#28af6b' }}
                    tabBarInactiveTextColor={{ color: 'red', backgroundColor: '#28af6b' }}
                    tabBarBackgroundColor={{ color: 'red', backgroundColor: '#28af6b' }}
                    tabBarTextStyle={{ color: '#000' }}
                >
                    <ScrollView tabLabel={`Tất cả (${number_total})`}  >
                    {!isEmpty(list_stocktakes)
                        &&(
                            <DataTable style={{marginTop:0}}>
                                <DataTable.Header style={{backgroundColor:'#28af6b'}}>
                                <DataTable.Title style={Main.dataTable_title}><Text style={Main.dataTable_title}>Hàng kiểm</Text></DataTable.Title>
                                <DataTable.Title style={Main.dataTable_title}><Text style={Main.dataTable_title}>Tên sản phẩm</Text></DataTable.Title>
                                <DataTable.Title numeric style={Main.dataTable_title}><Text style={Main.dataTable_title}>Tồn kho</Text></DataTable.Title>
                                <DataTable.Title numeric style={Main.dataTable_title}><Text style={Main.dataTable_title}>Thực tế</Text></DataTable.Title>
                                <DataTable.Title numeric style={Main.dataTable_title}><Text style={Main.dataTable_title}>Lệch</Text></DataTable.Title>
                                </DataTable.Header>
                                {this._renderItem(list_stocktakes)}
                            </DataTable>
                    )}
                        {/* {this._renderItem(list_stocktakes)} */}
                    </ScrollView>
                    <ScrollView tabLabel={`Khớp (${number_match})`} >
                        {!isEmpty(listProduct_match)
                            &&(
                                <DataTable style={{marginTop:0}}>
                                    <DataTable.Header style={{backgroundColor:'#28af6b'}}>
                                    <DataTable.Title style={Main.dataTable_title}><Text style={Main.dataTable_title}>Hàng kiểm</Text></DataTable.Title>
                                    <DataTable.Title style={Main.dataTable_title}><Text style={Main.dataTable_title}>Tên sản phẩm</Text></DataTable.Title>
                                    <DataTable.Title numeric style={Main.dataTable_title}><Text style={Main.dataTable_title}>Tồn kho</Text></DataTable.Title>
                                    <DataTable.Title numeric style={Main.dataTable_title}><Text style={Main.dataTable_title}>Thực tế</Text></DataTable.Title>
                                    <DataTable.Title numeric style={Main.dataTable_title}><Text style={Main.dataTable_title}>Lệch</Text></DataTable.Title>
                                    </DataTable.Header>
                                    {this._renderItem(listProduct_match)}
                                </DataTable>
                            
                        )}
                        {/* {this._renderItem(listProduct_match)} */}
                    </ScrollView>
                    <ScrollView tabLabel={`Lệch (${number_notmatch})`}>
                        {!isEmpty(listProduct_notmatch)
                                &&(
                                    <DataTable style={{marginTop:0}}>
                                        <DataTable.Header style={{backgroundColor:'#28af6b'}}>
                                        <DataTable.Title style={Main.dataTable_title}><Text style={Main.dataTable_title}>Hàng kiểm</Text></DataTable.Title>
                                        <DataTable.Title style={Main.dataTable_title}><Text style={Main.dataTable_title}>Tên sản phẩm</Text></DataTable.Title>
                                        <DataTable.Title numeric style={Main.dataTable_title}><Text style={Main.dataTable_title}>Tồn kho</Text></DataTable.Title>
                                        <DataTable.Title numeric style={Main.dataTable_title}><Text style={Main.dataTable_title}>Thực tế</Text></DataTable.Title>
                                        <DataTable.Title numeric style={Main.dataTable_title}><Text style={Main.dataTable_title}>Lệch</Text></DataTable.Title>
                                        </DataTable.Header>
                                        {this._renderItem(listProduct_notmatch)}
                                    </DataTable>
                                
                            )}
                            {/* {this._renderItem(listProduct_notmatch)} */}
                    </ScrollView>
                    <ScrollView tabLabel={`Chưa kiểm (${number_notcheck})`}>
                        {!isEmpty(listProduct_notcheck)
                                    &&(
                                        <DataTable style={{marginTop:0}}>
                                            <DataTable.Header style={{backgroundColor:'#28af6b'}}>
                                            <DataTable.Title style={Main.dataTable_title}><Text style={Main.dataTable_title}>Hàng kiểm</Text></DataTable.Title>
                                            <DataTable.Title style={Main.dataTable_title}><Text style={Main.dataTable_title}>Tên sản phẩm</Text></DataTable.Title>
                                            <DataTable.Title numeric style={Main.dataTable_title}><Text style={Main.dataTable_title}>Tồn kho</Text></DataTable.Title>
                                            <DataTable.Title numeric style={Main.dataTable_title}><Text style={Main.dataTable_title}>Thực tế</Text></DataTable.Title>
                                            <DataTable.Title numeric style={Main.dataTable_title}><Text style={Main.dataTable_title}>Lệch</Text></DataTable.Title>
                                            </DataTable.Header>
                                            {this._renderItem(listProduct_notcheck)}
                                        </DataTable>  
                                )}
                            {/* {this._renderItem(listProduct_notcheck)} */}
                    </ScrollView>
                </ScrollableTabView>
                <View style={Main.btn_fixed}>
                    <View style={Main.btn_fixed_box}>
                        {/* <Button
                            title="Lưu tạm"
                            // onPress={this.onShowType}
                            onPress={() => this.submitWarehousing(0)}
                            buttonStyle={Main.btn_submit_button}
                            containerStyle={Main.btn_submit_button_box}
                            titleStyle={Main.btn_submit_button_title}
                        /> */}
                    </View>
                    <View style={Main.btn_fixed_box}>
                        <Button
                            title="Hoàn thành"
                            // onPress={this.onShowType}
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
                <Modal_Edit_Product  visible_edit={visible_edit} onVisible={this.onVisible} current_id={current_id} edit_product ={this.state.edit_product}/>
                <Modal_Save {...this.props} visible={visible} onVisible1={this.onVisible1} onVisibleModal1={this.onVisibleModal1} />
            </View>
        );
    }
}

// export default CreateStockTake;
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
export default connect(mapStateToProps)(CreateStockTake);
CreateStockTake.navigationOptions = {
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
