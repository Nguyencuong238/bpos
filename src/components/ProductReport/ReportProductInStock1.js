import React, {Component} from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet,Text,View,TouchableOpacity ,TextInput,Picker,FlatList,TouchableHighlight,Alert,Dimensions} from 'react-native';
import { isEmpty, findKey, includes, isArray, forEach, sumBy, filter,remove,  reduce as _reduce, chunk ,isNumber} from 'lodash';
import HTML from 'react-native-render-html';
import { IGNORED_TAGS } from 'react-native-render-html/src/HTMLUtils'
import _ from 'lodash'
class ReportProductInStock extends Component{
    constructor(props) {
        super(props);
        this.state = {

        };
    }


    render() {
        const htmlContent1 = `
            <h1>This HTML snippet is now rendered with native components !</h1>
            <h2>Enjoy a webview-free and blazing fast application</h2>
            <img src="https://i.imgur.com/dHLmxfO.jpg?2" />
            <em style="textAlign: center;">Look at how happy this native cat is</em>
        `;
        const htmlContent = `
            <table border="0" cellpadding="0" cellspacing="0" id="sheet0" class="table table-hover table-bordered table_report">
            <col class="col0">
            <col class="col1">
            <col class="col2">
            <col class="col3">
            <col class="col4">
            <col class="col5">
            <col class="col6">
            <thead>
            <tr class="row0">
                <th class="column0 style12 s style0" rowspan="2">STT</th>
                <th class="column1 style12 s style0" rowspan="2">Mã nhà cung cấp </th>
                <th class="column2 style12 s style0" rowspan="2">Tên nhà cung cấp</th>
                <th class="column3 style12 s style12" colspan="4">Giao dịch</th>
            </tr>
            <tr class="row1">
                <th class="column3 style0 s">Nợ đầu kỳ</th>
                <th class="column4 style0 s">Tăng trong kỳ</th>
                <th class="column5 style0 s">Giảm trong kỳ</th>
                <th class="column6 style0 s">Nợ cuối kỳ</th>
            </tr>
            </thead>
            <tbody>
            <tr class="row2">
                <td class="column0 style5 s">[1]</td>
                <td class="column1 style5 s">[2]</td>
                <td class="column2 style5 s">[3]</td>
                <td class="column3 style5 s">[4]</td>
                <td class="column4 style5 s">[5]</td>
                <td class="column5 style5 s">[6]</td>
                <td class="column6 style5 s">[7=4+5-6]</td>
            </tr>
            <tr class="row3">
                <td class="column0 style2 null"></td>
                <td class="column1 style2 s">Tổng</td>
                <td class="column2 style2 null"></td>
                <td class="column3 style3 f">29,560,000 đ</td>
                <td class="column4 style3 f">2,090,000 đ</td>
                <td class="column5 style3 f">1,290,000 đ</td>
                <td class="column6 style3 f">30,360,000 đ</td>
            </tr>
            <tr class="row4">
                <td class="column0 style0 n">1</td>
                <td class="column1 style0 f"><a href="/bpos/partner/supplier-list?id=1" title="NCC111">NCC111</a></td>
                <td class="column2 style0 s">Nhà cung cấp 1 </td>
                <td class="column3 style1 n">3,827,000 đ</td>
                <td class="column4 style1 n">2,090,000 đ</td>
                <td class="column5 style1 n">1,290,000 đ</td>
                <td class="column6 style1 f">4,627,000 đ</td>
            </tr>
            <tr class="row5">
                <td class="column0 style0 n">2</td>
                <td class="column1 style0 f"><a href="/bpos/partner/supplier-list?id=2" title="NCC222">NCC222</a></td>
                <td class="column2 style0 s">Nhà cung cấp 2 </td>
                <td class="column3 style1 n">990,000 đ</td>
                <td class="column4 style1 n">0 đ</td>
                <td class="column5 style1 n">0 đ</td>
                <td class="column6 style1 f">990,000 đ</td>
            </tr>
            <tr class="row6">
                <td class="column0 style0 n">3</td>
                <td class="column1 style0 f"><a href="/bpos/partner/supplier-list?id=3" title="NCC33">NCC33</a></td>
                <td class="column2 style0 s">Nhà cung cấp 3</td>
                <td class="column3 style1 n">19,480,000 đ</td>
                <td class="column4 style1 n">0 đ</td>
                <td class="column5 style1 n">0 đ</td>
                <td class="column6 style1 f">19,480,000 đ</td>
            </tr>
            <tr class="row7">
                <td class="column0 style0 n">4</td>
                <td class="column1 style0 f"><a href="/bpos/partner/supplier-list?id=4" title="NCC4">NCC4</a></td>
                <td class="column2 style0 s">nhà cung cấp 4</td>
                <td class="column3 style1 n">5,263,000 đ</td>
                <td class="column4 style1 n">0 đ</td>
                <td class="column5 style1 n">0 đ</td>
                <td class="column6 style1 f">5,263,000 đ</td>
            </tr>
            <tr class="row8">
                <td class="column0 style0 n">5</td>
                <td class="column1 style0 f"><a href="/bpos/partner/supplier-list?id=5" title="NCC5">NCC5</a></td>
                <td class="column2 style0 s">nhà cung cấp5</td>
                <td class="column3 style1 n">0 đ</td>
                <td class="column4 style1 n">0 đ</td>
                <td class="column5 style1 n">0 đ</td>
                <td class="column6 style1 f">0 đ</td>
            </tr>
            </tbody>
        </table>
            ` ;
        let content = htmlContent;
        const tables = htmlContent.match(/(<table(?:.|\n)*?<\/table>)/g);
        tables.map((table) => {
            content = content.replace(table, `<iframe srcdoc="${table}"></iframe>`);
          });
        //tét
        const tags = _.without(IGNORED_TAGS, 
            'table', 'caption', 'col', 'colgroup', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr'
        )
        
        const tableDefaultStyle = {
          flex: 1,
          justifyContent: 'flex-start',
        }
        
        const tableColumnStyle = {
          ...tableDefaultStyle,
          flexDirection: 'column',
          alignItems: 'stretch'
        }
        
        const tableRowStyle = {
          ...tableDefaultStyle,
          flexDirection: 'row',
          alignItems: 'stretch'
        }
        
        const tdStyle = {
          ...tableDefaultStyle,
          padding: 2
        }
        
        const thStyle = {
          ...tdStyle,
          backgroundColor: '#CCCCCC',
          alignItems: 'center',
        }
        
        const renderers = {
            table: (x, c) => <View style={tableColumnStyle}>{c}</View>,
            col: (x, c) => <View style={tableColumnStyle}>{c}</View>,
            colgroup: (x, c) => <View style={tableRowStyle}>{c}</View>,
            tbody: (x, c) => <View style={tableColumnStyle}>{c}</View>,
            tfoot: (x, c) => <View style={tableRowStyle}>{c}</View>,
            th: (x, c) => <View style={thStyle}>{c}</View>,
            thead: (x, c) => <View style={tableRowStyle}>{c}</View>,
            caption: (x, c) => <View style={tableColumnStyle}>{c}</View>,
            tr: (x, c) => <View style={tableRowStyle}>{c}</View>,
            td: (x, c) => <View style={tdStyle}>{c}</View>,
          }
        return (
            <View>
                <View style={styles.modalContent}>
                    <Text>
                        Hàng hóa
                    </Text>
                </View>
                {/* <ScrollView >
                    <View  style={{ fontSize: 15,backgroundColor:'red' }}>
                        <HTML html={htmlContent}  />
                    </View>
                   
                </ScrollView> */}
                {/* <View  style={{ fontSize: 15,backgroundColor:'red' }}>
                    <HTML ignoredTags={tags} renderers={renderers} html={htmlContent} />
                </View> */}
                <ScrollView  >
                    <HTML ignoredTags={tags} renderers={renderers} html={htmlContent} imagesMaxWidth={Dimensions.get('window').width}/>
                </ScrollView>
            </View>
             // <ScrollView style={{ flex: 1 }}>
            //     <HTML html={htm} imagesMaxWidth={Dimensions.get('window').width} />
            // </ScrollView>
           
                
        );
    }
}
const mapStateToProps = ({ state }) => ({
});
export default connect(mapStateToProps)(ReportProductInStock);


  
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