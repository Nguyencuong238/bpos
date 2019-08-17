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

class CustomerDebt extends Component {
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
            tableHead: ['Giao dịch'],
            tableHead1: ['Nợ đầu kỳ', 'Tăng trong kỳ', 'giảm trong kỳ', 'Tổng nợ'],
            widthArr: [400],
            widthArr1: [100, 100, 100, 100, 100, 100, 100],
            // tableHead: ['Khách hàng', 'SĐT', 'Nhân viên bán', 'Giao dịch'],
            // tableHead1: ['', '', '', 'Nợ đầu kỳ', 'Tăng trong kỳ', 'giảm trong kỳ', 'Tổng nợ'],
            // widthArr: [100, 100, 100, 400],
            // widthArr1: [100, 100, 100, 100, 100, 100, 100],
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
        const { datef, datet, depot, loading } = nextProps.navigation.state.params;
        this.setState({ loading });
        this.getList(datef, datet, depot);

    }

    async componentWillUnmount() {
        this.willFocusSubscription.remove();
        await ScreenOrientation.unlockAsync();
    }

    async changeScreenOrientation() {
        await ScreenOrientation.lockAsync(ScreenOrientation.Orientation.LANDSCAPE);

    }

    async getList(nxpDatef = null, nxpDatet = null, nxpDepot = null) {
        const { currentPage, limit, total_page, datef, datet, refreshing } = this.state;
        const { depot_current } = this.props;
        const params = {
            mtype: 'reportDebtCustomer',
            // mtype: 'reportDebtCustomer_Mobile',
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
            NavigatorService.navigate('CustomerDebt');
        } else if (value === 1) {
            NavigatorService.navigate('LineChartDebt');
        }
    }

    renderColum() {
        const { data } = this.state;
        const tableHead = ['STT', 'Mã chứng từ'];
        const widthArr = [50, 90];
        const tableData = [];
        const rowData = [];
        forEach(data, (v, k) => {
            const tmp = [k, 'MCT1234'];
            rowData.push(tmp);
        })
        tableData.push(rowData);
        const tableTest = ['', ''];
        const test = [['[1]', '[2]'],];
        const test2 = [['', 'Tổng cộng'],];
        return (
            <View>
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
            </View>
        )
    }


    renderItem() {
        const state = this.state;
        const { data } = this.state;
        const tableData = [];
        const rowData = [];
        const totalNDK = [];
        const totalTTK = [];
        const totalGTK = [];
        const totalTN = [];
        forEach(data, (v, k) => {
            const tmp = [v.full_name, v.mobile_phone, v.sellername, String(v.nodauky).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ', String(parseInt(v.ghino)).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ', String(v.ghico * (-1)).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ', String(v.nodauky + v.ghino - v.ghico * (-1)).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ'];
            const total1 = parseInt(v.nodauky);
            const total2 = parseInt(v.ghino);
            const total3 = parseInt(v.ghico * (-1));
            const total4 = parseInt(v.nodauky + v.ghino - v.ghico * (-1));
            rowData.push(tmp);
            totalNDK.push(total1);
            totalTTK.push(total2);
            totalGTK.push(total3);
            totalTN.push(total4);
        })
        tableData.push(rowData);
        const test = [['[3]', '[4]', '[5]', '[6]', '[7]', '[8]', '[9]'],];
        const test2 = [['', '', '', String(sum(totalNDK)).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ', String(sum(totalTTK)).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ', String(sum(totalGTK)).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ', String(sum(totalTN)).replace(/(.)(?=(\d{3})+$)/g, '$1,') + 'đ'],];
        return (
            <View>
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
            </View>
        )
    }

    onModal() {
        const { visibleModal } = this.state;
        this.setState({ visibleModal: !visibleModal });
    }

    render() {
        const { refreshing, visibleModal, loading, datef, datet } = this.state;
        this.changeScreenOrientation();
        const tableHead = ['STT', 'Mã chứng từ'];
        const tableTest = ['', ''];
        const widthArr = [50, 90];
        return (
            // <View style={{ flex: 1, margin: 0, padding: 0 }}>
            //     {
            //         loading
            //             ?
            //             <ActivityIndicator style={{ marginTop: 100 }} size="large" color="#28af6b" />
            //             : <View style={styles.container}>
            //                 <View style={styles.table}>
            //                     <View style={{ flexDirection: 'row' }}>
            //                         <View style={{ flex: 0.2 }}>
            //                             <Table borderStyle={{ borderColor: '#C1C0B9' }}>
            //                                 <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.textHeader} />
            //                                 <Row data={tableTest} widthArr={widthArr} style={styles.header} textStyle={styles.textHeader} />
            //                             </Table>
            //                         </View>
            //                         <View style={{ flex: 0.8 }}>
            //                             <ScrollView
            //                                 ref={ref => (this.headerScrollView = ref)}
            //                                 horizontal={true}
            //                                 scrollEnabled={false}
            //                                 scrollEventThrottle={16}
            //                             >
            //                                 <Table borderStyle={{ borderColor: '#C1C0B9' }} >
            //                                     <Row data={this.state.tableHead} widthArr={this.state.widthArr} style={styles.header} textStyle={styles.textHeader} />
            //                                     <Row data={this.state.tableHead1} widthArr={this.state.widthArr1} style={styles.header} textStyle={styles.textHeader} />
            //                                 </Table>
            //                             </ScrollView>
            //                         </View>
            //                     </View>
            //                 </View>
            //                 <View style={styles.table}>
            //                     <ScrollView
            //                         refreshControl={
            //                             <RefreshControl
            //                                 refreshing={refreshing}
            //                                 onRefresh={this._onRefresh}
            //                             />
            //                         }
            //                     >
            //                         <View style={{ flexDirection: 'row' }}>
            //                             <View style={{ flex: 0.2 }}>
            //                                 {this.renderColum()}
            //                             </View>
            //                             <View style={{ flex: 0.8 }}>
            //                                 <ScrollView
            //                                     onScroll={this.scrollEvent}
            //                                     scrollEventThrottle={16}
            //                                     horizontal={true}
            //                                     style={{ marginBottom: 100 }}
            //                                 >
            //                                     {this.renderItem()}
            //                                 </ScrollView>
            //                             </View>
            //                         </View>
            //                     </ScrollView>
            //                 </View>
            //                 <ModalSearch visibleModal={visibleModal} />
            //             </View>
            //     }
            // </View>
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
                                    <View style={{ flex: 0.2 }}>
                                        <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                                            {/* <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.textHeader} /> */}
                                            {/* <Row data={tableTest} widthArr={widthArr} style={styles.header} textStyle={styles.textHeader} /> */}
                                            <TableWrapper style={{ flexDirection: 'row' }}>
                                                <Col data={['STT']} style={styles.colHeader1} heightArr={[100]} textStyle={styles.textHeader} />
                                                <Col data={['Mã chứng từ']} style={styles.colHeader2} heightArr={[100]} textStyle={styles.textHeader} />
                                            </TableWrapper>
                                        </Table>
                                    </View>
                                    <View style={{ flex: 0.8 }}>
                                        <ScrollView
                                            ref={ref => (this.headerScrollView = ref)}
                                            horizontal={true}
                                            scrollEnabled={false}
                                            scrollEventThrottle={16}
                                        >
                                            <Table borderStyle={{ borderColor: '#C1C0B9' }} >
                                                <TableWrapper style={{ flexDirection: 'row', width: 700 }}>
                                                    <Col data={['Khách hàng']} style={styles.colHeader3} heightArr={[100]} textStyle={styles.textHeader} />
                                                    <Col data={['SĐT']} style={styles.colHeader3} heightArr={[100]} textStyle={styles.textHeader} />
                                                    <Col data={['Nhân viên bán hàng']} style={styles.colHeader3} heightArr={[100]} textStyle={styles.textHeader} />
                                                    <TableWrapper style={{ flexDirection: 'column', width: 400 }}>
                                                        <Row data={this.state.tableHead} widthArr={this.state.widthArr} style={styles.header} textStyle={styles.textHeader} />
                                                        <Row data={this.state.tableHead1} widthArr={this.state.widthArr1} style={styles.header} textStyle={styles.textHeader} />
                                                    </TableWrapper>
                                                </TableWrapper>
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
                                        <View style={{ flex: 0.2 }}>
                                            {this.renderColum()}
                                        </View>
                                        <View style={{ flex: 0.8 }}>
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
                }
            </View>
        );
    }
}

const mapStateToProps = ({ persist }) => ({
    depot_current: persist.depot_current,
});

export default connect(mapStateToProps)(CustomerDebt);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    table: { backgroundColor: '#fff' },
    header: { height: 50, backgroundColor: '#28af6b' },
    colHeader1: { flex: 0.355, backgroundColor: '#28af6b' },
    colHeader2: { flex: 0.645, backgroundColor: '#28af6b' },
    colHeader3: { width: 100, backgroundColor: '#28af6b' },
    text: { textAlign: 'center', fontWeight: '600' },
    dataWrapper: { marginTop: -1 },
    row: { height: 40, backgroundColor: '#E7E6E1' },
    textHeader: { textAlign: 'center', fontWeight: '600', color: '#fff' },
    // container: {
    //     flex: 1,
    //     margin: 5,
    // },
    // table: { flex: 1, backgroundColor: '#fff' },
    // header: { height: 50, backgroundColor: '#28af6b' },
    // text: { textAlign: 'center', fontWeight: '600' },
    // dataWrapper: { marginTop: -1 },
    // row: { height: 40, backgroundColor: '#E7E6E1' },
    // textHeader: { textAlign: 'center', fontWeight: '600', color: '#fff' },
});
