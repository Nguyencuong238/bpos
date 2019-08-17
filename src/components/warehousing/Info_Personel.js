import qs from 'qs';
import React, {Component} from 'react';
import { ScrollView, StyleSheet,Text,View,TouchableOpacity ,TextInput,Picker,FlatList,Modal,TouchableHighlight,Alert,AsyncStorage} from 'react-native';
import axios from 'axios';
import { Input, Button } from 'react-native-elements';
import { isEmptyStatement } from '@babel/types';
import { isEmpty, debounce, reduce as _reduce } from 'lodash';
import moment from 'moment';
import { personnel_api } from '../../services/api/fetch'
// import Icon from "react-native-vector-icons/Ionicons";
class Info_Personel extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            info_data:'',
            invoice:'',
            info:'',
        };
    }
    

    componentDidMount(){
        this.getInfo();
    }

    getInfo = async () => {
        this.setState({loading:true})
        const params = {
            mtype: 'getAll',
        };
        // try {
        //     const res = await axios('https://wdevapi.bpos.vn/api/crm/personnel', {
        //         method: 'post',
        //         headers: {
        //             authcode: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1NjE5NjQxMjQsImV4cCI6MTU5MzU4NjUyNCwidWlkIjoxLCJhdXRoX2NvZGUiOiJmZjNjMWUxODBiNTIzNjQxZGQxODIyYWY1YmYwZjk4MyIsIm5vZGVfaWQiOjMwMSwiY2xhaW1zIjp7Im5vZGVfaWQiOiIzMDEifX0.X0HrLbSaWKa5BZGyyTJVreDf2wr12AHQYGJic0jIdJECS7Egm0-a6Nd07koiMNrAXR4NvAJEUn4DLYo2c0aNiLCsKfIZyBHsVmOMylogJoYZUeqhXh8nTgWrpsKkK_R_nJY7_IOr1dtNSZ-wEWGtUaIfBBgYMfsxtRqhA6OmFEO-iSmAscPx9t8jUWQcvmo9uw-wjvV-nGke8bIUZB7yT4W8IsOENrRIOAtXBegu8I4V72cl2TcSqhraOT2D97L2EilSj5TeuXat9QZjr3NQfbHLESVFmqFaNn_Zl7NWzXKQv9MCLFh9WcRyQM41_ajtAA8DKo5GUo_aNMHGR-MR1Q',
        //         },
        //         data: qs.stringify(params),
        //     });
        //     this.setState({info_data:res.data.data.personnels,loading:false})
        // } catch (error) {
        //     this.setState({loading:false})
        // }

        personnel_api(params).then((data) => {
            this.setState({info_data:data.personnels,loading:false})
        })
    }


    onShowType = () => {
        const { invoice,info} = this.state;
        this.props.navigation.navigate('CreateWarehouse',{
            invoice_stock:invoice,
            info_person:info,
        });
    }

    renderInfo = (info) =>{
        const htm = info.map((v, k) => {
            return (
                <Picker.Item label={v.full_name} value={v.personnel_id} />
            );
        });
        return htm;
    }


    updateUser = (user) => {
        this.setState({ info: user })
    }


    render() {
        const { invoice,info,info_data } = this.state;
        const { navigation } = this.props
        return (
            <View>
                <View >
                    <View style={{height: 60, backgroundColor: 'white'}} >
                        <View style={{flex: 1, flexDirection: 'row',marginLeft:20,marginTop:20}}>
                            <View style={{width: 100}} >
                                <Text style={{fontSize:15}}>Mã phiếu xx</Text> 
                            </View>
                            <View style={{width: 250}} >
                                <TextInput
                                    placeholder="Mã phiếu tự động"
                                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                                    value={this.state.invoice}
                                    onChangeText={(invoice) => this.setState({invoice})}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{height: 40, backgroundColor: 'white'}} >
                        <View style={{flex: 1, flexDirection: 'row',marginLeft:20,marginTop:20}}>
                            <View style={{width: 100}} >
                                <Text style={{fontSize:15}}>Ngày tạo</Text> 
                            </View>
                            <View style={{width: 250}} >
                                <Text>
                                   {/* 03/07/2019 */}
                                   {moment().startOf('day').format("YYYY-MM-DD")}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{height: 40, backgroundColor: 'white'}} >
                        <View style={{flex: 1, flexDirection: 'row',marginLeft:20,marginTop:20}}>
                            <View style={{width: 100}} >
                                <Text style={{fontSize:15}}>Ngày cân bằng</Text> 
                            </View>
                            <View style={{width: 250}} >
                                <Text>
                                   {/* 03/07/2019 */}
                                   {moment().startOf('day').format("YYYY-MM-DD")}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{height: 200, backgroundColor: 'white'}} >
                        <View style={{flex: 1, flexDirection: 'row',marginLeft:20,marginTop:20}}>
                            <View style={{width: 100}} >
                                <Text style={{fontSize:15}}>Người tạo</Text> 
                            </View>
                            <View style={{width: 250}} >
                            {!isEmpty(info_data)
                                &&(
                                    <Picker
                                        selectedValue={this.state.info}
                                        style={{ width: 200}}
                                        onValueChange = {this.updateUser}
                                    >
                                        <Picker.Item label='Người tạo' value={this.state.info} />
                                        {this.renderInfo(info_data)}
                                    </Picker>
                                )
                            }
                            </View>
                        </View>
                    </View>
                
                <Button
                    title="Lưu"
                    onPress={()=>this.onShowType()}
                    // onPress={() => navigation.navigate('CreateStockTake',{
                    //     info_person:'minhhhhh'
                    // })}
                    buttonStyle={[Main.btn_submit_button, Main.btn_submit_button_success]}
                    containerStyle={Main.btn_submit_button_box}
                    titleStyle={Main.btn_submit_button_title}
                />
            </View>
        );
    }
}

export default Info_Personel;

Info_Personel.navigationOptions = {
    title: 'Thông tin',
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
