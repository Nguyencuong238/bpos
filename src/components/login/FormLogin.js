import React, { Component } from 'react';
import { View, Image, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Input, Button } from 'react-native-elements';
import { R_LOGIN } from '../../reducers/actions';
import { loginCss } from '../../styles/login';
import Icon from "react-native-vector-icons/Ionicons";
// import withAuth from '../../core/auth/withAuth';

class FormLogin extends Component {

    onChangeInput(type, value) {
        const { form_login, dispatch } = this.props;
        const inputs_obj = { ...form_login };
        inputs_obj[type].msg = '';
        inputs_obj[type].value = (type !== 'password') ? value.toLowerCase() : value;
        dispatch({ type: R_LOGIN, payload: inputs_obj });
    }
    //     _signInAsync = async () => {
    //     await AsyncStorage.setItem('userToken', 'abc');
    //     this.props.navigation.navigate('App');
    //   };

    render() {
        const { onSubmit, form_login, loading } = this.props;
        // const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;
        return (
            <View style={loginCss.login_container_top}>
                <View style={loginCss.login_form}>
                    <KeyboardAwareScrollView
                        ref='scroll'
                        scrollEnabled={true}
                    >
                        {/* <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}> */}
                            <View style={loginCss.login_logo}>
                                <Image
                                    source={require('../../../assets/images/logo_bpos.png')}
                                    style={loginCss.login_logo_img}
                                />
                            </View>
                            <Input
                                placeholder='Tên cửa hàng'
                                value={form_login.node_name.value}
                                errorStyle={loginCss.login_logo_error}
                                errorMessage={form_login.node_name.msg}
                                onChangeText={(text) => this.onChangeInput('node_name', text)}
                                placeholderTextColor="#ccc"
                                keyboardType="email-address"
                                spellCheck={false}
                                autoCapitalize="none"
                                returnKeyType='next'
                                autoCorrect={false}
                                returnKeyLabel="Nhập tài khoản"
                                onSubmitEditing={() => this.refs.usernameInput.focus()}
                                containerStyle={loginCss.login_form_control}
                                inputContainerStyle={{ borderBottomWidth: 0 }}
                                inputStyle={loginCss.login_form_input}
                                leftIconContainerStyle={loginCss.login_icon}
                                leftIcon={
                                    <Icon
                                        name='ios-home'
                                        size={18}
                                        color='#ddd'
                                    />
                                }
                            />
                            <Input
                                placeholder='Tài khoản'
                                value={form_login.username.value}
                                errorStyle={loginCss.login_logo_error}
                                errorMessage={form_login.username.msg}
                                onChangeText={(text) => this.onChangeInput('username', text)}
                                placeholderTextColor="#ccc"
                                keyboardType="email-address"
                                spellCheck={false}
                                autoCapitalize="none"
                                returnKeyType='next'
                                autoCorrect={false}
                                returnKeyLabel="Nhập mật khẩu"
                                onSubmitEditing={() => this.refs.passwordInput.focus()}
                                ref="usernameInput"
                                containerStyle={loginCss.login_form_control}
                                inputContainerStyle={{ borderBottomWidth: 0 }}
                                inputStyle={loginCss.login_form_input}
                                leftIconContainerStyle={loginCss.login_icon}
                                leftIcon={
                                    <Icon
                                        name='ios-person'
                                        size={18}
                                        color='#ddd'
                                    />
                                }
                            />
                            <Input
                                placeholder='Mật khẩu'
                                value={form_login.password.value}
                                errorStyle={loginCss.login_logo_error}
                                errorMessage={form_login.password.msg}
                                onChangeText={(text) => this.onChangeInput('password', text)}
                                secureTextEntry
                                spellCheck={false}
                                placeholderTextColor="#ccc"
                                autoCapitalize="none"
                                returnKeyLabel="Đăng nhập"
                                onSubmitEditing={onSubmit}
                                ref="passwordInput"
                                containerStyle={loginCss.login_form_control}
                                inputContainerStyle={{ borderBottomWidth: 0 }}
                                inputStyle={loginCss.login_form_input}
                                leftIconContainerStyle={[loginCss.login_icon, loginCss.login_icon_pass]}
                                leftIcon={
                                    <Icon
                                        name='ios-key'
                                        size={18}
                                        color='#ddd'
                                    />
                                }
                            />
                            <Button
                                title="Đăng nhập"
                                onPress={onSubmit}
                                buttonStyle={loginCss.login_submit_button}
                                containerStyle={loginCss.login_submit_button_box}
                                titleStyle={loginCss.login_submit_button_title}
                                loading={loading}
                            />
                        {/* </KeyboardAvoidingView> */}
                    </KeyboardAwareScrollView>
                </View>
            </View>
        );
    }
}

const mapStateToProps = ({ persist }) => ({
    form_login: persist.form_login,
});
export default connect(mapStateToProps)(FormLogin);
