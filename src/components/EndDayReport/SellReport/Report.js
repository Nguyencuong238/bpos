import React from 'react';
import { Animated, ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View, RefreshControl, Dimensions, BackHandler } from 'react-native';
import { report_api } from '../../../services/api/fetch';
import { connect } from 'react-redux';
import { isEmpty, sumBy } from 'lodash';
import NumberFormat from 'react-number-format';
import ModalSearch from './ModalSearch';
import moment from 'moment';
import { ScreenOrientation } from 'expo';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from "@expo/vector-icons";

const FIELDS = [
    'sell',
    'return',
    'DT thuần',
    'Tổng DT',
    'Tổng vốn',
    'Lợi nhuận',
];
const NUM_ROWS_STEP = 20;
const CELL_WIDTH = 100;
const CELL_HEIGHT = 50;
const HEAD_HEIGHT = 60;
const borderColor = '#e7e6e1';
const WIDTH = [50, 110, 90, 120, 90, 90, 90, 90, 110, 90, 110, 90, 90, 110, 140, 130, 130, 130];
const FIELDS_WIDTH = [680, 490, 140, 130, 130, 130];
const SELL = ['SL', 'Tiền', 'VAT', 'Phí', 'CK', 'Điểm', 'Vốn'];
const RETURN = ['SL', 'Tổng', 'VAT', 'Phí', 'Vốn'];

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
        report_api({mtype: 'reportOrder', depot_id, datef, datet, is_mobile: 1}).then((res) => {
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

    // scrollLoad = () => this.setState({ loading: false, count: this.state.count + NUM_ROWS_STEP });

    // handleScrollEndReached = () => {
    //     if (!this.state.loading) {
    //         this.setState({ loading: true }, () => setTimeout(this.scrollLoad, 500));
    //     }
    // };

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

    formatCell(value, width, is_header = false) {
        if (value === 'sell') {
            return (
                <View key={value} style={[styles.sell, {width}]}>
                    <View style={styles.cell_head}>
                        <Text style={styles.white}>Bán hàng</Text>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        {SELL.map((v, k) => (
                            <View style={{width: WIDTH[k + 2]}}>
                                <Text style={styles.cell_child}>{v}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            );
        } else if (value === 'return') {
            return (
                <View key={value} style={[styles.return, {width}]}>
                    <View style={styles.cell_head}>
                        <Text style={styles.white}>Trả hàng</Text>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        {RETURN.map((v, k) => (
                            <View style={{width: WIDTH[k + 9]}}>
                                <Text style={styles.cell_child}>{v}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            );
        } else {
            return (
                <View key={value} style={[styles.cell, {width}, is_header && {height: HEAD_HEIGHT}]}>
                    <Text style={[is_header && styles.white]}>{value}</Text>
                </View>
            );
        }
    }

    formatRow = section => {
        const { item, index } = section;
        const cells = [];

        if (index === 0) {
            item.forEach((v, k) => cells.push(this.formatCell(v, WIDTH[k+2] )));
        } else {
            item.dt_thuan = item.tong_banhang - item.tong_chietkhau - item.tong_diem_amount - item.tong_th;
            item.tong_doanhthu = item.dt_thuan + parseInt(item.tong_vat) + parseInt(item.tong_phikhac);
            item.tong_von = item.tong_giavon - item.tong_th_giavon;
            item.loi_nhuan = item.dt_thuan - item.tong_von;
            
            const label = ['tong_sl', 'tong_banhang', 'tong_vat', 'tong_phikhac', 'tong_chietkhau', 'tong_diem_amount', 'tong_giavon', 'tong_th_sl', 'tong_th', 'tong_th_vat', 'tong_th_phikhac', 'tong_th_giavon', 'dt_thuan', 'tong_doanhthu', 'tong_von', 'loi_nhuan' ]
            label.forEach((v, k) => {
                if (v !== 'tong_sl' && v !== 'tong_th_sl' && v !== 'tong_diem_amount') {
                    cells.push(this.formatCell(this.formatNumber(item[v]), WIDTH[k+2]));
                } else {
                    cells.push(this.formatCell(parseFloat(item[v]), WIDTH[k+2]));
                }
            });
        }

        return <View style={styles.row}>{cells}</View>;
    };

    formatHeader() {
        const cols = [];
        FIELDS.forEach((v, k) => cols.push(this.formatCell(v, FIELDS_WIDTH[k], true)));

        return (
            <View style={styles.header}>
                {this.formatCell('STT', WIDTH[0], true)}
                {this.formatCell('Thời gian', WIDTH[1], true)}
                <ScrollView
                    ref={ref => (this.headerScrollView = ref)}
                    horizontal={true}
                    scrollEnabled={false}
                    scrollEventThrottle={16}
                >
                    {cols}
                </ScrollView>
            </View>
        );
    }

    formatIdentityColumn(date) {
        const stt_column = [this.formatCell('[1]',WIDTH[0]), this.formatCell(null, WIDTH[0])];
        const date_column = [this.formatCell('[2]',WIDTH[1]), this.formatCell('Tổng', WIDTH[1])];
        
        date.forEach((v, k) => {
            stt_column.push(this.formatCell(k + 1, WIDTH[0]));
            date_column.push(this.formatCell(v, WIDTH[1]));
        });
        return (
            <View style={{flexDirection: 'row'}}>
                <View style={{width: WIDTH[0]}}>{stt_column}</View>
                <View style={{width: WIDTH[1]}}>{date_column}</View>
            </View>
            
        );
    }

    formatBody(data, date) {
        const first_row = ['[3]', '[4]', '[5]', '[6]', '[7]', '[8]', '[9]', '[10]', '[11]', '[12]', '[13]', '[14]', '[15=3-7-8-11]', '[16=15+5+6]', '[17=9-14]', '[18=15-17]'];
        const label = ['tong_sl', 'tong_banhang', 'tong_vat', 'tong_phikhac', 'tong_chietkhau', 'tong_diem_amount', 'tong_giavon', 'tong_th_sl', 'tong_th', 'tong_th_vat', 'tong_th_phikhac', 'tong_th_giavon' ]
        const second_row = {};

        label.forEach(v => second_row[v] = sumBy(data, o => parseFloat(o[v])));

        data.unshift(first_row, second_row);

        return (
            <View style={{ flexDirection: 'row'}}>
                {this.formatIdentityColumn(date)}
                <ScrollView horizontal={true} onScroll={this.scrollEvent}>
                    <FlatList
                        data={data}
                        renderItem={this.formatRow}
                        //stickyHeaderIndices={[1]}
                        //scrollEventThrottle={16}
                        //extraData={this.state}
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
        if (parseInt(value) === 1) this.props.navigation.navigate('SellLineChart', { datef, datet, depot_id });
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
        fontWeight: 'bold',
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
    sell: {
        height: HEAD_HEIGHT,
        borderBottomWidth: 1,
        borderColor,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    return: {
        height: HEAD_HEIGHT,
        borderBottomWidth: 1,
        borderColor,
        flexDirection: 'column',
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
