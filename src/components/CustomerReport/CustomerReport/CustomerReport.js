import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty, forEach, filter, sum } from 'lodash';
import { List, ListItem, Button } from "react-native-elements"
import { View, ScrollView, ActivityIndicator, AsyncStorage, Animated, Text, ListView, Image, StyleSheet, FlatList, RefreshControl, Dimensions } from 'react-native';
import { reportCutomer_api } from '../../../services/api/fetch';
import NumberFormat from 'react-number-format';
import Icon from "react-native-vector-icons/Ionicons";
import NavigatorService from '../../../services/NavigatorService';
import RNPickerSelect from 'react-native-picker-select';
import { showMessage } from "react-native-flash-message";
import { dashboardCss } from '../../../styles/dashboard';
import { ScreenOrientation } from 'expo';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import moment from 'moment';
import ModalSearch from './ModalSearch';
import { NavigationEvents } from 'react-navigation';
import { Ionicons } from "@expo/vector-icons";

class CustomerReport extends Component {
    constructor(props) {
        super(props);
        this.headerScrollView = null;
        this.scrollPosition = new Animated.Value(0);
        this.scrollEvent = Animated.event(
            [{ nativeEvent: { contentOffset: { x: this.scrollPosition } } }],
        );
        this.state = {
            loading: false,
            data: [],
            page: 1,
            limit: 20,
            total_page: 0,
            currentPage: 1,
            refreshing: false,
            productSearch: null,
            tableHead: ['SĐT', 'Cấp độ', 'Nhóm', 'Điểm hiện có', 'Tổng số HD', 'Lần mua gần nhất', 'Tổng tiền HD', 'Số SP trả', 'Tổng tiền trả', 'Doanh thu thuần'],
            widthArr: [100, 80, 100, 50, 50, 150, 100, 50, 100, 100],
            datef: moment().startOf('isoWeek').format('YYYY-MM-DD'),
            datet: moment().format('YYYY-MM-DD'),
            visibleModal: false,
            chart: 0,
        };
    }

