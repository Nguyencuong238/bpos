import React from 'react';
import { LineChart, YAxis, XAxis, Grid } from 'react-native-svg-charts';
import { View, TouchableOpacity, ScrollView, Text, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { reportCutomer_api } from '../../../services/api/fetch';
import { isEmpty, forEach, filter, split, find } from 'lodash';
import moment from 'moment';
import DateTimePicker from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from 'react-native-picker-select';

class LineChartCustomer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false,
            refreshing: false,
            dataDepot1: [],
            labelDepot1: [],
            datef: moment().subtract(1,'months').format('YYYY-MM-DD'),
            // datef: moment().startOf('isoWeek').format('YYYY-MM-DD'),
            datet: moment().format('YYYY-MM-DD'),
            depot: 1,
            isDateTimePickerVisibleF: false,
            isDateTimePickerVisibleT: false,
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData(txtDepot = null, txtDateF = null, txtDateT = null) {
        const { depots } = this.props;
        const { datef, datet, depot } = this.state;
        const params = {
            mtype: 'DashboardChart',
            chart_by: 2,
            depots,
            chart_type: 'revenue',
            sort: 'quantity',
            depot: txtDepot ? txtDepot : depot,
            datef: txtDateF ? txtDateF : datef,
            datet: txtDateT ? txtDateT : datet,
        };
        const dataDepot1 = [];
        const labelDepot1 = [];
        reportCutomer_api(params).then(({ chart }) => {
            forEach(chart, (v, k) => {
                dataDepot1.push(v / 1000000);
                labelDepot1.push(moment(k).get('date'));
            });
            this.setState({ dataDepot1, labelDepot1, refreshing: false });
        });
    }

    formatLabel(index) {
        const { labelDepot1 } = this.state;
        // return !(labelDepot1[index] % 2) ? labelDepot1[index] : '';
        return labelDepot1[index];

    }

    handleDatePicked = (type, date) => {
        if (type === 'from') {
            this.setState({ datef: moment(date).format('YYYY-MM-DD') });
            this.hideDateTimePickerF();
        } else if (type === 'to') {
            this.setState({ datet: moment(date).format('YYYY-MM-DD') });
            this.hideDateTimePickerT();
        }
    };

    hideDateTimePickerF = () => {
        this.setState({ isDateTimePickerVisibleF: false });
    };

    hideDateTimePickerT = () => {
        this.setState({ isDateTimePickerVisibleT: false });
    };

    showDateTimePickerF = () => {
        this.setState({ isDateTimePickerVisibleF: true });
    };

    showDateTimePickerT = () => {
        this.setState({ isDateTimePickerVisibleT: true });
    };

    listDepot() {
        const { depots, profile, userRole } = this.props;
        const { depot } = profile;
        let items = [
            {
                label: 'Chọn kho...',
                value: 0,
            }
        ];
        let depots_perm = filter(split(depot, ','), (v) => !isEmpty(v));
        let listDepots = filter(depots, (v) => depots_perm.includes(v.id));
        if (find(userRole, (o) => o.role_id === 1)) {
            listDepots = depots;
        }
        if (!isEmpty(listDepots)) {
            items = [];
            forEach(listDepots, (v) => {
                items.push({
                    label: v.name,
                    value: v.id,
                })
            });
        }
        return items;
    }

    onChangeDepot(value) {
        const depot = parseInt(value);
        if (depot > 0) {
            this.setState({ depot });
            this.getData(depot);
        }
    }

    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.getData();
    }

    submitDate() {
        const { datef, datet, depot } = this.state;
        this.getData(depot, datef, datet);
    }

    render() {
        const { dataDepot1, datef, datet, show, k1, refreshing } = this.state;
        const axesSvg = { fontSize: 10, fill: 'grey' };
        const verticalContentInset = { top: 10, bottom: 10 };
        const xAxisHeight = 30;
        return (
            <View>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                >
                    {/* <View style={{ flexDirection: 'row' }}>
                    <Text style={{ flex: 0.5 }} onPress={this.showDateTimePickerF}>Ngày bắt đầu</Text>
                    <Text style={{ flex: 0.5 }} onPress={this.showDateTimePickerF}>{moment(this.state.datef).format('YYYY-MM-DD')}</Text>
                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisibleF}
                        onConfirm={(date) => this.handleDatePicked('from', date)}
                        onCancel={this.hideDateTimePickerF}
                        date={new Date(datef)}
                    />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ flex: 0.5 }} onPress={this.showDateTimePickerT}>Ngày kết thúc</Text>
                    <Text style={{ flex: 0.5 }} onPress={this.showDateTimePickerT}>{moment(this.state.datet).format('YYYY-MM-DD')}</Text>
                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisibleT}
                        onConfirm={(date) => this.handleDatePicked('to', date)}
                        onCancel={this.hideDateTimePickerT}
                        date={new Date(datet)}
                    />
                </View> */}
                    <View style={{ backgroundColor: '#f5f5f5' }}>
                        {/* <Text style={{ marginTop: 10, fontSize: 16 }}> Chọn kho:</Text> */}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 50 }}>
                                <RNPickerSelect
                                    placeholder={{
                                        label: 'Chọn kho...',
                                        value: null,
                                    }}
                                    items={this.listDepot()}
                                    onValueChange={(value) => this.onChangeDepot(value)}
                                    style={{
                                        iconContainer: {
                                            top: 10,
                                            right: 12,
                                        },
                                    }}
                                    value={parseInt(this.state.depot)}
                                    Icon={() => {
                                        return <Ionicons name="md-arrow-dropdown" size={24} color="gray" />;
                                    }}
                                />
                            </View>
                            <View style={{ flex: 50, justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ fontSize: 14, textAlign: 'center' }}>Từ ngày {datef} đến ngày {datet}</Text>
                            </View>
                        </View>
                    </View>
                    {/* <TouchableOpacity onPress={() => this.submitDate()}>
                    <Text style={{ color: 'blue' }}>Lọc</Text>
                </TouchableOpacity> */}
                    <View style={{ height: 500, marginTop: 20, padding: 20, flexDirection: 'row' }}>
                        <YAxis
                            data={dataDepot1}
                            style={{ marginBottom: xAxisHeight }}
                            contentInset={verticalContentInset}
                            svg={axesSvg}
                            formatLabel={value => `  ${value}tr  `}
                        />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <LineChart
                                style={{ flex: 1 }}
                                data={dataDepot1}
                                contentInset={verticalContentInset}
                                svg={{ stroke: 'rgba(40, 175, 107, 1)' }}
                            // onPress={() => alert('hello')}

                            >
                                <Grid />
                            </LineChart>
                            <XAxis
                                style={{ marginHorizontal: -10, height: xAxisHeight }}
                                data={dataDepot1}
                                formatLabel={(value, index) => this.formatLabel(index)}
                                contentInset={{ top: 5, left: 10, right: 10 }}
                                svg={axesSvg}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View >

        );
    }

}
const mapStateToProps = ({ persist }) => ({
    depot_current: persist.depot_current,
    depots: persist.depots,
    profile: persist.profile,
    userRole: persist.userRole,
});
export default connect(mapStateToProps)(LineChartCustomer);
