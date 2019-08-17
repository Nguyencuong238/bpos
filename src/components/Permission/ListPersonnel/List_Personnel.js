import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { ScreenOrientation } from 'expo';
import { Animated, ActivityIndicator, FlatList, StyleSheet, Text, View, Switch, TouchableOpacity } from 'react-native';
import { isEmpty } from 'lodash';
import { personnel_api } from '../../../services/api/fetch';
import NumberFormat from 'react-number-format';
import ModalSearch from './ModalSearch';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from "@expo/vector-icons";

const NUM_ROWS_STEP = 20;
class List_Personnel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            refreshing: false,
            visibleModal: false,
            limit: NUM_ROWS_STEP,
            offset: 0,
            switchValue: true,
        };
    }

    componentDidMount() {
        this.getData();
        const { navigation } = this.props;
        navigation.setParams({
            dispatch: this.onModal
        });
    }

    getData() {
        const { name, email, phone, role, limit, offet } = this.state;
        this.setState({ loading: true });
        personnel_api({ mtype: 'getAll', name, email, phone, role, limit, offet }).then(({ personnels }) => {
            this.setState({ personnels, loading: false });
        });
    }

    handleFilter = (keywords) => {
        const { name, email, phone, role } = keywords;
        this.setState({ name, email, phone, role }, () => this.getData());
    }

    onModal = () => {
        const { visibleModal } = this.state;
        this.setState({ visibleModal: !visibleModal });
    }

    toggleSwitch = (e, id, k) => {
        const {personnels} = this.state;
        const status = e ? 1 : 0;
        personnels[k].status = status;
        this.setState({switchValue: e, personnels});
        personnel_api({ mtype: 'status', personnel_id: id, status }).then(() => {});
    }

    renderItem(v, k) {
        return (
            <TouchableOpacity
                style={styles.list_personnel}
                onPress={() => this.props.navigation.navigate('Personnel_Detail', {
                    personnel_id: v.personnel_id
                })}
            >
                <View style={styles.info_personnel}>
                    <Text style={styles.fullname}>{v.full_name}</Text>
                    <Text style={styles.phone}>{v.mobile_number}</Text>
                    <Text style={{color: '#919191'}}>{v.email_private}</Text>
                </View>
                <View style={styles.switch}>
                    <Switch
                        onValueChange = {(e) => this.toggleSwitch(e, v.personnel_id, k)}
                        value = {v.status ? true : false}
                    />
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const { personnels, refreshing, visibleModal, loading } = this.state;
        return (
            <View style={{flex: 1}}>
                {!loading ? (
                    <View style={{ flex: 1 }}>
                        {!isEmpty(personnels) ? (
                            <FlatList
                                data={personnels}
                                renderItem={({item, index}) => this.renderItem(item, index)}
                                refreshing={refreshing}
                                onRefresh={() => this.getData()}
                                keyExtractor={(item) => item.personnel_id}
                                ItemSeparatorComponent={() => <View style={styles.separator} />}
                            />
                        ) : (
                                <View style={styles.nodata}>
                                    <Text style={{ color: '#b06a13' }}>Không có dữ liệu...</Text>
                                </View>
                            )}
                        <ModalSearch
                            visibleModal={visibleModal}
                            handleFilter={this.handleFilter}
                            onModal={this.onModal}
                        />
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

export default connect(mapStateToProps)(List_Personnel);

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
