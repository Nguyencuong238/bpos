import { StyleSheet } from 'react-native';
import { COLOR_MAIN, COLOR_PRIMARY, BORDER_RADIUS, BACKGROUND_HEADER, COLOR_LINK, COLOR_WHITE } from './common';

export const goodsCss = StyleSheet.create({
    goods_details_avatar:{
        flex: 1,
        flexDirection: 'row',
        padding:15,
        borderWidth:1,
        borderColor:'#ddd',
    },
    goods_details_list:{
        borderBottomWidth:1,
        borderColor:'#eaeaea',
        backgroundColor:'#f5f5f5',
        padding:15,
        flexDirection:'row'
    },  
    goods_search_title:{
        padding:15,
        fontWeight:'600',
        fontSize:13,
        color:'#000'
    },
    goods_search_input:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'#f5f5f5',
        borderWidth:1,
        borderColor:'#eaeaea',
        borderRadius:4,
        paddingHorizontal:15,
        marginBottom:15,

    }
})