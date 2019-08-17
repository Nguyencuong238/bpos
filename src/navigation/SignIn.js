import React, { Component } from 'react';
import axios from 'axios';
import { find } from 'lodash';
import { connect } from 'react-redux';
import { Text, View, Image, findNodeHandle, ImageBackground, StatusBar, AsyncStorage, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Input, Button } from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons";
import { isEmpty } from 'lodash';
import { loginCss } from '../styles/login';
import { waterfall } from 'async';
import { MyAlert, Loading } from '../components/library/MyAlert';
import AuthService from '../core/auth/AuthService';
import FormLogin from '../components/login/FormLogin';
import { R_LOGIN, R_DEPOT_LIST, R_DEPOT_CURRENT } from '../reducers/actions';
import { CHANGE_NODE_ID, CHANGE_TOKEN, CHANGE_PROFILE, CHANGE_ROLE, CHANGE_PERMISSION, CHANGE_NODE_INFO } from '../reducers/thunk/index';
import { role_api, permission_api, node_info, user_api, depot_api } from '../services/api/fetch';
import NavigatorService from '../services/NavigatorService';
import { showMessage } from "react-native-flash-message";

const auth = new AuthService();

class Login extends Component {

    static navigatorStyle = {
        navBarHidden: true,
        tabBarHidden: true
    };
    static backButtonHidden = false;
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            showLogo: true,
            inputs: {
                node_name: { value: '', validate: true, msg: null },
                username: { value: '', validate: true, msg: null },
                password: { value: '', validate: true, msg: null },
            },
            viewRef: null
        };
    }

    imageLoaded() {
        this.setState({ viewRef: findNodeHandle(this.backgroundImage) });
    }

    validateEmail(email) {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return filter.test(email);
    }

    onLocalSubmit = () => {
        const { form_login, dispatch } = this.props;
        const inputs_obj = Object.assign({}, form_login);
        waterfall([
            (callback) => {
                if (inputs_obj.node_name.value.length >= 6) {
                    inputs_obj.node_name.validate = true;
                } else {
                    inputs_obj.node_name.validate = false;
                    inputs_obj.node_name.msg = 'Tên doanh nghiệp phải lớn hơn 6 kí tự';
                }
                dispatch({ type: R_LOGIN, payload: inputs_obj });
                if (inputs_obj.node_name.validate) callback(null, 'next');
            },
            (next, callback) => {
                if (inputs_obj.username.value.length > 0) {
                    inputs_obj.username.validate = true;
                } else {
                    inputs_obj.username.validate = false;
                    inputs_obj.username.msg = 'Tài khoản không được để trống';
                }
                dispatch({ type: R_LOGIN, payload: inputs_obj });
                if (inputs_obj.username.validate) callback(null, 'next');
            },
            (next, callback) => {
                if (inputs_obj.password.value.length > 0) {
                    inputs_obj.password.validate = true;
                } else {
                    inputs_obj.password.validate = false;
                    inputs_obj.password.msg = 'Mật khẩu không để trống';
                }
                dispatch({ type: R_LOGIN, payload: inputs_obj });
                if (inputs_obj.password.validate) callback(null, 'next');
            },
        ], () => {
            const params = {
                node_name: inputs_obj.node_name.value,
                username: inputs_obj.username.value,
                password: inputs_obj.password.value,
            };
            this.setState({ loading: true });
            this.onLogin(params, () => {
                this.setState({ loading: false });
            });
        });
    }

    onLogin(params, cb) {
        const { dispatch, depot_current } = this.props;
        const params_login = { ...params, mtype: 'login', from_device: 'mobile' };
        waterfall([
            (callback) => {
                auth.login(params_login).then((data) => {
                    if (data.errors !== undefined) {
                        if (cb) cb();
                        (data.errors.message[0])
                            ? showMessage({
                                message: data.errors.message[0],
                                description: "",
                                type: "danger",
                            })
                            :
                            showMessage({
                                message: data.errors.message['node_name'],
                                description: "",
                                type: "danger",
                            });
                        this.setState({ loading: false });
                    } else {
                        const { node_id } = data;
                        dispatch(CHANGE_NODE_ID(parseInt(node_id, 10))).then(() => {
                            callback(null, data);
                        });
                    }
                });
            },
            (data, callback) => {
                const { token } = data;
                auth.setToken(token, () => {
                    dispatch(CHANGE_TOKEN(token)).then(() => {
                        callback(null, data);
                    });
                });
            },
            (data, callback) => {
                const { token } = data;
                auth.getInfo({
                    mtype: 'profile_info',
                    token,
                }).then((user_info) => {
                    const { depot } = user_info;
                    let depots_perm = [depot];
                    if ( !(parseInt(depot) > 0)) {
                        depots_perm = filter(explode(',', depot), (v) => !isEmpty(v));
                    } 
                    if (parseInt(depot_current, 10) === 0 || isNaN(parseInt(depot_current, 10))) {
                        const in_depot_id = find(depots_perm, (o) => !isNaN(parseInt(o, 10)));
                        dispatch({ type: R_DEPOT_CURRENT, payload: in_depot_id });
                    } 
                    else if (parseInt(depot_current, 10) !== 0 && depots_perm.includes(depot_current)) {
                        // this.checkRoles();
                    } else if (parseInt(depot_current, 10) !== 0 && !depots_perm.includes(depot_current)) {
                        const in_depot_id = find(depots_perm, (o) => !isNaN(parseInt(o, 10)));
                        dispatch({ type: R_DEPOT_CURRENT, payload: in_depot_id });
                    }
                    dispatch(CHANGE_PROFILE(user_info)).then(() => {
                        callback(null, data, user_info);
                    });
                });
            },
            (data, user_info, callback) => {
                const { personnel_id } = user_info;
                role_api({
                    mtype: 'getAllRoleByUser',
                    user_id: personnel_id,
                }).then(({ role }) => {
                    dispatch(CHANGE_ROLE(role !== undefined ? role : [])).then(() => {
                        callback(null, data, user_info, role);
                    });
                });
            },
            (data, user_info, role, callback) => {
                const { personnel_id } = user_info;
                permission_api({
                    mtype: 'getAllPermissionByUser',
                    user_id: personnel_id,
                }).then(({ permission }) => {
                    dispatch(CHANGE_PERMISSION(permission !== undefined ? permission : [])).then(() => {
                        callback(null, data, user_info, role, permission);
                    });
                });
            },
            (data, user_info, role, permission, callback) => {
                node_info({
                    mtype: 'node_data',
                }).then(({ node_data }) => {
                    dispatch(CHANGE_NODE_INFO(node_data !== undefined ? node_data : {})).then(() => {
                        callback(null, node_data);
                    });
                });
            },
            (data, callback) => {
                depot_api({
                    mtype: 'getall',
                    status: 1,
                }).then(({ listDepot }) => {
                    if (listDepot) {
                        showMessage({
                            message: "Đăng nhập thành công.",
                            description: "",
                            type: "success",
                        });
                        dispatch({ type: R_DEPOT_LIST, payload: listDepot });
                        callback(null);
                    } else {
                        showMessage({
                            message: "Không có kho hàng hợp lệ.",
                            description: "",
                            type: "error",
                        });
                        this.setState({ loading: false });
                    }
                });
            },
        ], () => {
            if (cb) cb();
            NavigatorService.navigate('App');
        });
    }

    render() {
        const { loading } = this.state;
        return (
            <ImageBackground
                style={loginCss.imgBackground}
                resizeMode='cover'
                source={require('../../assets/images/bg_bpos_1.png')}
                onLoadEnd={this.imageLoaded.bind(this)} ref={(img) => { this.backgroundImage = img; }}>
                <StatusBar
                    backgroundColor="blue"
                    barStyle="light-content"
                />
                <View style={loginCss.login_container}>
                    <FormLogin {...this.props} onSubmit={this.onLocalSubmit} loading={loading} />
                    <View style={loginCss.login_container_bottom}>
                        <Text style={loginCss.login_copyright}>Copyright © 2019 Phát triển bởi BPOS Team</Text>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}

const mapStateToProps = ({ persist }) => ({
    form_login: persist.form_login,
    token: persist.token,
    depot_current: persist.depot_current,
});

export default connect(mapStateToProps)(Login);