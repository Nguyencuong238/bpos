import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { ScreenOrientation } from 'expo';
import { Animated, ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View, RefreshControl, Dimensions, BackHandler } from 'react-native';
import { isEmpty, sumBy } from 'lodash';
import { report_api } from '../../../services/api/fetch';
import NumberFormat from 'react-number-format';
import ModalSearch from './ModalSearch';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from "@expo/vector-icons";

const NUM_ROWS_STEP = 20;
const CELL_HEIGHT = 50;
const HEAD_HEIGHT = 60;
const borderColor = '#e7e6e1';
const WIDTH = [60, 110, 120, 120, 120, 120, 120, 120, 130];
const FIELDS_WIDTH = [360, 360, 130];

class Report extends React.Component {
    constructor(props) {
        super(props);
        this.headerScrollView = null;
        this.scrollPosition = new Animated.Value(0);
        this.scrollEvent = Animated.event(
            [{ nativeEvent: { contentOffset: { x: this.scrollPosition } } }],
            { useNativeDriver: false }
        );

        this.state = {
            count: NUM_ROWS_STEP,
            loading: false,
            refreshing: false,
            visibleModal: false,
            depot_id: props.depot_current,
            datef: moment().subtract(1, 'months').format('YYYY-MM-DD'),
            datet: moment().format('YYYY-MM-DD'), 
        };
    }

    componentDidMount() {
        ScreenOrientation.allow(ScreenOrientation.Orientation.LANDSCAPE);

        this.getData();
        this.listener = this.scrollPosition.addListener(position => {
            this.headerScrollView.scrollTo({ x: position.value, animated: false });
        });

        const { navigation } = this.props;
        navigation.setParams({
            dispatch: this.onModal
        });
    }

    getData() {
        const {depot_id, datef, datet } = this.state;
        this.setState({loading: true});

        report_api({mtype: 'reportCashFlow', depot_id, datef, datet, is_mobile: 1}).then((res) => {
            const date = Object.keys(res);
            const data = Object.values(res);
            this.setState({ data, date, loading: false });
        });
    }

    handleFilter = (depot_id, datef, datet) => {
        this.setState({ depot_id, datef, datet }, () => this.getData());
    }

    onModal = () => {
        const { visibleModal } = this.state;
        this.setState({ visibleModal: !visibleModal });
    }

    formatNumber(v) {
        return (
            <NumberFormat
                thousandSeparator={'.'}
                decimalSeparator={','}
                value={parseInt(v)}
                displayType={'text'}
                suffix={'đ'}
                renderText={value => <Text>{value}</Text>}
            />
        )
    }

    formatCell(value, width) {
        return (
            <View key={value} style={[styles.cell, {width}]}>
                <Text>{value}</Text>
            </View>
        );
    }

    formatRow = section => {
        const { item, index } = section;
        const cells = [];

        if (index === 0) {
            item.forEach((v, k) => cells.push(this.formatCell(v, WIDTH[k+2] )));
        } else {
            item.tm = item.thu_tm - item.chi_tm;
            item.ck = item.thu_ck - item.chi_ck;
            item.tong = item.tm + item.ck;
            const label = ['thu_tm', 'chi_tm', 'tm', 'thu_ck', 'chi_ck', 'ck', 'tong'];
            label.forEach((v, k) => cells.push(this.formatCell(this.formatNumber(item[v]), WIDTH[k+2])));
        }

        return <View style={styles.row}>{cells}</View>;
    };

