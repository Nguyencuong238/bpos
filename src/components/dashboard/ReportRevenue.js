import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { stock_api } from '../../services/api/fetch';
import {
    View, Text, TouchableOpacity, Platform, Picker, Item, ActionSheetIOS
} from 'react-native';
import { dashboardCss } from '../../styles/dashboard';
import { Main } from '../../styles/main';
import NumberFormat from 'react-number-format';
import { Grid, BarChart, XAxis, YAxis } from 'react-native-svg-charts';
import * as d3Scale from 'd3-scale';
import { Text as SvgText } from 'react-native-svg';
import Icon from "react-native-vector-icons/Ionicons";
import { forEach, isEmpty, find } from 'lodash';
import moment from 'moment';

class ReportRevenue extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            total_customer: 0,
            total_supplier: 0,
            total: 0,
            selectedValue: 2,
            selectedLabel: 'Hôm nay',
            dataChart: null,
            total_amount: 0,
            params_search: null,
            refreshing: false,
        };
    }

    componentDidMount() {
        this.getList();
    }

    componentWillReceiveProps(props) {
        this.getList();
        console.log('didmoun');
    }
    
    getDerivingStateFromProps(props, state) {
        const { refreshing } = this.props;
        console.log(refreshing);
        console.log(props);
        console.log(state);
        console.log('TETXTXTXTXTXTXT');
        this.onRefresh();
    }

    onRefresh() {
        const { refreshing } = this.props;
        console.log(refreshing);
        if (refreshing === true) {
        console.log('test reload');
            this.getList();
        }
    }

    getList() {
        const { selectedValue } = this.state;
        const { depots, depot_current } = this.props;
        // console.log(depots)
        const params = {
            mtype: 'DashboardChart',
            chart_by: selectedValue,
            depots,
            chart_type: 'revenue',
        };
        // this.setState({ loading: true });
        stock_api(params).then((data) => {
            this.getDataChart(data);
        });
    }

    getDataChart(dataC) {
        // console.log(dataC)
        const chart = dataC.chart;
        let total_amount = 0;
        const { depots } = this.props;
        const colorArray = ['#ff7676', '#28af6b', '#2cabe3', '#707cd2', '#E67E22', '#4c5667'];
        const data = {
            labels: [],
            datasets: [],
        };
        const labels = find(chart, (o) => !isEmpty(o));   
        forEach(labels, (v, k) => {
            data.labels.push(moment(k).format('DD/MM'));
        });

        forEach(depots, (v, k) => {
            const data_depot = chart[v.id];
            const tmp_data = [];
            forEach(data_depot, (v_total) => {
                total_amount += parseFloat(v_total);
                tmp_data.push(parseFloat(v_total));
            });
            const tmp = {
                label: v.name,
                backgroundColor: colorArray[k],
                data: tmp_data,
                depot: v.id,
            };
            data.datasets.push(tmp);
        });   
        this.setState({ dataChart: data, total_amount, params_search: dataC.param });
    }

    renderDateOptions(options) {
        const htm = options.map((v, k) => {
            const idx = k + 1;
            return (
                <Picker.Item key={idx} label={v.label} value={v.value} />
            );
        });
        return htm;
    }

    onChangePicker(v) {
        this.setState({ selectedValue: v }, () => {
            this.getList();
        });
    }

    showDateIOS(options) {
        const tmp = ['Hủy'];
        options.map((v) => tmp.push(v.label));
        ActionSheetIOS.showActionSheetWithOptions(
            { options: tmp, cancelButtonIndex: 0 }, (index) => {
                if (index !== 0) {
                    this.setState({ selectedValue: options[index - 1].value, selectedLabel: tmp[index] }, () => {
                        this.getList();
                    });
                }
            },
        );
    }

    render() {
        const { loading, selectedValue, selectedLabel, dataChart, total_amount, params_search } = this.state;
        const { depot_current } = this.props;

        let datet = '';
        let datef = '';
        if (!isEmpty(params_search)){
            datet = moment(params_search.datet).format('DD/MM/YYYY');
            datef = moment(params_search.datef).format('DD/MM/YYYY');
        }
        const options = [
            { value: 0, label: 'Hôm nay' },
            { value: 1, label: 'Hôm qua' },
            { value: 2, label: 'Tuần này' },
            { value: 5, label: 'Tuần trước' },
            // { value: 3, label: 'Tháng này' },
            // { value: 4, label: 'Tháng trước' },
        ];

        const data = [];
        if (!isEmpty(dataChart)) {
            const data_depot = find(dataChart.datasets, (o) => parseFloat(o.depot) === parseFloat(depot_current));
            if (data_depot !== undefined) {
                forEach(data_depot.data, (v) => {
                    const num = (parseFloat(v) / 1000000).toFixed(2);
                    data.push(parseFloat(num));
                });
            }
        }
        const CUT_OFF = 1;
        const Labels = ({ x, y, bandwidth, data }) => (
            data.map((value, index) => {
                return (
                    <SvgText
                        key={index}
                        x={x(index) + (bandwidth / 2)}
                        y={value < CUT_OFF ? y(value) - 10 : y(value) + 15}
                        fontSize={10}
                        fill={value >= CUT_OFF ? 'white' : 'black'}
                        alignmentBaseline={'middle'}
                        textAnchor={'middle'}
                    >
                        {value}
                    </SvgText>
                )
            })
        );

        return (
            <View style={[dashboardCss.dashboard_total_revenue_main, dashboardCss.dashboard_box]}>
                <View style={dashboardCss.dashboard_total_revenue_top}>
                    <Text style={dashboardCss.dashboard_total_revenue_time}>{datef} - {datet}</Text>
                    {Platform.OS === 'ios'
                        ? (
                            <TouchableOpacity style={[Main.select_box_item, dashboardCss.dashboard_total_revenue_select]} onPress={() => this.showDateIOS(options)}>
                                <Text style={{ paddingRight: 5, fontSize: 14 }}>{selectedLabel}</Text>
                                <Icon
                                    name='ios-arrow-down'
                                    size={17}
                                    color="#000"
                                />
                            </TouchableOpacity>
                        )
                        : (
                            <Picker
                                selectedValue={selectedValue}
                                style={{ height: 50, width: 150 }}
                                onValueChange={(v) => this.onChangePicker(v)}
                            >
                                {this.renderDateOptions(options)}
                            </Picker>
                        )
                    }
                </View>
                <Text style={{ fontWeight: '600', fontSize: 14 }}>
                    TỔNG DOANH THU:&nbsp;
                    <NumberFormat
                        value={parseFloat(total_amount)}
                        displayType={'text'}
                        thousandSeparator={true}
                        suffix={' đ'}
                        renderText={value => <Text>{value}</Text>}
                    />
                </Text>
                {!isEmpty(data) && (
                    <View style={{ height: 230, flexDirection: 'row', marginTop: 15 }}>
                        <YAxis
                            data={data}
                            style={{ height: 220 }}
                            formatLabel={(item) => item + 'tr'}
                            contentInset={{ top: 10, bottom: 10 }}
                            svg={{ fontSize: 12, fill: 'grey' }}
                            // yAccessor={ ({item}) => item }
                            min={0}
                        />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <BarChart
                                style={{ height: 220 }}
                                data={data}
                                svg={{ fill: 'rgba(0, 145, 0, 0.9)' }}
                                contentInset={{ top: 10, bottom: 10 }}
                                gridMin={0}
                            >
                                <Grid />
                                <Labels />
                            </BarChart>
                            {!isEmpty(dataChart.labels) && (
                                <XAxis
                                    // xAccessor={({ index }) => index  }
                                    data={dataChart.labels}
                                    formatLabel={value => dataChart.labels[value]}
                                    // contentInset={{ left: 10, right: 10 }}
                                    svg={{ fontSize: 12, fill: 'grey' }}
                                    spacingInter={10}
                                    scale={d3Scale.scaleBand}
                                />
                            )}
                        </View>
                    </View>
                )}
            </View>
        );
    }
}

const mapStateToProps = ({ persist }) => ({
    depots: persist.depots,
    depot_current: persist.depot_current,
});

export default connect(mapStateToProps)(ReportRevenue);
