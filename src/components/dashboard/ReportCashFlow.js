import React, { PureComponent, Component } from 'react';
import { receipts_api } from '../../services/api/fetch';
import { dashboardCss } from '../../styles/dashboard';
import { Main } from '../../styles/main';
import NumberFormat from 'react-number-format';
import { Tooltip } from 'react-native-elements';
import { Text, View } from 'react-native';

export default class ReportCashFlow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            total_thu: 0,
            total_chi: 0,
            total_point: 0,
            ton_quy: 0,
        };
    }

    componentDidMount() {
        this.getList();
    }

    componentWillReceiveProps(props) {
        this.getList();
    }

    getList() {
        const myObject = [];
        myObject.invoice = '';
        myObject.bill_id = '';
        myObject.type = '';
        myObject.depot_id = '';
        myObject.type_payment = '';
        myObject.bank_account_id = '';
        myObject.group_person = '';
        myObject.personnel_id = '';
        myObject.note = '';
        myObject.person_info = '';
        myObject.is_accounting = '';
        myObject.datef = '';
        myObject.datet = '';
        myObject.status = 1;
        const params = {
            mtype: 'getall',
            limit: 1,
            offset: 0,
            params: myObject,
        };
        this.setState({ loading: true });
        receipts_api(params).then((v) => {
            if (v.status) {
                const ton_quy = v.total_thu - v.total_chi - v.total_point;
                this.setState({
                    loading: false,
                    total_thu: v.total_thu,
                    total_chi: v.total_chi,
                    total_point: v.total_point,
                    ton_quy,
                });
            }
        });
    }

    tooltip_txt() {
        const { total_chi, total_point } = this.state;
        return (
            <View>
                Tổng chi:
                <NumberFormat
                    value={total_chi * -1}
                    displayType={'text'}
                    thousandSeparator={true}
                    suffix={' đ'}
                    renderText={value => <Text>{value}</Text>}
                /> - Tiền điểm:
                <NumberFormat
                    value={total_point * -1}
                    displayType={'text'}
                    thousandSeparator={true}
                    suffix={' đ'}
                    renderText={value => <Text>{value}</Text>}
                />
            </View>
        );
    }

    render() {
        const { loading, total_thu, total_chi, ton_quy, total_point } = this.state;
        const tooltip_tonquy = 'Tồn quỹ = tổng thu - tổng chi - tiền điểm';
        return (
            <View style={[dashboardCss.dashboard_order_main, , dashboardCss.dashboard_box]}>
                <View style={dashboardCss.dashboard_title_box}>
                    <Text style={dashboardCss.dashboard_title}>Sổ quỹ</Text>
                </View>
                <View style={dashboardCss.dashboard_order_list_main}>
                    <View style={dashboardCss.dashboard_order_list_box}>
                        <Text style={dashboardCss.dashboard_order_list_name}>Tổng thu</Text>
                        <Text style={[dashboardCss.dashboard_order_list_name, Main.font_bold]}>
                            <NumberFormat
                                value={total_thu}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={' đ'}
                                renderText={value => <Text>{value}</Text>}
                            />
                        </Text>
                    </View>
                    <View style={dashboardCss.dashboard_order_list_box}>
                        <Text style={dashboardCss.dashboard_order_list_name}>Tổng chi</Text>
                        <Text style={[dashboardCss.dashboard_order_list_name, Main.font_bold]}>
                            {/* <Tooltip popover={this.tooltip_txt()}> */}
                                <NumberFormat
                                    value={((total_chi + total_point) * -1)}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={' đ'}
                                    renderText={value => <Text>{value}</Text>}
                                />
                            {/* </Tooltip> */}
                        </Text>
                    </View>
                    <View style={dashboardCss.dashboard_order_list_box}>
                        <Text style={dashboardCss.dashboard_order_list_name}>Tồn quỹ</Text>
                        <Text style={[dashboardCss.dashboard_order_list_name, Main.font_bold]}>
                            {/* <Tooltip popover={<View>{tooltip_tonquy}</View>}> */}
                                <NumberFormat
                                    value={ton_quy}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={' đ'}
                                    renderText={value => <Text>{value}</Text>}
                                />
                            {/* </Tooltip> */}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}
