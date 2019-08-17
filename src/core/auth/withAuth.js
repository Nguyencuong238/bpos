import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { isEmpty, find, filter, forEach, explode } from 'lodash';
import { List } from 'immutable';
import { in_array } from 'locutus/php/array';
import { Text, View } from 'react-native';
import AuthService from './AuthService';
import { R_TOKEN, R_PROFILE, R_DEPOT_LIST } from '../../reducers/actions/index';
import { CHANGE_DEPOT } from '../../reducers/thunk';
import { MyAlert } from '../../components/library/MyAlert';
// import { goToAuth } from '../../components/navigation/navigation';
import { user_api, depot_api } from '../../services/api/fetch';
import Base64 from '../../components/library/Base64';

export default function withAuth(AuthComponent) {
    const Auth = new AuthService();
    //Lắng nghe yêu cầu lấy token
    // eslint-disable-next-line func-names
    // const Firebase = new connectFirebase();
    const nxt = class Authenticated extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                isLoading: true,
                visible_size: false,
                visible_access_denied: false,
            };
            this.interval = null;
            this.widthGreat = 1280;
            this.listPermission = null;
        }

        componentWillMount() {
            const { token } = this.props;
            //Kiểm tra xem token có tồn tại trên server hay không
            user_api({ mtype: 'validate_token', token }).then((data) => {
                if (!isEmpty(data) && data.errors !== undefined) {
                    MyAlert('Đăng nhập lại', 'Vui lòng đăng nhập trước khi sử dụng.');
                    this.props.navigation.navigate('Login');
                }
            });
        }

        componentDidMount() {
            const self = this;
            const { token, profile, dispatch, depot_current, userPermission, userRole } = this.props;
            this.listPermission = List(userPermission);
            const p = this.parseJwt(token);
            // console.log(token)
            // console.log(p)
            if (p !== null) {
                //Kiểm tra thời gian còn không
                const exp = moment().isSameOrAfter(moment.unix(p.exp));
                //const exp = false;
                if (exp) {
                    self.resetLogin();
                    MyAlert('Đăng nhập lại', 'Phiên đăng nhập đã hết hạn. </br> Vui lòng đăng nhập lại.');
                    // goToAuth();
                    this.props.navigation.navigate('Login');

                } else {
                    const { depot } = profile;
                    // const in_depot_id = find(explode(',', depot), (o) => !isEmpty(o));
                    self.getListDepot((e, depots_source) => {
                        let depots_perm = [depot];
                        if (!(parseInt(depot) > 0)) {
                            depots_perm = filter(explode(',', depot), (v) => !isEmpty(v));
                        }
                        //Danh sách kho hàng được phép sử dụng
                        let depots = filter(depots_source, (v) =>
                            depots_perm.includes(v.id.toString()));
                        // let depots = filter(depots_source, (v) => inArray(v.id, depots_perm));
                        //Kiểm tra xem có phải tài khoản to nhất không
                        if (find(userRole, (o) => o.role_id === 1)) {
                            depots_perm = [];
                            forEach(depots_source, (v) => {
                                depots_perm.push(v.id);
                            });
                            depots = depots_source;
                        }
                        dispatch({ type: R_DEPOT_LIST, payload: depots });

                        //Kiểm tra ít nhất 2 dữ liệu phải có điểm chung
                        if (isEmpty(depots) || isEmpty(depots_perm)) {
                            //Không được phép vào kho nào cả
                            self.resetLogin();
                            MyAlert('Không có kho hàng', 'Không tìm thấy kho hàng phù hợp.');
                            // goToAuth();
                        } else if (parseInt(depot_current, 10) === 0 || isNaN(parseInt(depot_current, 10))) {
                            const in_depot_id = find(depots_perm, (o) => !isNaN(parseInt(o, 10)));
                            dispatch(CHANGE_DEPOT(parseInt(in_depot_id, 10))).then(() => {
                                this.checkRoles();
                            });
                        } else if (parseInt(depot_current, 10) !== 0 && in_array(depot_current, depots_perm)) {
                            this.checkRoles();
                        } else if (parseInt(depot_current, 10) !== 0 && !in_array(depot_current, depots_perm)) {
                            const in_depot_id = find(depots_perm, (o) => !isNaN(parseInt(o, 10)));
                            dispatch(CHANGE_DEPOT(parseInt(in_depot_id, 10))).then(() => {
                                this.checkRoles();
                            });
                        } else {
                            //Không được phép vào kho nào cả
                            self.resetLogin();
                            MyAlert('Không có kho hàng', 'Không tìm thấy kho hàng phù hợp.');
                            // goToAuth();
                        }
                        self.setState({ isLoading: false });
                    });
                }
            } else {
                this.props.navigation.navigate('Login');
                MyAlert('Đăng nhập lại', 'Vui lòng đăng nhập trước khi sử dụng.');
            }
        }

        checkRoles() {
        }

        getListDepot(cb) {
            depot_api({
                mtype: 'getall',
                status: 1,
            }).then(({ listDepot }) => {
                if (cb) cb(null, listDepot);
            });
        }

        parseJwt(token) {
            try {
                return JSON.parse(Base64.atob(token.split('.')[1]));
            } catch (e) {
                return null;
            }
        }

        resetLogin() {
            const { dispatch } = this.props;
            dispatch({ type: R_TOKEN, payload: '' });
            dispatch({ type: R_PROFILE, payload: {} });
        }


        refesh_token(token) {
            const { dispatch } = this.props;
            Auth.setToken(token, (e, tk) => {
                dispatch({ type: R_TOKEN, payload: tk });
            });
        }

        listenWebsiteOnline = () => {
            // console.log('===================================');
            // console.log(data);
            // console.log('===================================');
            // this.props.dispatch({ type: R_TOTAL_ONLINE, payload: data });
        }

        render() {
            const { isLoading } = this.state;
            return (
                <View>
                    {isLoading ? (
                        <View>
                            <Text>
                                Xin chào
                            </Text>
                        </View>
                    )
                        : <AuthComponent {...this.props} />
                    }
                </View>

            );
        }
    };
    const mapStateToProps = ({ state, persist }) => ({
        login: state.login,
        token: persist.token,
        profile: persist.profile,
        node_id: persist.node_id,
        depots: persist.depots,
        depot_current: persist.depot_current,
        userRole: persist.userRole,
        userPermission: persist.userPermission,
    });
    return connect(mapStateToProps)(nxt);
}
