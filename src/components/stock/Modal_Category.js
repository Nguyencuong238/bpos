import React, {Component} from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet,Text,View,TouchableOpacity ,TextInput,Picker,FlatList,TouchableHighlight,Alert,ActivityIndicator} from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons";
import axios from 'axios';
import qs from 'qs';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view'
import Modal from "react-native-modal";
import moment from 'moment';
import { R_PRODUCT_STOCK, R_STOCK_TAKES, R_EDIT_STOCKTAKES } from '../../reducers/actions';
import { isEmpty, findKey, includes, isArray, forEach, sumBy, filter,remove,  reduce as _reduce, chunk ,isNumber,replace} from 'lodash';
import { product_api,productCategory_api } from '../../services/api/fetch';
import { CheckBox } from 'react-native-elements'
import { waterfall } from 'async';
import { showMessage } from "react-native-flash-message";
import { stocktakesCss } from '../../styles/stock';
import { Main } from '../../styles/main';
import { goodsCss } from '../../styles/goods';

class Modal_Category extends Component{
    constructor(props) {
        super(props);
        this.state = {
            listCategory: null,
            forms: {
                category: { value: '', validate: true, msg: null },
            },
            animating: true,
        };
    }

    componentDidMount(){
        productCategory_api({ mtype: 'getAll' }).then(({ category }) => {
            if(!isEmpty(category)){
                const options = [];
                category.forEach((v) => {
                    let object1 = {check_category:false};
                    v1 = {...object1, ...v }
                    options.push(v1);
                });
                this.setState({ listCategory: options, loading: false ,animating:false});
            }
            
        });
        const { navigation } = this.props;
        navigation.setParams({
            dispatch: this.submitForm.bind(this)
        });
    }

    // static navigationOptions = {
    //     headerRight: (
    //        <Button
    //             titleStyle={{fontSize: 15,color:'#fff'}}
    //             buttonStyle={{backgroundColor:'none'}}
    //             title="Cập nhật"
    //             // onPress={this.onShowType}
    //             onPress={() => this.submitForm()}
    //         />
    //     ),
    // };

    visible_check = (data) => {
        const { listCategory ,forms} = this.state;
        listCategory.forEach((v) => {
            if(v.id === data.id){
                v.check_category = ! v.check_category
                if(v.check_category){
                    forms.category.value = v.id
                }else{
                    forms.category.value ='';
                }
               
            }else{
                v.check_category = false;
            }
        });

        this.setState({ listCategory,forms });
    }


    renderCheck = (listCategory) =>{
        const htm = listCategory.map((v, k) => {
            const idx = k + 1;
            return (
                <CheckBox
                    title={`${replace(v.line, /-/g, '─')} ${v.name}`}
                    checked={v.check_category}
                    value= {v.id}
                    onPress={()=>{
                        this.visible_check(v)
                    }}
                    style={{margin:0,marginBottom:10,}}
                />
            );
        });
        return htm;
    }

    submitForm() {
        const { forms } = this.state;
        waterfall([
            (callback) => {
                if (forms.category.value !== 0 && forms.category.value !== '') {
                    forms.category.validate = true;
                    if (forms.category.validate) callback(null, 'next');
                } else {
                    showMessage({
                        message: "Bạn phải lựa chọn danh mục sản phẩm",
                        description: "",
                        type: "error",
                     });
                }
            },
        ], () => {
            const params = {
                category_id: forms.category.value,
                mtype: 'sync_sale',
                depot_id: 1,
                limit: 1000,
            };
            this.getProduct(params);
        });
    }

    getProduct(params) {
        const { list_stocktakes, dispatch } = this.props;
        this.setState({ loading: true });
        product_api(params).then(({ products }) => {
            if (isEmpty(products)) {
                this.setState({ loading: false });
                this.resetForm(false);
            } else {
                const arr = [];
                const bar = new Promise((resolve) => {
                    const lastKey = Object.keys(list_stocktakes)[Object.keys(list_stocktakes).length - 1];
                    products.forEach((value, index, array) => {
                        const tmp_tag = {
                            product_id: value.p_id,
                            name: value.p_fullname,
                            price: parseFloat(value.p_price, 10),
                            price_market: parseFloat(value.p_price, 10),
                            properties_id: value.p_properties_id,
                            barcode: value.p_barcode,
                            barcode_id: value.p_barcode_id,
                            quantity_before: value.p_quantity,
                            quantity: '',
                            sku: value.p_sku,
                            is_batch: value.p_is_batch,
                            list_batch: value.list_batch,
                            batch_id: 0,
                        };
                        if (!isEmpty(lastKey)) {
                            tmp_tag.key = parseInt(lastKey) + index + 1;
                        } else {
                            tmp_tag.key = index;
                        }
                        arr.push(tmp_tag);
                        if (index === array.length - 1) resolve();
                    });
                });
                bar.then(() => {
                    const list_stocktakes_clone = Object.assign([], list_stocktakes);
                    /// Kiểm tra SP trùng
                    const res = list_stocktakes_clone.filter((o) => arr.some((o2) => o.barcode_id === o2.barcode_id));

                    if (!isEmpty(res)) {
                        //// Nếu trùng thì xoá r mới push
                        forEach(res, (value) => {
                            remove(arr, (v) => parseFloat(v.barcode_id, 10) === parseFloat(value.barcode_id, 10));
                        });
                        forEach(arr, (value) => {
                            list_stocktakes_clone.push(value);
                        });
                        dispatch({ type: R_STOCK_TAKES, payload: list_stocktakes_clone });
                        this.setState({ loading: false });
                        this.resetForm(false);
                    } else {
                        forEach(arr, (value) => {
                            list_stocktakes_clone.push(value);
                        });
                        dispatch({ type: R_STOCK_TAKES, payload: list_stocktakes_clone });
                        // if (isEmpty(location.search)) {
                        //     dispatch({ type: R_EDIT_STOCKTAKES, payload: list_stocktakes_clone });
                        // }
                        dispatch({ type: R_EDIT_STOCKTAKES, payload: list_stocktakes_clone });
                        this.setState({ loading: false });
                        this.resetForm(false);
                    }

                    this.props.navigation.navigate("CreateStockTake");
                });
            }
        });
    }

    resetForm(refresh = false) {
        const { forms } = this.state;
        // const { onVisible, resfreshList } = this.props;
        forms.category.value = '';
        this.setState({ forms }, () => {
            // if (onVisible) onVisible(0);
            // if (refresh && resfreshList) resfreshList();
        });
    }

    render() {
        const {listCategory,animating} = this.state;
        if(animating){
            return  <ActivityIndicator
                        size="large" color="#0000ff"
                     />
        }
        return (
            <View>

                {!isEmpty(listCategory)
                    &&(
                        <View style={{marginTop:10}}>
                            {this.renderCheck(listCategory)}
                         </View>
                         
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
});
export default connect(mapStateToProps)(Modal_Category);
Modal_Category.navigationOptions = {
    title: 'Chọn danh mục sản phẩm',
    drawerLabel: () => null,
};

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