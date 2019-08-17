import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { ActivityIndicator,  StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { isEmpty } from 'lodash';
import { personnel_api } from '../../../services/api/fetch';
import NumberFormat from 'react-number-format';
import ModalSearch from './ModalSearch';
import { Ionicons } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/Ionicons';

class Personnel_Detail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            refreshing: false,
            visibleModal: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        console.log(nextProps.navigation);
        const {personnel_id} = nextProps.navigation.state.params;
        this.setState({personnel_id}, () => {
            this.getData();
        });
    }

    getData() {
        const { personnel } = this.state;
        this.setState({ loading: true });
        personnel_api({ mtype: 'getById', personnel_id: 1 }).then(({ personnel }) => {
            console.log(personnel);
            this.setState({ personnel, loading: false });
        });
    }

    onDelete() {

    }

    onReset() {

    }

    render() {
        const { personnel, refreshing, visibleModal, loading } = this.state;
        return (
            <View style={{flex: 1}}>
                {!loading ? (
                    <View style={{ flex: 1 }}>
                        <View>
                            <View>
                                <Image
                                    style={{width: 50, height: 50}}
                                    source={{uri: 'https://facebook.github.io/react-native/img/tiny_logo.png'}}
                                />
                            </View>
                            <View>
                                <Text>Vu minh duc</Text>
                                <Text>0989898983</Text>
                                <Text>abc@gmail.com</Text>
                            </View>
                        </View>
                        <View>
                            <View>
                                <View>
                                    <Icon name='md-chatboxes' size={17} color='#000' />
                                    <Text>Nhắn tin</Text>
                                </View>
                                <View>
                                    <Icon name='ios-phone-portrait-outline' size={17} color='#000' />
                                    <Text>Gọi điện</Text>
                                </View>
                                <View>
                                    <Icon name='md-mail' size={17} color='#000' />
                                    <Text>Email</Text>
                                </View>
                            </View>
                            <View>
                                <Text>Địa chỉ</Text>
                            </View>
                            <View>
                                <Text>Ngày sinh</Text>
                            </View>
                        </View>
                        <View>
                            <View>
                                <View>
                                    <Icon name='md-nuclear' size={17} color='#000' />
                                    <Text>Phân quyền nhân viên</Text>
                                    <Icon name='ios-information-circle' size={17} color='#000' />
                                </View>
                            </View>
                            <View>
                                <Text>Nhóm quyền</Text>
                                <Text>Quản trị cao cấp</Text>
                            </View>
                            <View>
                                <Text>Chi nhánh làm việc</Text>
                                <Text>Chi nhánh trung tâm</Text>
                            </View>
                        </View>
                        <View>
                            <Text>Trạng thái</Text>
                            <View>
                                <View style={{width: 2, height: 2, color: '#eee'}}/>
                                <Text>Đang làm việc</Text>
                            </View>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => this.onDelete()}>
                                <Text>Xóa nhân viên</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => this.onReset()}>
                                <Text>Reset</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                        <View style={styles.spin}>
                            <ActivityIndicator />
                        </View>
                    )}
            </View>
        );
    }
}

const mapStateToProps = ({ persist }) => ({
    depot_current: persist.depot_current,
});

export default connect(mapStateToProps)(Personnel_Detail);

const styles = StyleSheet.create({
    list_personnel: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        paddingRight: 5,
    },
    nodata: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    separator: {
        height: 1,
        width: "100%",
        backgroundColor: "#eee",
    },
    spin: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    fullname: {
        fontWeight: 'bold',
        paddingBottom: 10,
    },
    phone: {
        paddingBottom: 10,
        color: '#919191'
    },
    switch: {
        flex: 1,
        justifyContent: 'flex-start'
    },
    info_personnel: {
        flex: 1,
        flexDirection: 'column'
    }
});
