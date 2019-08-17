import React, { Component } from 'react';
import { Text, View, StatusBar, ScrollView, RefreshControl } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons"
import { connect } from 'react-redux';
import { dashboardCss } from '../../styles/dashboard';
import { Main } from '../../styles/main';
import { order_api } from '../../services/api/fetch';
import NumberFormat from 'react-number-format';
import ReportOrderStatus from './ReportOrderStatus';
import ReportDebt from './ReportDebt';
import ReportCashFlow from './ReportCashFlow';
import ReportCustomerToday from './ReportCustomerToday';
import ReportProduct from './ReportProduct';
import ReportRevenue from './ReportRevenue';
import { showMessage } from "react-native-flash-message";
import moment from 'moment';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            total_invoice: 0,
            percent_money_sub_month: 0,
            total_money: 0,
            returns_total_invoice: 0,
            returns_percent_money_sub_month: 0,
            returns_total_money: 0,
            percent_invoice_sub_month: 0,
            returns_percent_invoice_sub_month: 0,
            refreshing: false,
            chkRefresh: false,
        };
    }

    _onRefresh = () => {
        const { chkRefresh } = this.state;
        this.setState({ refreshing: true, chkRefresh: !chkRefresh});
        this.getList(true);
    }

    componentDidMount() {
        // showMessage({
        //     message: "Hello World",
        //     description: "Đây là BPOSSS",
        //     type: "success",
        // });
        this.getList();
    }

    getList(refreshing=false) {
        const { depot_current, profile } = this.props;
        order_api({ depot_id: depot_current, mtype: 'todayCount' }).then((data) => {
            const { total_invoice, percent_money_sub_month, total_money, percent_invoice_sub_month } = data;
            this.setState({ total_invoice, percent_money_sub_month, total_money, percent_invoice_sub_month });
        });
        order_api({ depot_id: depot_current, mtype: 'returnsTodayCount' }).then((data) => {
            const { returns_total_invoice, returns_percent_money_sub_month, returns_total_money, returns_percent_invoice_sub_month } = data;
            this.setState({ returns_total_invoice, returns_percent_money_sub_month, returns_total_money, returns_percent_invoice_sub_month });
        });
        if (refreshing) {
            this.setState({ refreshing: false});
        }
    }

    render() {
        const { total_invoice, percent_money_sub_month, total_money, returns_total_invoice,
            returns_percent_money_sub_month, returns_total_money, percent_invoice_sub_month,
            returns_percent_invoice_sub_month, chkRefresh } = this.state;
        
            return (
            <View style={dashboardCss.dashboard_main}>
                <StatusBar
                    backgroundColor="blue"
                    barStyle="light-content"
                />
                <ScrollView style={{ paddingBottom: 100, marginBottom: 20, paddingTop: 0 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }>
                    <View style={Main.padding_15}>
                        <View style={dashboardCss.dashboard_overview_main}>
                            <View style={dashboardCss.dashboard_overview_top}>
                                <Text style={dashboardCss.dashboard_overview_title}>Tổng quan</Text>
                                    <Text style={dashboardCss.dashboard_overview_time}>{moment().format('DD/MM/YYYY')}</Text>
                            </View>
                        </View>
                        <View style={dashboardCss.dashboard_statistical_main}>
                            <View style={Main.row}>
                                <View style={Main.col_6}>
                                    <View style={[dashboardCss.dashboard_statistical_box, dashboardCss.dashboard_box]}>
                                        <Text style={dashboardCss.dashboard_statistical_title}>Doanh thu</Text>
                                        <View style={dashboardCss.dashboard_statistical_price}>
                                            <Text style={dashboardCss.dashboard_statistical_price_bold}>
                                                <NumberFormat
                                                    value={total_money}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    suffix={' đ'}
                                                    renderText={value => <Text>{value}</Text>}
                                                />
                                            </Text>
                                            {/* <Text style={dashboardCss.dashboard_statistical_price_dong}>
                                                đ
                                            </Text> */}
                                        </View>
                                        <View style={dashboardCss.dashboard_statistical_percent_box}>
                                            <Icon
                                                name='ios-arrow-round-up'
                                                size={20}
                                                color='#28AF6B'
                                            />
                                            <Text style={[dashboardCss.dashboard_statistical_percent, Main.text_success]}>{percent_money_sub_month}%</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={Main.col_6}>
                                    <View style={[dashboardCss.dashboard_statistical_box, dashboardCss.dashboard_box]}>
                                        <Text style={dashboardCss.dashboard_statistical_title}>Hóa đơn</Text>
                                        <View style={dashboardCss.dashboard_statistical_price}>
                                            <Text style={dashboardCss.dashboard_statistical_price_bold}>
                                                {total_invoice}
                                            </Text>
                                            <Text style={dashboardCss.dashboard_statistical_price_dong}>
                                                đơn</Text>
                                        </View>
                                        <View style={dashboardCss.dashboard_statistical_percent_box}>
                                            <Icon
                                                name='ios-arrow-round-up'
                                                size={20}
                                                color='#28AF6B'
                                            />
                                            <Text style={[dashboardCss.dashboard_statistical_percent, Main.text_success]}>{percent_invoice_sub_month}%</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={dashboardCss.dashboard_statistical_main}>
                            <View style={Main.row}>
                                <View style={Main.col_6}>
                                    <View style={[dashboardCss.dashboard_statistical_box, dashboardCss.dashboard_box]}>
                                        <Text style={dashboardCss.dashboard_statistical_title}>Tiền trả hàng</Text>
                                        <View style={dashboardCss.dashboard_statistical_price}>
                                            <Text style={dashboardCss.dashboard_statistical_price_bold}>
                                                <NumberFormat
                                                    value={returns_total_money}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    suffix={' đ'}
                                                    renderText={value => <Text>{value}</Text>}
                                                />
                                            </Text>
                                            {/* <Text style={dashboardCss.dashboard_statistical_price_dong}>
                                                đ
                                            </Text> */}
                                        </View>
                                        <View style={dashboardCss.dashboard_statistical_percent_box}>
                                            <Icon
                                                name='ios-arrow-round-down'
                                                size={20}
                                                color='red'
                                            />
                                            <Text style={[dashboardCss.dashboard_statistical_percent, Main.text_danger]}>{returns_percent_money_sub_month}%</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={Main.col_6}>
                                    <View style={[dashboardCss.dashboard_statistical_box, dashboardCss.dashboard_box]}>
                                        <Text style={dashboardCss.dashboard_statistical_title}>Phiếu trả hàng</Text>
                                        <View style={dashboardCss.dashboard_statistical_price}>
                                            <Text style={dashboardCss.dashboard_statistical_price_bold}>
                                                {returns_total_invoice}
                                            </Text>
                                            <Text style={dashboardCss.dashboard_statistical_price_dong}>
                                                phiếu
                                            </Text>
                                        </View>
                                        <View style={dashboardCss.dashboard_statistical_percent_box}>
                                            <Icon
                                                name='ios-arrow-round-down'
                                                size={20}
                                                color='red'
                                            />
                                            <Text style={[dashboardCss.dashboard_statistical_percent, Main.text_danger]}>{returns_percent_invoice_sub_month}%</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <ReportRevenue {...this.props} chkRefresh={chkRefresh} />

                        <ReportOrderStatus {...this.props} chkRefresh={chkRefresh} />

                        <ReportProduct {...this.props} renderDate={this.renderDate} chkRefresh={chkRefresh} />

                        <ReportCustomerToday {...this.props} chkRefresh={chkRefresh} />

                        <ReportCashFlow {...this.props} chkRefresh={chkRefresh} />

                        <ReportDebt {...this.props} chkRefresh={chkRefresh} />

                    </View>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = ({ persist }) => ({
    form_login: persist.form_login,
    token: persist.token,
    depot_current: persist.depot_current,
    profile: persist.profile,
});

export default connect(mapStateToProps)(Dashboard);
