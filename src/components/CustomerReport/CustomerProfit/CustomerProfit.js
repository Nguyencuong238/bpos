import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty, forEach, filter, sum } from 'lodash';
import { List, ListItem, Button } from "react-native-elements"
import { View, ScrollView, ActivityIndicator, AsyncStorage, Animated, Text, ListView, Image, StyleSheet, FlatList, RefreshControl, Dimensions } from 'react-native';
import { reportdetail_api } from '../../../services/api/fetch';
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

class CustomerProfit extends Component {
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
            tableHead: ['SL hóa đơn', 'Trả hàng', 'Lợi nhuận'],
            tableHead1: ['SL hóa đơn', 'Tổng tiền trước CK', 'Chiết khấu', 'Sau Ck', 'Phí khác', 'Sl đơn trả', 'Tổng trả', 'Tổng vốn', 'Lợi nhuận', 'Tỷ suất LN'],
            widthArr: [600, 200, 300],
            widthArr1: [100, 200, 100, 100, 100, 100, 100, 100, 100, 100],
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
        // this.changeScreenOrientation();
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
        const { datef, datet, depot, loading } = nextProps.navigation.state.params;
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
            mtype: 'profitCustomer',
            // mtype: 'profitCustomer_Mobile',
            limit,
            offset: 0,
            datef: nxpDatef ? nxpDatef : datef,
            datet: nxpDatet ? nxpDatet : datet,
            // datef: datef,
            // datet: datet,
            total_page,
            page: currentPage,
            depot_id: nxpDepot ? nxpDepot : parseFloat(depot_current),
            mobile: true,
            // depot_id: parseFloat(depot_current),
            // mobile: true,
        };
        if (refreshing) {
            params.datef = moment().startOf('isoWeek').format('YYYY-MM-DD');
            params.datet = moment().format('YYYY-MM-DD');
            params.depot_id = parseFloat(depot_current);
        }
        reportdetail_api(params).then((data) => {
            if (data.status) {
                this.setState({ data: data.order_tables, refreshing: false, loading: false });
            } else {
                this.setState({ data: [], loading: false });
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
            NavigatorService.navigate('CustomerProfit');
        } else if (value === 1) {
            NavigatorService.navigate('LineChartProfit');
        }
    }

    renderColum() {
        const { data } = this.state;
        const tableHead = ['Khách hàng'];
        const tableHead1 = ['STT', 'Tên khách hàng', 'SĐT'];
        const widthArr = [317];
        const widthArr1 = [50, 167, 100];
        const tableData = [];
        const rowData = [];
        forEach(data, (v, k) => {
            const num = k + 1;
            const tmp = [num, v.full_name ? v.full_name : 'Khách vãng lai', v.mobile_phone ? v.mobile_phone : ''];
            rowData.push(tmp);
        })
        tableData.push(rowData);
        const test = [['[1]', '[2]', '[3]'],];
        const test2 = [['', 'Tổng cộng', ''],];
        return (
            <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                <Rows
                    data={test}
                    style={[styles.row]}
                    textStyle={styles.text}
                    widthArr={widthArr1}
                />
                <Rows
                    data={test2}
                    style={[styles.row]}
                    textStyle={styles.text}
                    widthArr={widthArr1}
                />
                <Rows
                    data={tableData[0]}
                    style={[styles.row]}
                    textStyle={styles.text}
                    widthArr={widthArr1}
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
        const totalTttCk = [];
        const totalCk = [];
        const totalSCk = [];
        const totalPk = [];
        const totalSldt = [];
        const totalTtr = [];
        const totalTv = [];
        const totalLN = [];
        const totalTsln = [];

        forEach(data, (v, k) => {
            const pk = parseInt(v.shipping_fee) + parseInt(v.surcharge_fee);
            const ln = (v.sub_total - v.special_amount) - v.paying_amount_th - (v.giavon - v.giavon_th);
            const tv = v.giavon - v.giavon_th;
            const tsln = ((ln / tv) * 100).toFixed(1);
            const tmp = [v.sodon, String(parseInt(v.sub_total)).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ', String(parseInt(v.special_amount)).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ', String(v.sub_total - v.special_amount).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ', String(pk).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ', v.sodon_th, String(v.paying_amount_th).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ', String(tv).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ', String(ln).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ', tv > 0 ? tsln + '%' : 0 + '%'];
            const total1 = parseInt(v.sodon);
            const total2 = parseInt(v.sub_total);
            const total3 = parseInt(v.special_amount);
            const total4 = parseInt(v.sub_total - v.special_amount);
            const total5 = parseInt(pk);
            const total6 = parseInt(v.sodon_th);
            const total7 = parseInt(v.paying_amount_th);
            const total8 = parseInt(tv);
            const total9 = parseInt(ln);
            const total10 = tv > 0 ? parseFloat(tsln) : 0;

            rowData.push(tmp);
            totalHd.push(total1);
            totalTttCk.push(total2);
            totalCk.push(total3);
            totalSCk.push(total4);
            totalPk.push(total5);
            totalSldt.push(total6);
            totalTtr.push(total7);
            totalTv.push(total8);
            totalLN.push(total9);
            totalTsln.push(total10);

        })
        tableData.push(rowData);
        const test = [['[4]', '[5]', '[6]', '[7]', '[8]', '[9]', '[10]', '[11]', '[12]', '[13]'],];
        const test2 = [[sum(totalHd), String(sum(totalTttCk)).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ', String(sum(totalCk)).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ', String(sum(totalSCk)).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ', String(sum(totalPk)).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ', sum(totalSldt), String(sum(totalTtr)).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ', String(sum(totalTv)).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ', String(sum(totalLN)).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ', sum(totalTsln) + '%'],];
        return (
            <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                <Rows
                    data={test}
                    style={[styles.row]}
                    textStyle={styles.text}
                    widthArr={state.widthArr1}
                />
                <Rows
                    data={test2}
                    style={[styles.row]}
                    textStyle={styles.text}
                    widthArr={state.widthArr1}
                />
                {
                    tableData[0].map((rowData, index) => (
                        <Row
                            key={index}
                            data={rowData}
                            widthArr={state.widthArr1}
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

    render() {
        const { refreshing, visibleModal, loading, datef, datet } = this.state;
        this.changeScreenOrientation();
        const tableHead = ['Khách hàng'];
        const tableHead1 = ['STT', 'Tên khách hàng', 'SĐT'];
        const widthArr = [317];
        const widthArr1 = [50, 167, 100];
        return (
            <View style={{ flex: 1, margin: 0, padding: 0 }}>
                {
                    loading ? (
                        <ActivityIndicator style={{ marginTop: 100 }} size="large" color="#28af6b" />
                    ) : (
                            <View style={styles.container}>
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
                                        <View style={{ flex: 0.45 }}>
                                            <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                                                <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.textHeader} />
                                                <Row data={tableHead1} widthArr={widthArr1} style={styles.header} textStyle={styles.textHeader} />
                                            </Table>
                                        </View>
                                        <View style={{ flex: 0.55 }}>
                                            <ScrollView
                                                ref={ref => (this.headerScrollView = ref)}
                                                horizontal={true}
                                                scrollEnabled={false}
                                                scrollEventThrottle={16}
                                            >
                                                <Table borderStyle={{ borderColor: '#C1C0B9' }} >
                                                    <Row data={this.state.tableHead} widthArr={this.state.widthArr} style={styles.header} textStyle={styles.textHeader} />
                                                    <Row data={this.state.tableHead1} widthArr={this.state.widthArr1} style={styles.header} textStyle={styles.textHeader} />
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
                                            <View style={{ flex: 0.45 }}>
                                                {this.renderColum()}
                                            </View>
                                            <View style={{ flex: 0.55 }}>
                                                <ScrollView
                                                    onScroll={this.scrollEvent}
                                                    scrollEventThrottle={16}
                                                    horizontal={true}
                                                    style={{ marginBottom: 100 }}
                                                >
                                                    {this.renderItem()}
                                                </ScrollView>
                                            </View>
                                        </View>
                                    </ScrollView>
                                </View>
                                <ModalSearch visibleModal={visibleModal} />
                            </View>
                        )
                }
            </View>
        );
    }
}

const mapStateToProps = ({ persist }) => ({
    depot_current: persist.depot_current,
});

export default connect(mapStateToProps)(CustomerProfit);

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
