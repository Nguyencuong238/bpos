import React, { PureComponent } from 'react';
import { customer_api } from '../../services/api/fetch';
import { View, Text } from 'react-native';
import { dashboardCss } from '../../styles/dashboard';
import { Main } from '../../styles/main';
import NumberFormat from 'react-number-format';
import Icon from "react-native-vector-icons/Ionicons"

export default class ReportCustomerToday extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            total_newcustomer: 0,
            total_birthday7: 0,
            total_buy: 0,
        };
    }

    componentDidMount() {
        this.getList();
    }

    getList() {
        this.setState({ loading: true });
        customer_api({ mtype: 'getCountTodayCustomer' }).then(({ total }) => {
            const { total_newcustomer, total_buy, total_birthday7 } = total;
            this.setState({ loading: false, total_newcustomer, total_buy, total_birthday7 });
        });
    }

    render() {
        const { loading, total_newcustomer, total_buy, total_birthday7 } = this.state;
        return (
            <View style={[dashboardCss.dashboard_order_main, , dashboardCss.dashboard_box]}>
                <View style={dashboardCss.dashboard_title_box}>
                    <Text style={dashboardCss.dashboard_title}>Khách hàng</Text>
                </View>
                <View style={dashboardCss.dashboard_order_list_main}>
                    <View style={dashboardCss.dashboard_order_list_box}>
                        <Text style={dashboardCss.dashboard_order_list_name}>Khách hàng mới trong ngày</Text>
                        <Text style={[dashboardCss.dashboard_order_list_name, Main.font_bold]}>{total_newcustomer}</Text>
                    </View>
                    <View style={dashboardCss.dashboard_order_list_box}>
                        <View style={[dashboardCss.dashboard_order_list_name, dashboardCss.dashboard_hoz]}>
                            <Text>Khách mua hàng trong ngày </Text>
                            {/* <View style={dashboardCss.dashboard_statistical_percent_box}>
                                <Icon
                                    name='ios-arrow-round-up'
                                    size={20}
                                    color='#28af6b'
                                />
                                <Text style={[dashboardCss.dashboard_statistical_percent, Main.text_success]}>(10%)</Text>
                            </View> */}
                        </View>
                        <Text style={[dashboardCss.dashboard_order_list_name, Main.font_bold]}>{total_buy}</Text>
                    </View>
                    <View style={dashboardCss.dashboard_order_list_box}>
                        <View style={[dashboardCss.dashboard_order_list_name, dashboardCss.dashboard_hoz]}>
                            <Text>Khách có sinh nhật trong 7 ngày </Text>
                            {/* <View style={dashboardCss.dashboard_statistical_percent_box}>
                                <Icon
                                    name='ios-arrow-round-up'
                                    size={20}
                                    color='#28af6b'
                                />
                                <Text style={[dashboardCss.dashboard_statistical_percent, Main.text_success]}>(2%)</Text>
                            </View> */}
                        </View>
                        <Text style={[dashboardCss.dashboard_order_list_name, Main.font_bold]}>{total_birthday7}</Text>
                    </View>
                </View>
            </View>
        );
    }
}
