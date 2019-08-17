import qs from 'qs';
import React, {Component} from 'react';
import {  StyleSheet,ActionSheetIOS,Text,View, StatusBar,TouchableOpacity,Platform,Modal,FlatList,Alert,Button,Picker,Item,RefreshControl,ScrollView,ActivityIndicator,TouchableHighlight } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import Icon from "react-native-vector-icons/Ionicons";
import { Input } from 'react-native-elements';
import { CheckBox } from 'react-native-elements'
import { isEmpty, debounce,find,isNumber } from 'lodash';
import { stock_api,purchase_order_api } from '../../services/api/fetch'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import DateTimePicker from "react-native-modal-datetime-picker";
// import { isNumber } from 'util';
class WarehousingScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: 'MONTHNOW',
            selectedLabel: 'Hôm nay',
            animating: true,
            modalVisible: false,
            listStock:[],
            listStock_Search:[],
            refreshing: false,
            page:1,
            limit :10,
            page_search:1,
            total:null,
            datef:'',
            datet: '',
            text:'',
            status:null,
            visible_check: {
                cb: false,
                pt: false,
                h:false,
            },
            visible_tab:false,
            refreshing_test: false,
            visible_tab1:false,
            // test
            isDateTimePickerVisibleform: false,
            isDateTimePickerVisibleto: false,
            data_filter: {},
            warehouse:[],
        };
    }

    componentWillReceiveProps(){
        const { listStock } = this.state;
        const { navigation } = this.props;
        const loadWarehouse = navigation.getParam('loadWarehouse','load');
        // this.getListStock();
        if(!isEmpty(loadWarehouse)){
            this.setState ({listStock :[],animating:true,page:1},()=>{
                this.getListStock();
            })
        }
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    onShowType = () => {
        this.props.navigation.navigate("CreateWarehouse");
    }

    componentDidMount(){
        this.getListStock();
    }

    getListStock = () => {
        const { page,limit,refreshing,listStock,total,datef,datet,text,data_filter,status } = this.state;
        const offset = (page-1)*limit;
        const params = {
            mtype: 'listPurchaseOrder',
            limit,
            offset,
            depot_id: 1,
            ck_from_depot_id: 1
        };
        console.log(params);
        purchase_order_api(params).then((v) => {
            if(isEmpty(v.listOrder)){
                if(page == 1){
                    this.setState({listStock : [],animating:false,refreshing_test:false,refreshing:false});
                }else{
                    this.setState({listStock : [...listStock, ...v.listOrder],animating:false,refreshing_test:false,refreshing:false});
                }
            }else{
                this.setState({listStock : [...listStock, ...v.listOrder],animating:false,refreshing_test:false,refreshing:false});
            }
        });
    }
    
    getListStockSearch = async () => {
        const { page,limit,datef,datet,text,listStock,status } = this.state;
        // this.setState({refreshing_test:false});
        const offset = (page-1)*10;
        const params = {
            mtype: 'listPurchaseOrder',
            depot_id: 1,
            limit,
            offset,
            datef,
            datet,
            keyword_2:text,
            status,
            ck_from_depot_id: 1,
        };
        purchase_order_api(params).then((data) => {
            if(isEmpty(data.listOrder) && page == 1){
                this.setState({listStock : [],refreshing:false,animating:false,refreshing_test:true});
                // this.setState({animating:false})
            }else{
                this.setState({listStock : [...listStock, ...data.listOrder],refreshing:false,animating:false,refreshing_test:true});
            }
            // this.setState({listStock : [...listStock, ...data.listOrder],refreshing:false,animating:false,refreshing_test:false},()=>{
            // });
           
        })
        
    }



    _renderItem = (item,index) => {
        return (
            <TouchableOpacity 
                onPress={() => this.props.navigation.navigate('WarehousingScreenDetail',{
                    itemId:item
                }) }
            >
                <View>
                    <View style={stocktakesCss.stocktakesCss_list_box}>
                        <View style={stocktakesCss.stocktakesCss_list_left}>
                            <Text style={stocktakesCss.stocktakesCss_list_code}>{item.invoice}</Text>
                            <Text style={stocktakesCss.stocktakesCss_list_time}>{item.created_at}</Text>
                            {/* <Text style={stocktakesCss.stocktakesCss_list_time}>nhập kho</Text> */}
                        </View>
                        <View >
                            <Text style={stocktakesCss.stocktakesCss_list_status}>
                                {item.status === 0 && 'Phiếu tạm'}
                                {item.status === 1 && 'Đã cân bằng kho'}
                            </Text>
                            {/* <Text style={stocktakesCss.stocktakesCss_list_time}>{item.total}</Text>  */}
                            <Text style={stocktakesCss.stocktakesCss_list_time}>{item.total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</Text>
                            <View style={stocktakesCss.stocktakesCss_list_user} >
                            
                                <Icon
                                    name='ios-person'
                                    size={14}
                                    color='#28af6b'
                                />  
                            <Text style={stocktakesCss.stocktakesCss_list_user_name}>{item.user.full_name}</Text>
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

    _onRefresh = () => {
        this.setState({refreshing: true,page:1,animating:true,listStock:[],text:'',datet:'',datef:'',refreshing_test: false},()=>{
            this.getListStock();
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

    renderFooter = () => {
        console.log('renderFooter');
        if (this.state.refreshing_test ) return null;
        return (
            <ActivityIndicator
             size="large" color="#0000ff"
            />
        );

    };

    handleLoadMore =  () => {
        if (!this.onEndReachedCalledDuringMomentum) {
            const {page,total,datet,datef,keyword,status} = this.state;
            this.setState({refreshing_test:true,page:page+1},()=>{
                if(!isEmpty(datet)|| !isEmpty(datef) || !isEmpty(keyword) || isNumber(status)){
                    this.getListStockSearch();
                }else{
                    this.getListStock();
                }
            })    
            this.onEndReachedCalledDuringMomentum = true;
        }
    };

    

    onValueChangePicker = ()=>{
        const { date } = this.state;
        let datestart = '';
        let datetend = '';
        if(date == 'MONTHNOW'){
            datestart = moment().startOf('month').format("YYYY-MM-DD");
            datetend = moment().endOf("month").format("YYYY-MM-DD");
        }else if(date == 'NOW'){
            datestart = moment().startOf('day').format("YYYY-MM-DD");
            datetend = moment().endOf("day").format("YYYY-MM-DD");
        }else if(date == 'AGO'){
            datestart = moment().subtract(1, 'days').format("YYYY-MM-DD");
            datetend = moment().subtract(1, 'days').format("YYYY-MM-DD");
        }else if(date == 'WEEK'){
            datestart = moment().startOf('week').format("YYYY-MM-DD");
            datetend = moment().endOf("week").format("YYYY-MM-DD");
        }else if(date == 'MONTHAGO'){
            datestart =moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
            datetend =moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
        } else if(date == 'ALL'){
            // return this.getListStock();  
        } else if(date == 'OPTION'){
            // this.setState({visible_tab:true});
        }
        this.setState({datef :datestart,datet :datetend,listStock_Search:[],listStock:[],page:1,animating:true},()=>{
            this.getListStockSearch();
        })
    }



    visible_check = (type) => {
        const { visible_check } = this.state;
        let status1 ='';
        visible_check.pt = false;
        visible_check.cb = false;
        visible_check.h = false;
        visible_check[type] = !visible_check[type];
        if(type ==='pt'){
            status1 = 0
        }else if( type ==='cb'){
            status1 = 1
        } else if (type ==='h'){
            status1 = 2
        }
        this.setState({ visible_check,status:status1 });
    }

    onVisibleLocal = () =>{
        const { visible_tab1} = this.state;
        this.setState({visible_tab1:!visible_tab1});
    }

    onVisibleLocalConfirm = () =>{
        const { visible_tab1} = this.state;
        this.setState({visible_tab1:!visible_tab1,animating:true,listStock:[],page:1},()=>{
            this.getListStockSearch();
        });
    }

    renderDateOptions(options) {
        const htm = options.map((v, k) => {
            const idx = k + 1;
            return (
                <Item key={idx} label={v.label} value={v.value} />
            );
        });
        return htm;
    }

    onChangePicker(v) {
        if (v === 'OPTION') {
            this.onVisibleLocal();
            this.showDateTimePicker();
        } else {
            this.setState({ date: v },()=>{
                this.onValueChangePicker()
            });
        }
    }

    showDateTimePicker = () => {
        const {isDateTimePickerVisibleform,isDateTimePickerVisibleto} = this.state;
        this.setState({ isDateTimePickerVisibleform: !isDateTimePickerVisibleform,isDateTimePickerVisibleto:!isDateTimePickerVisibleto });
    };

    onConfirmForm = (date) => {
        this.setState({ isDateTimePickerVisibleform: false,datef: moment(date).format('YYYY-MM-DD')});
    };

    onConfirmTo= (date) => {
        this.setState({ isDateTimePickerVisibleto: false,datet:moment(date).format('YYYY-MM-DD') });
    };

    hideDateTimePickerTo= (date) => {
        this.setState({ isDateTimePickerVisibleto: false });
    };
    hideDateTimePickerFrom= (date) => {
        this.setState({ isDateTimePickerVisibleform: false });
    };

    showDateIOS(options) {
        const tmp = ['Hủy'];
        options.map((v) => tmp.push(v.label));
        ActionSheetIOS.showActionSheetWithOptions (
            { options: tmp, cancelButtonIndex: 0 }, (index) => {
                if (index !== 0) {
                    if (options[index - 1].value === 'OPTION') {
                        // this.showDateTimePicker();
                        this.onVisibleLocal();
                        this.showDateTimePicker();
                    } else {
                        // this.setState({ selectedValue: options[index - 1].value, selectedLabel: tmp[index] });
                        // this.setState({ selectedLabel: tmp[index] });
                        this.setState({selectedLabel: tmp[index], date: options[index - 1].value },()=>{
                            this.onValueChangePicker()
                        });
                    }
                }
            },
        );
    }

    getStatus = () =>{
        // this.setState({page:1,listStock_Search:[],listStock:[],page:1,animating:true},()=>{
        //     this.getListStockSearch();
        // })

        this.setState({listStock_Search:[],listStock:[],page:1,animating:true},()=>{
            this.getListStockSearch();
        })
    }

    render() {
        const options = [
            { value: 'MONTHNOW', label: 'Tháng này' },
            { value: 'ALL', label: 'Toàn thời gian' },
            { value: 'NOW', label: 'Hôm nay' },
            { value: 'AGO', label: 'Hôm qua' },
            { value: 'WEEK', label: 'Tuần này' },
            { value: 'MONTHAGO', label: 'Tuần trước' },
            { value: 'OPTION', label: 'Tùy chọn' },
        ];
        const {selectedLabel, listStock,datef,datet, visible_check,animating,listStock_Search,visible_tab,visible_tab1,isDateTimePickerVisibleform,isDateTimePickerVisibleto } = this.state;
        if(animating){
            return  <ActivityIndicator
                    size="large" color="#00ff00"
                 />
        }
        return (
            <View>
                <StatusBar
                    backgroundColor="blue"
                    barStyle="light-content"
                />
                <View style={ Main.select_box_main }>
                    <TouchableOpacity style={Main.select_box_item}>
                        <Text style={Main.select_box_icon} >
                            <Icon
                                name='ios-calendar'
                                size={18}
                                color="#545454"
                            />  
                        </Text>
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
                                    selectedValue={this.state.date}
                                    style={{height: 50, width: 100}}
                                    onValueChange={(v) => this.onChangePicker(v)}
                                >
                                    {this.renderDateOptions(options)}
                                </Picker>
                            )
                        }
                    </TouchableOpacity>
                    <TouchableOpacity style={Main.select_box_item_action_icon} onPress={this._onPressSearch} >
                        <Icon
                            name='ios-search'
                            size={23}
                            color="#545454"
                            onPress={() => {
                                this.setModalVisible(true);
                            }}
                        />  
                    </TouchableOpacity>
                    <View>
                        <Icon
                            name="ios-add"
                            size={40}
                            color="#545454"
                            onPress={this.onShowType}
                        />  
                    </View>
                </View>
                { !isEmpty(listStock)
                    &&( 
                        <View style={stocktakesCss.stocktakesCss_list} onPress={() => this.props.navigation.navigate('StockDetail')} >
                            <FlatList
                                data={listStock}
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
                                ListFooterComponent={this.renderFooter}
                                onEndReachedThreshold={0.1}
                                onEndReached={this.handleLoadMore}
                                onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                            >
                            </FlatList>
                        </View>
                        
                    )
                }
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}
                >
                    <View style={{marginTop: 22,marginLeft: 22}}>
                        <View>
                        <Text>KeyWord</Text>
                        <Input
                            placeholder="KeyWord"
                            style={{ marginTop: 50 }}
                            onChangeText={(text) => this.setState({text})}
                        />
                        
                        <Text>Trạng thái</Text>
                        <CheckBox
                            title='Phiếu tạm'
                            checked={visible_check.pt}
                            onPress={()=>{
                                this.visible_check('pt')
                            }}
                        />
                        <CheckBox
                            title='Đã nhập hàng'
                            checked={visible_check.cb}
                            onPress={()=>{
                                this.visible_check('cb')
                            }}
                        />
                        <CheckBox
                            title='Đã hủy'
                            checked={visible_check.h}
                            onPress={()=>{
                                this.visible_check('h')
                            }}
                        />
                        <TouchableHighlight
                            onPress={() => {
                            this.setModalVisible(!this.state.modalVisible);
                            }}>
                            <View>
                                <Button
                                    title="Hủy"
                                    onPress={() => {
                                        this.setState({text:''},()=>{
                                            this.setModalVisible(!this.state.modalVisible);
                                        })
                                    }}
                                />
                                <Button
                                    title="Áp dụng"
                                    onPress={() => {
                                        this.setModalVisible(!this.state.modalVisible);
                                        this.getStatus();
                                        // this.setState({page:1,listStock_Search:[],listStock:[],page:1,animating:true},()=>{
                                        //     this.getListStockSearch();
                                        // })
                                        
                                    }}
                                />
                            </View>
                        </TouchableHighlight>
                        </View>
                    </View>
                </Modal>

                <Modal
                    visible={visible_tab1}
                >   
                    <ScrollableTabView
                        initialPage={0}
                        tabBarUnderlineStyle={{ backgroundColor: '#28af6b', height: 3 }}
                        tabBarActiveTextColor={{ color: 'red', backgroundColor: '#28af6b' }}
                        tabBarInactiveTextColor={{ color: 'red', backgroundColor: '#28af6b' }}
                        tabBarBackgroundColor={{ color: 'red', backgroundColor: '#28af6b' }}
                        tabBarTextStyle={{ color: '#000' }}
                        
                    >
                        <ScrollView tabLabel='Từ'>
                            
                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisibleform}
                                onConfirm={this.onConfirmForm}
                                onCancel={this.hideDateTimePickerFrom}
                            />
                            <Text>Ngày bắt đầu :{datef}</Text>
                            <Button
                                title="Chọn thời gian"
                                onPress={() => this.showDateTimePicker()}
                            />

                        </ScrollView>
                        <ScrollView tabLabel='Đến'>
                            <Button
                                title="Chọn thời gian"
                                onPress={() => this.showDateTimePicker()}
                            />
                             <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisibleto}
                                onConfirm={this.onConfirmTo}
                                onCancel={this.hideDateTimePickerTo}
                            />
                            <Text>Ngày bắt đầu :{datet}</Text>
                        </ScrollView>
                    </ScrollableTabView>
                    <Button
                        title="Bỏ qua"
                        onPress={() => this.onVisibleLocal()}
                    />
                    <Button
                        title="Đồng ý"
                        onPress={() => this.onVisibleLocalConfirm()}
                    />
                </Modal>
            </View>
        );
    }
}

export default WarehousingScreen;

WarehousingScreen.navigationOptions = {
  title: 'Nhập kho',
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