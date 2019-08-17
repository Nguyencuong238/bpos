import qs from 'qs';
import React, {Component} from 'react';
import {  StyleSheet,ActionSheetIOS,Text,View, StatusBar,TouchableOpacity,Platform,Modal,FlatList,Alert,Button,Picker,Item,RefreshControl,ScrollView,ActivityIndicator,TouchableHighlight } from 'react-native';
import axios from 'axios';
import { stock_api,purchase_order_api } from '../../services/api/fetch'
import { isEmpty, debounce,find } from 'lodash';
import moment from 'moment';
import Icon from "react-native-vector-icons/Ionicons";
class WarehousingScreenDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            order_info :null,
            total:'',
        };
    }

    static navigationOptions = {
        // headerTitle: <LogoTitle />,
        headerRight: (
          <Button
            onPress={() => alert('This is a button!')}
            title="Info"
            color="#fff"
          />
        ),
    };

    componentDidMount() {
        this.getlistProduct();
        // this.loadPrint();
    }

    getlistProduct = async () => {
        const { navigation } = this.props;
        const itemId = navigation.getParam('itemId','xxxx');
        const params = {
            mtype: 'getProductByOrder',
            id: itemId.id,
            limit:100,
            offset:0,
        };


        purchase_order_api(params).then((data) => {
            this.setState({ order_info: data.order_info});
        })
    }

    // static navigationOptions = ({ navigation }) => {
    //     return {
    //     //   headerTitle: "Title",
    //     headerRight: (
    //         <Icon 
    //             name='ios-build' 
    //             size={30}
    //             color="#ddd"
    //             onPress={() => navigation.navigate('CreateStockTake')}
    //         />
           
    //       ),
    //     };
    // }

    _renderItem = (item,index) => {
        console.log(item);
        return (
            <TouchableOpacity 
                // onPress={() => this.props.navigation.navigate('WarehousingScreenDetail',{
                //     itemId:item
                // })}
            >
                <View>
                    <View style={stocktakesCss.stocktakesCss_list_box}>
                        <View style={stocktakesCss.stocktakesCss_list_left}>
                            <Text style={stocktakesCss.stocktakesCss_list_code}>{item.name}
                            {!isEmpty(item.batch_info) && (
                                 <Text style={stocktakesCss.stocktakesCss_list_time}>
                                    {item.batch_info.name} - {moment(item.batch_info.expired_date).format('YYYY-MM-DD')}
                                 </Text>
                            )}
                            </Text>
                            <Text style={stocktakesCss.stocktakesCss_list_time}>{item.barcode}</Text>
                            <Text style={stocktakesCss.stocktakesCss_list_time}>{parseInt(item.price)} x {parseInt(item.quantity)}</Text>
                        </View>
                        <View >
                            <Text style={stocktakesCss.stocktakesCss_list_status}>
                                {item.status === 0 && 'Phiếu tạm'}
                                {item.status === 1 && 'Đã cân bằng kho'}
                            </Text>
                            <Text style={stocktakesCss.stocktakesCss_list_time}>{item.total}</Text>
                            <View style={stocktakesCss.stocktakesCss_list_user} >
                            <Text style={stocktakesCss.stocktakesCss_list_user_name}>{parseInt(item.price)*parseInt(item.quantity)}</Text>
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
    };

    editInvoice = (itemId) =>{
        this.props.navigation.navigate('CreateWarehouse',{
            invoice_id:itemId.id
        })
    }

    render() {
        const { navigation } = this.props;
        const { order_info } = this.state;
        const itemId = navigation.getParam('itemId');
        return (
            <ScrollView>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    marginTop:50
                }}>
                    <View >
                        <View>
                            <Text style={{color:'black'}}>Mã nhập hàng:   {itemId.invoice}</Text>
                        </View>                        
                    </View>
                    <View >
                        <View>
                            <Text style={{color:'black'}}>Người cân bằng :   {itemId.user.full_name}</Text>
                    
                        </View>
                        <View>
                            <Text>Thời gian : {itemId.created_at}</Text>
                        </View>
                        
                    </View>
                    <View >
                        <View>
                            <Text style={{color:'black'}}>Ghi chú:   {itemId.from_depot.name}</Text>
                        </View>
                        
                    </View>
                    { order_info != null
                        &&(
                            <ScrollView>
                                 <View>
                                    <FlatList
                                        data={order_info.products}
                                        renderItem={({item, index})=>{
                                            return( this._renderItem(item, index));
                                        }}
                                    >
                                    </FlatList>
                                </View>
                            </ScrollView>
                           
                        )
                    }

                    <View >
                        <View>
                            {/* <Text style={{color:'black'}}>Tổng tiền hàng :   {((parseFloat(itemId.total, 10)))} VNĐ</Text> */}
                            <Text style={{color:'black'}}>Tổng tiền hàng :   {(((itemId.total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"))))} VNĐ</Text>
                        </View>
                        <View>
                            {/* <Text>Giảm giá phiếu nhập :  {((parseFloat(itemId.special_amount, 10)))}</Text> */}
                            <Text>Giảm giá phiếu nhập :  {(((itemId.special_amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"))))} VNĐ</Text>
                        </View>
                        <View>
                            {/* <Text>Cần trả NCC : {((parseFloat(itemId.total, 10)))-((parseFloat(itemId.special_amount, 10)))}</Text> */}
                            <Text>Cần trả NCC : {(((parseFloat(itemId.total, 10)))-((parseFloat(itemId.special_amount, 10)))).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} VNĐ</Text>
                        </View>
                        <View>
                            {/* <Text>Đã trả NCC :  {((parseFloat(itemId.paying_amount, 10)))}</Text> */}
                            <Text>Đã trả NCC :  {(((itemId.paying_amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"))))} VNĐ</Text>
                        </View>   
                    </View>
                </View>
                <View>
                {itemId.status === 0 
                    && (
                        <Button
                            title="Sửa phiếu"
                            onPress ={()=>this.editInvoice(itemId)}
                        />
                    )
                }
                {/* {item.status === 1 && 'Đã cân bằng kho'} */}
                    
                </View>
        
            </ScrollView>
        );
    }
}

export default WarehousingScreenDetail;

WarehousingScreenDetail.navigationOptions = {
    title: 'Nhập kho',
    drawerLabel: () => null,
    // headerRight: (
    //     <Icon 
    //         name='ios-build' 
    //         size={30}
    //         color="#ddd"
    //         onPress={() => this.props.navigation.navigate('CreateWarehouse')}
    //     />
        
    // ),
};

const stylesxx = StyleSheet.create({
    scene: {
      flex: 1,
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
        // marginTop:800,
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
      paddingTop: 15,
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