    formatHeader() {
        return (
            <View style={styles.header}>
                <View style={[styles.cell, {width: WIDTH[0], height: HEAD_HEIGHT}]}>
                    <Text style={styles.white}>STT</Text>
                </View>
                <View style={[styles.cell, {width: WIDTH[1], height: HEAD_HEIGHT}]}>
                    <Text style={styles.white}>Thời gian</Text>
                </View>
                <ScrollView
                    ref={ref => (this.headerScrollView = ref)}
                    horizontal={true}
                    scrollEnabled={false}
                    scrollEventThrottle={16}
                >
                    <View style={[styles.cell, {width: FIELDS_WIDTH[0], flexDirection: 'column', borderRightWidth: 0, height: HEAD_HEIGHT}]}>
                        <View style={styles.cell_head}>
                            <Text style={styles.white}>Giao dịch tiền mặt</Text>
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <View style={{width: WIDTH[2]}}>
                                <Text style={styles.cell_child}>Thu (TM)</Text>
                            </View>
                            <View style={{width: WIDTH[3]}}>
                                <Text style={styles.cell_child}>Chi(TM)</Text>
                            </View>
                            <View style={{width: WIDTH[4]}}>
                                <Text style={styles.cell_child}>Tiền mặt</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.cell, {width: FIELDS_WIDTH[1], flexDirection: 'column', borderRightWidth: 0, height: HEAD_HEIGHT}]}>
                        <View style={styles.cell_head}>
                            <Text style={styles.white}>Giao dịch chuyển khoản</Text>
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <View style={{width: WIDTH[5]}}>
                                <Text style={styles.cell_child}>Thu (CK)</Text>
                            </View>
                            <View style={{width: WIDTH[6]}}>
                                <Text style={styles.cell_child}>Chi(CK)</Text>
                            </View>
                            <View style={{width: WIDTH[7]}}>
                                <Text style={styles.cell_child}>Chuyển khoản</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.cell, {width: FIELDS_WIDTH[2], height: HEAD_HEIGHT}]}>
                        <Text style={styles.white}>Tổng</Text>
                    </View>
                </ScrollView>
            </View>
        );
    }

    formatIdentityColumn(date) {
        const order_column = [this.formatCell('[1]',WIDTH[0]), this.formatCell(null, WIDTH[0])];
        const date_column = [this.formatCell('[2]',WIDTH[1]), this.formatCell('Tổng', WIDTH[1])];
        
        date.forEach((v, k) => {
            order_column.push(this.formatCell(k + 1, WIDTH[0]));
            date_column.push(this.formatCell(v, WIDTH[1]));
        });
        return (
            <View style={{flexDirection: 'row'}}>
                <View style={{width: WIDTH[0]}}>{order_column}</View>
                <View style={{width: WIDTH[1]}}>{date_column}</View>
            </View>
        );
    }

    formatBody(data, date) {
        const first_row = ['[3]', '[4]', '[5=3-4]', '[6]', '[7]', '[8=6-7]', '[9=5+8]'];
        const label = ['thu_tm', 'chi_tm', 'thu_ck', 'chi_ck'];
        const second_row = {};

        label.forEach(v => {
            second_row[v] = sumBy(data, o => parseFloat(o[v]));
        });

        data.unshift(first_row, second_row);

        return (
            <View style={{ flexDirection: 'row'}}>
                {this.formatIdentityColumn(date)}
                <ScrollView horizontal={true} onScroll={this.scrollEvent}>
                    <FlatList
                        data={data}
                        renderItem={this.formatRow}
                        stickyHeaderIndices={[1]}
                        scrollEventThrottle={16}
                        extraData={this.state}
                    />
                </ScrollView>
            </View>
        );
    }

    listItem() {
        const items = [
            { label: 'Chi tiết', value: 0 },
            { label: 'Biểu đồ', value: 1 },
        ];
        return items;
    }

    onChange(value) {
        const {datef, datet, depot_id} = this.state;
        if (parseInt(value) === 1) this.props.navigation.navigate('ReceiptsLineChart', { datef, datet, depot_id });
    }

    render() {
        const { data, date, refreshing, visibleModal, loading, datef, datet, depot_id } = this.state;
        const db = [];
        if(!isEmpty(data) && !isEmpty(date)) {
            db.push(this.formatBody([...data], [...date]));
        }
        
        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row', alignItems: 'center', height: 40}}>
                    <View style={{flex: 1}}>
                        <RNPickerSelect
                            placeholder={{
                                label: 'Chọn...',
                                value: null,
                            }}
                            items={this.listItem()}
                            onValueChange={(value) => this.onChange(value)}
                            style={{
                                iconContainer: {
                                    top: 10,
                                    right: 12,
                                },
                            }}
                            value={0}
                            Icon={() => <Ionicons name="md-arrow-dropdown" size={24} color="gray" />}
                        />
                    </View>
                    <View style={{flex: 3, marginRight: 10}}>
                        <Text style={{textAlign: 'right'}}>Từ ngày {datef} đến ngày {datet}</Text>
                    </View>
                </View>
                {this.formatHeader()}
                {!loading ? (
                    <View style={{flex: 1}}>
                        {!isEmpty(db) ? (
                            <FlatList
                                data={db}
                                renderItem={({item}) => item}
                                refreshing={refreshing}
                                onRefresh={() => this.getData()}
                                //onEndReached={this.handleScrollEndReached}
                                //onEndReachedThreshold={0.005}
                            />
                        ) : (
                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                <Text style={{color: '#b06a13'}}>Không có dữ liệu...</Text>
                            </View>
                        )}
                        <ModalSearch
                            visibleModal={visibleModal}
                            handleFilter={this.handleFilter}
                            onModal={this.onModal}
                            datef={datef}
                            datet={datet}
                            depot_id={depot_id}
                        />
                    </View>
                ) : (
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
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

export default connect(mapStateToProps)(Report);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        //marginBottom: 10
    },
    header: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor,
        backgroundColor: '#28af6b',
        fontWeight: 'bold'
    },
    cell: {
        height: CELL_HEIGHT,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cell_head: {
        flex: 1,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cell_child: {
        textAlign: 'center',
        borderRightWidth: 1,
        borderColor,
        flex: 1,
        paddingTop: 4,
        color: '#fff'
    },
    white: { color: '#fff' },
});
