import { StyleSheet } from 'react-native';
import { COLOR_MAIN,COLOR_ERROR,COLOR_PRIMARY,BORDER_RADIUS,BACKGROUND_HEADER,COLOR_LINK,COLOR_WHITE } from './../styles/common';

export const stocktakesCss = StyleSheet.create({
    menu_action: {
        backgroundColor: '#ddd',
        padding: 10,
        justifyContent: 'flex-end',
        flexDirection: 'row',
    },
    stocktakesCss_list_right: {
        textAlign: 'right',
    },
    stocktakesCss_list_code: {
        fontWeight: '700',
        fontSize: 15,
        marginBottom: 5,
    },
    stocktakesCss_list_time: {
        fontSize: 12,
        fontStyle: 'italic',
        color: '#545454',
        marginBottom: 5,
    },
    stocktakesCss_list_status: {
        fontSize: 13,
        marginBottom: 5,
        color: '#545454',
        textAlign:'right'
    },
    stocktakesCss_list_user: {
        fontSize: 12,
        color: '#28af6b',
        textAlign: 'right',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    stocktakesCss_list_link: {
        paddingLeft: 5,
    },
    stocktakesCss_list_box: {
        flex: 1,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        //backgroundColor: this.props.index % 2  == 0 ? 'red' : 'yellow'
    },
    stocktakesCss_list: {
        marginBottom: 150,
        paddingBottom: 10,
    },
    stocktakesCss_list_user_name:{
        fontSize:12,
        marginLeft:5
    },
    createStockTake_box: {
        flex: 1,
    },
    createStockTake_main: {
        paddingVertical: 10,
        alignItems: 'center'
    },
    search_form_control: {
        backgroundColor: '#fff',
        flex: 30,
        padding: 0,
    },
    search_form_input: {
        fontSize: 14,
        paddingHorizontal: 10,
    },
    search_icon: {
        marginLeft: 0,
    },
    modal_header_top:{
        backgroundColor: '#ddd',
        padding:25
    },
    modal_header_top_title:{
        fontWeight:'800',
        marginBottom:5,
        fontSize:14,
        textAlign:'center'
    },
    modal_header_top_code:{
        fontSize:14,
        color:'#737373',
        textAlign:'center'
    }
})