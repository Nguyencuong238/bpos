import { StyleSheet } from 'react-native';
import { COLOR_MAIN,COLOR_ERROR,COLOR_PRIMARY,BORDER_RADIUS,BACKGROUND_HEADER,COLOR_LINK,COLOR_WHITE } from './../styles/common';

export const MenuCss = StyleSheet.create({
    menu_main:{
        paddingBottom:60,
    },
    menu_list: {
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
    },
    menu_list_text:{
        padding:15,
    },
    navigation_main:{
        flex:1,
        flexDirection: 'column',
        backgroundColor:COLOR_WHITE,
        position:'relative',
        overflow:'hidden',
        width:'100%'
    },
    navigation_info_account:{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 50,
        paddingHorizontal: 15,
        paddingBottom:10,
        borderBottomWidth:1,
        borderColor:COLOR_MAIN,
        backgroundColor:COLOR_MAIN,
    },
    navigation_info_avatar:{
        width:50,
        height:50,
        borderRadius:30,
        marginRight: 10,
        backgroundColor:COLOR_WHITE,
        overflow:'hidden',
    },
    navigation_info_img:{
        width:50,
        height:50,
        //resizeMode: 'contain',
    },
    navigation_info_text:{
        flex:80,
    },
    navigation_info_title:{
        color:'#fff',
        marginBottom:5,
    },
    navigation_info_sub:{
        color:'#fff',
        fontSize:12,
    },
    navigation_logout_text:{
        paddingLeft:10,
        color:'#000',
    },
    navigation_logout:{
        flex:10,
        position:'absolute',
        bottom:0,
        left:0,
        right:0,
        fontSize:14,
        width:'100%',
        paddingHorizontal:20,
        paddingVertical: 20,
        borderTopWidth:1,
        borderColor:'#E5E5E5',
        backgroundColor:'#E5E5E5',
        flexDirection: 'row',
        alignItems:'center',
    },
    headerStyle: {
        backgroundColor: COLOR_MAIN,
    },
 })