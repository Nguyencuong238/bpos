import React, {Component} from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet,Text,View,TouchableOpacity ,TextInput,Picker,FlatList,TouchableHighlight,Alert} from 'react-native';
import { Input, Button } from 'react-native-elements';
import axios from 'axios';
import qs from 'qs';
import Modal from "react-native-modal";
import { R_PRODUCT_STOCK, R_STOCK_TAKES, R_EDIT_STOCKTAKES,R_EDIT_WAREHOUSING,R_WAREHOUSING } from '../../reducers/actions';
import moment from 'moment';
import { isEmpty, findKey, includes, isArray, forEach, sumBy, filter,remove,  reduce as _reduce, chunk ,isNumber} from 'lodash';
class Modal_Save extends Component{
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    onVisibleLocal() {
        const { dispatch, onVisible1, onVisibleModal1 } = this.props;
        const list_warehouse = [];
        dispatch({ type: R_EDIT_WAREHOUSING, payload: list_warehouse });
        dispatch({ type: R_WAREHOUSING, payload: list_warehouse });
        if (onVisible1) onVisible1();
        if (onVisibleModal1) onVisibleModal1();
    }

    submitForm() {
        const { onVisible1, onVisibleModal1 } = this.props;
        if (onVisible1) onVisible1();
        if (onVisibleModal1) onVisibleModal1();
    }

    render() {
        const { visible } = this.props;
        return (
                <Modal
                    isVisible={visible}
                >   
                <View style={styles.modalContent}>
                    <Text>
                        Hệ thống tìm được 1 bản nháp chưa được lưu lên máy chủ. Bạn có muốn tiếp tục làm việc với bản nháp này?
                    </Text>

                </View>
                    <Button
                        title="Bỏ qua"
                        onPress={() => this.onVisibleLocal()}
                    />
                    <Button
                        title="Đồng ý"
                        onPress={() => this.submitForm(0)}
                    />
                </Modal>
        );
    }
}
const mapStateToProps = ({ state }) => ({
    product_stock: state.product_stock,
    list_stocktakes: state.list_stocktakes,
    list_stocktakes_save: state.list_stocktakes_save,
});
export default connect(mapStateToProps)(Modal_Save);


  
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