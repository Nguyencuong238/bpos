import { StyleSheet } from 'react-native';
import { COLOR_MAIN,COLOR_ERROR,COLOR_PRIMARY,BORDER_RADIUS,BACKGROUND_HEADER,COLOR_LINK,COLOR_WHITE } from './../styles/common';

export const CustomerCss = StyleSheet.create({
    customer_edit_box:{
        padding:15,
    },
    customer_edit_upload_avatar:{
        //flexDirection:'row',
        alignItems: 'center'
    },
    customer_edit_upload_avatar_text:{
        margin:15, 
        fontSize:15
    },
    customer_edit_form:{
        paddingHorizontal:0,
    },
    customer_edit_input_box:{
        borderBottomColor:'#ddd',
        paddingHorizontal: 0,
        marginLeft:0,
    },
    customer_edit_input:{
        fontSize:15,
        color:'#000',
    },
    customer_edit_icon:{
        marginLeft:0,
    },
    customer_edit_sex:{
        flexDirection:'row',
        alignItems:'center',
        borderBottomColor:'#ddd',
        borderBottomWidth: 1,
        marginTop:15,
        paddingBottom: 15,
    },
    customer_edit_readmore:{
        alignItems:'flex-end',
        position:'absolute',
        right:0,
        top:0
    }
 })