    async componentDidMount() {
        this.listener = this.scrollPosition.addListener(position => {
            this.headerScrollView.scrollTo({ x: position.value, animated: false });
        });
        this.getList();
        this.changeScreenOrientation();
        const { navigation } = this.props;
        await navigation.setParams({
            dispatch: this.onModal.bind(this)
        });
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            () => {
                this.getList();
            }
        );
    }


    componentWillReceiveProps(nextProps) {
        const { navigation } = nextProps;
        const { datef, datet, depot, loading } = nextProps.navigation.state.params;
        console.log(datef);
        console.log(datet);
        this.setState({ loading });
        this.getList(datef, datet, depot);
    }

    componentWillUnmount() {
        this.willFocusSubscription.remove();
    }

    async changeScreenOrientation() {
        await ScreenOrientation.lockAsync(ScreenOrientation.Orientation.LANDSCAPE);

    }

    async getList(nxpDatef = null, nxpDatet = null, nxpDepot = null) {
        const { currentPage, limit, total_page, datef, datet, refreshing } = this.state;
        const { depot_current } = this.props;
        const params = {
            mtype: 'reportOrder',
            limit,
            offset: 0,
            datef: nxpDatef ? nxpDatef : datef,
            datet: nxpDatet ? nxpDatet : datet,
            total_page,
            page: currentPage,
            depot_id: nxpDepot ? nxpDepot : parseFloat(depot_current),
            mobile: true,
        };
        if (refreshing) {
            params.datef = moment().startOf('isoWeek').format('YYYY-MM-DD');
            params.datet = moment().format('YYYY-MM-DD');
            params.depot_id = parseFloat(depot_current);
        }
        reportCutomer_api(params).then((data) => {
            console.log(data);
            if (data.status) {
                this.setState({ data: data.order_tables, refreshing: false, loading: false });
            }
        });
    }

    async onChangePiker(itemValue) {
        await this.setState({ sort: itemValue });
        this.getList();
    }

    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.getList();
    }

    renderColum() {
        const { data } = this.state;
        const tableHead = ['STT', 'Họ tên'];
        const widthArr = [50, 160];
        const tableData = [];
        const rowData = [];
        forEach(data, (v, k) => {
            const num = k + 1;
            const tmp = [num, v.ten_kh];
            rowData.push(tmp);
        })
        tableData.push(rowData);
        const test = [['', ''],];
        const test2 = [['', 'Tổng cộng'],];
        return (
            <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                <Rows
                    data={test}
                    style={[styles.row]}
                    textStyle={styles.text}
                    widthArr={widthArr}
                />
                <Rows
                    data={test2}
                    style={[styles.row]}
                    textStyle={styles.text}
                    widthArr={widthArr}
                />
                <Rows
                    data={tableData[0]}
                    style={[styles.row]}
                    textStyle={styles.text}
                    widthArr={widthArr}
                />
            </Table>
        )
    }


    renderItem() {
        const state = this.state;
        const { data } = this.state;
        const tableData = [];
        const rowData = [];
        const totalHd = [];
        const totalThd = [];
        const totalTt = [];
        const totalDt = [];
        forEach(data, (v, k) => {
            const tmp = [v.sdt, v.level, v.name_tag, v.tong_diem ? v.tong_diem : 0, v.sl_hd ? v.sl_hd : 0, v.last_time, v.tong_banhang ? String(parseInt(v.tong_banhang)).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ' : 0, v.sp_th ? v.sp_th : 0, String(v.tong_th).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ', String((v.tong_banhang - v.tong_th)).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ'];
            const total1 = v.tong_banhang ? parseInt(v.tong_banhang) : 0;
            const total2 = v.tong_th;
            const total3 = v.tong_banhang - v.tong_th;
            const total4 = v.sl_hd;
            rowData.push(tmp);
            totalHd.push(total4);
            totalThd.push(parseInt(total1));
            totalTt.push(total2);
            totalDt.push(total3);
        })
        tableData.push(rowData);
        const test = [['', '', '', '', '', '', '[1]', '', '[2]', '[3=1-2]'],];
        const test2 = [['', '', '', '', sum(totalHd), '', String(sum(totalThd)).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ', '', String(sum(totalTt)).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ', String(sum(totalDt)).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ'],];
        return (
            <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                <Rows
                    data={test}
                    style={[styles.row]}
                    textStyle={styles.text}
                    widthArr={state.widthArr}
                />
                <Rows
                    data={test2}
                    style={[styles.row]}
                    textStyle={styles.text}
                    widthArr={state.widthArr}
                />
                {
                    tableData[0].map((rowData, index) => (
                        <Row
                            key={index}
                            data={rowData}
                            widthArr={state.widthArr}
                            style={[styles.row]}
                            textStyle={styles.text}
                        />
                    ))
                }
            </Table>
        )
    }

    onModal() {
        const { visibleModal } = this.state;
        this.setState({ visibleModal: !visibleModal });
    }

    kindReport() {
        let items = [
            {
                label: 'Chi tiết',
                value: 0,
            }, {
                label: 'Biểu đồ',
                value: 1,
            }
        ];

        return items;
    }

    onChangeKind(value) {
        this.setState({ chart: value });
        if (value === 0) {
            NavigatorService.navigate('CustomerReport');
        } else if (value === 1) {
            NavigatorService.navigate('LineChart');
        }
    }

    render() {
        const { refreshing, visibleModal, loading, datef, datet } = this.state;
        this.changeScreenOrientation();
        const tableHead = ['STT', 'Họ tên'];
        const widthArr = [50, 160];
        return (
            <View style={{ flex: 1, margin: 0, padding: 0 }}>
                {
                    loading
                        ?
                        <ActivityIndicator style={{ marginTop: 100 }} size="large" color="#28af6b" />
                        : <View style={styles.container}>
                            <View style={{ flexDirection: 'row', backgroundColor: '#E7E6E1' }}>
                                <View style={{ flex: 50 }}>
                                    <RNPickerSelect
                                        placeholder={{
                                            label: 'Chọn loại hiển thị',
                                            value: null,
                                        }}
                                        items={this.kindReport()}
                                        onValueChange={(value) => this.onChangeKind(value)}
                                        style={{
                                            iconContainer: {
                                                top: 10,
                                                right: 12,
                                            },
                                        }}
                                        value={parseInt(this.state.chart)}
                                        Icon={() => {
                                            return <Ionicons name="md-arrow-dropdown" size={24} color="gray" />;
                                        }}
                                    />
                                </View>
                                <View style={{ flex: 50, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ fontSize: 14, textAlign: 'center' }}>Từ ngày {datef} đến ngày {datet}</Text>
                                </View>
                            </View>
                            <View style={styles.table}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 0.3 }}>
                                        {/* <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                                            <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.textHeader} />
                                            <Row data={tableTest} widthArr={widthArr} style={styles.header} textStyle={styles.textHeader} />
                                        </Table> */}
                                        <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                                            <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.textHeader} />
                                        </Table>
                                    </View>
                                    <View style={{ flex: 0.7 }}>
                                        <ScrollView
                                            ref={ref => (this.headerScrollView = ref)}
                                            horizontal={true}
                                            scrollEnabled={false}
                                            scrollEventThrottle={16}
                                        >
                                            {/* <Table borderStyle={{ borderColor: '#C1C0B9' }} >
                                                <Row data={this.state.tableHead} widthArr={this.state.widthArr} style={styles.header} textStyle={styles.textHeader} />
                                                <Row data={this.state.tableHead1} widthArr={this.state.widthArr1} style={styles.header} textStyle={styles.textHeader} />
                                            </Table> */}
                                            <Table borderStyle={{ borderColor: '#C1C0B9' }} >
                                                <Row data={this.state.tableHead} widthArr={this.state.widthArr} style={styles.header} textStyle={styles.textHeader} />
                                            </Table>
                                        </ScrollView>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.table}>
                                <ScrollView
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={refreshing}
                                            onRefresh={this._onRefresh}
                                        />
                                    }
                                >
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 0.3 }}>
                                            {this.renderColum()}
                                        </View>
                                        <View style={{ flex: 0.7 }}>
                                            <ScrollView
                                                onScroll={this.scrollEvent}
                                                scrollEventThrottle={16}
                                                horizontal={true}
                                                style={{ marginBottom: 50 }}
                                            >
                                                {this.renderItem()}
                                            </ScrollView>
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                            <ModalSearch visibleModal={visibleModal} />
                        </View>
                }
            </View>
        )
    }
}

const mapStateToProps = ({ persist }) => ({
    depot_current: persist.depot_current,
});

export default connect(mapStateToProps)(CustomerReport);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    table: { backgroundColor: '#fff' },
    header: { height: 50, backgroundColor: '#28af6b' },
    text: { textAlign: 'center', fontWeight: '600' },
    dataWrapper: { marginTop: -1 },
    row: { height: 40, backgroundColor: '#E7E6E1' },
    textHeader: { textAlign: 'center', fontWeight: '600', color: '#fff' },
});
