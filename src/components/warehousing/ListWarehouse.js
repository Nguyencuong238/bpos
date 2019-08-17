import React, {Component} from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet,Text,View,TouchableOpacity ,RefreshControl,TextInput,Picker,FlatList,TouchableHighlight,Alert} from 'react-native';
import { Input, Button } from 'react-native-elements';
import axios from 'axios';
import qs from 'qs';
import Modal from "react-native-modal";
import { R_PRODUCT_STOCK, R_STOCK_TAKES, R_EDIT_STOCKTAKES } from '../../reducers/actions';
import moment from 'moment';
import { supplier_api } from '../../services/api/fetch';
import { isEmpty, findKey, includes, isArray, forEach, sumBy, filter,remove,  reduce as _reduce, chunk ,isNumber} from 'lodash';
class ListWarehouse extends Component{
    constructor(props) {
        super(props);
        this.state = {
            listSupplier: null,
        };
    }

    componentDidMount(){
        this.listSupplier();
    }

    listSupplier() {
        supplier_api({ mtype: 'getall', status: 1 }).then(({ listSupplier }) => {
            this.setState({ listSupplier });
        });
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

    _renderItem = (item,index) => {
        return (
            <TouchableOpacity 
                onPress={() => this.props.navigation.navigate('CreateWarehouse',{
                    itemId:item.id
                }) }
            >
                <View>
                    <View style={stocktakesCss.stocktakesCss_list_box}>
                        <View style={stocktakesCss.stocktakesCss_list_left}>
                            <Text style={stocktakesCss.stocktakesCss_list_code}>{item.name}</Text>
                            
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

    render() {
        const {listSupplier} = this.state;
        return (
               <View>
                   { !isEmpty(listSupplier)
                    &&( 
                        <View style={stocktakesCss.stocktakesCss_list} onPress={() => this.props.navigation.navigate('StockDetail')} >
                            <FlatList
                                data={listSupplier}
                                refreshControl={
                                    <RefreshControl
                                      refreshing={this.state.refreshing}
                                      onRefresh={this._onRefresh}
                                    />
                                }
                                renderItem={({item, index})=>{
                                    return( this._renderItem(item, index));
                                }}
                                keyExtractor={(item, index) => index.toString()}
                                ItemSeparatorComponent={this.renderSeparator}
                                // ListFooterComponent={this.renderFooter}
                                // onEndReachedThreshold={0.01}
                                // onEndReached={this.handleLoadMore}
                                // onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                            >
                            </FlatList>
                        </View>
                        
                    )
                }
               </View>
        );
    }
}
const mapStateToProps = ({ state }) => ({
    product_stock: state.product_stock,
    list_stocktakes: state.list_stocktakes,
    list_stocktakes_save: state.list_stocktakes_save,
});
export default connect(mapStateToProps)(ListWarehouse);

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
  
