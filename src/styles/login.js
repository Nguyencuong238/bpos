import { StyleSheet } from 'react-native';
import { COLOR_MAIN, COLOR_PRIMARY, BORDER_RADIUS, BACKGROUND_HEADER, COLOR_LINK, COLOR_WHITE } from './common';

export const loginCss = StyleSheet.create({
    imgBackground: {
        width: '100%',
        height: '100%',
        flex: 1
    },
    login_logo: {
        marginBottom: 30,
        //marginTop: 80,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    login_logo_img: {
        width: 150,
        resizeMode: 'contain',
    },
    login_container: {
        position: 'relative',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    login_container_top: {
        flex: 85,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    login_container_bottom: {
        flex: 15,
        textAlign: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    login_copyright: {
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 13,
        padding: 10,
        color: COLOR_WHITE,
    },
    login_form: {
        width: 300,
    },
    login_form_control: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 999,
        marginBottom: 20,
    },
    login_form_input: {
        fontSize: 15,
        marginLeft: 10,
        marginRight: 10,
        color: '#fff',
    },
    login_form_input_dislable:{
        color:'#a7a7a7',
    },
    login_icon: {
        marginLeft: 10,
        width:20,
    },
    login_icon_pass: {
        transform: [{ rotate: '180deg' }],
    },
    login_logo_error: {
        marginTop: -5,
        marginLeft: 40,
    },
    login_submit_button: {
        borderRadius: 999,
        backgroundColor: COLOR_MAIN,
        padding: 10,
    },
    login_submit_button_title: {
        textTransform: 'uppercase',
        fontSize: 15,
    },
    login_icon_modal:{
        marginRight:10,
        marginLeft:0,
    },
    login_form_input_modal:{
        fontSize:15,
    },
    header_modal_profile:{
        flexDirection:'row',
        alignItems:'center',
        padding:15,
        justifyContent:'center',
    },
    header_modal_avatar:{
        
    },
})