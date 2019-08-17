import { StyleSheet } from 'react-native';
import { COLOR_MAIN, COLOR_PRIMARY, BORDER_RADIUS, BACKGROUND_HEADER, COLOR_LINK, COLOR_WHITE } from './common';

export const dashboardCss = StyleSheet.create({
    dashboard_main:{
        backgroundColor:'#E5E5E5'
    },
    dashboard_box:{
        backgroundColor:COLOR_WHITE,
        borderRadius:8,
        padding:10,
        marginBottom:15
    },
    dashboard_title:{
        fontSize:16,
        fontWeight: '500',
        paddingVertical: 10,
    },
    dashboard_hoz:{
        flexDirection:'row',
        alignItems:'center',
    },
    dashboard_selling_top_ten_list:{
        //marginBottom:300,
        //marginTop:60,
        //paddingBottom: 300,
        height:530,
    },
    dashboard_selling_top_ten_list_img:{
        flex:20,
    },
    dashboard_selling_top_ten_list_info:{
        flex:80,
    },
    dashboard_selling_top_ten_list_name:{
        maxWidth:180,
        flexDirection:'row',
        overflow:'hidden',
    },
    dashboard_selling_top_ten_list_info_top:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginBottom:5,
    },
    dashboard_selling_top_ten_list_amount:{
        fontWeight:'200',
    },
    dashboard_selling_top_ten_view_all:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems: 'center',
        paddingTop: 10,
    },
    dashboard_title_top:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 10,
        marginBottom:10,
        borderBottomWidth: 1,
        borderColor:'#ddd'
    },
    dashboard_title_top_btn:{
        paddingHorizontal: 10,
        paddingVertical: 3,
        backgroundColor:COLOR_MAIN
    },
    dashboard_title_top_title:{
        fontSize:13,
    },
    dashboard_overview_top:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginBottom:15,
    },
    dashboard_overview_title:{
        fontSize:14,
        fontWeight: '700',
        textTransform:'uppercase',
    },
    dashboard_overview_time:{
        fontSize:13,
        fontWeight: '200',
    },
    dashboard_statistical_box:{},
    dashboard_statistical_title:{
        fontSize:14,
        fontWeight:'200',
        marginBottom:5,
    },
    dashboard_statistical_price:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    dashboard_statistical_price_bold:{
        fontWeight:'700',
    },
    dashboard_statistical_percent_box:{
        alignItems:'center',
        justifyContent:'flex-start',
        flexDirection:'row',
        marginTop:3,
    },
    dashboard_statistical_percent:{
        color:COLOR_MAIN,
        paddingHorizontal: 3,
    },
    dashboard_total_revenue_main:{},
    dashboard_total_revenue_top:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingVertical:10,
        alignItems:'center'
    },
    dashboard_total_revenue_time:{
        fontSize:14,
        fontWeight:'200',
    },
    dashboard_total_revenue_select:{
        borderWidth:1,
        borderColor:'#ddd',
        paddingHorizontal:7,
        paddingVertical:7,
        borderRadius:3,
    },
    dashboard_order_list_box:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingVertical:10,
    },
    dashboard_order_list_name:{
        fontSize:14, 
    }
})