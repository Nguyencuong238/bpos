import { StyleSheet } from 'react-native';
import { COLOR_MAIN,COLOR_ERROR,COLOR_PRIMARY,BORDER_RADIUS,BACKGROUND_HEADER,COLOR_LINK,COLOR_WHITE } from './../styles/common';

export const Main = StyleSheet.create({
    color_link:{
       color:COLOR_LINK,
    },
    color_error:{
        color:COLOR_ERROR,
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
    margin_bottom_15:{
        marginBottom:15,
    },
    text_success:{
        color:COLOR_MAIN
    },
    text_danger:{
        color:COLOR_ERROR
    },
    table_container: { 
        padding: 10, 
        backgroundColor: COLOR_WHITE,
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
        backgroundColor: COLOR_WHITE   
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
    select_box_icon:{
        paddingRight:10,
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
        backgroundColor:COLOR_MAIN,
    },
    row:{
        marginHorizontal:-7.5,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    col_6:{
        paddingHorizontal:7.5,
        flex:50,
    },
    col_3:{
        paddingHorizontal:7.5,
        flex:33.33,
    },
    font_bold:{
        fontWeight:'600'
    },
    dataTable_title:{
        color:COLOR_WHITE
    }
 })