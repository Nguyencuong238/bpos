import React, { PureComponent } from 'react';
import { receipts_api } from '../../services/api/fetch';
import { View, Text } from 'react-native';
import { dashboardCss } from '../../styles/dashboard';
import { Main } from '../../styles/main';
import NumberFormat from 'react-number-format';

export default class ReportDebt extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            total_customer: 0,
            total_supplier: 0,
            total: 0,
        };
    }

    componentDidMount() {
        this.getList();
    }

    componentWillReceiveProps(props) {
        this.getList();
    }
    
    getList() {
        const params = {
            mtype: 'getAllDebt',
        };
        this.setState({ loading: true });
        receipts_api(params).then(({ debt }) => {
            const { total_customer, total_supplier, total } = debt;
            this.setState({ loading: false, total_customer, total_supplier, total });
        });
    }

    render() {
        const { loading, total, total_customer, total_supplier } = this.state;
        const tooltip_total = 'Tổng số = phải thu - phải trả';
        return (
            <View style={[dashboardCss.dashboard_order_main, , dashboardCss.dashboard_box]}>
                <View style={dashboardCss.dashboard_title_box}>
                    <Text style={dashboardCss.dashboard_title}>Công nợ</Text>
                </View>
                <View style={dashboardCss.dashboard_order_list_main}>
                    <View style={dashboardCss.dashboard_order_list_box}>
                        <Text style={dashboardCss.dashboard_order_list_name}>Tổng số</Text>
                        <Text style={[dashboardCss.dashboard_order_list_name, Main.font_bold]}>
                            <NumberFormat
                                value={parseFloat(total)}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={' đ'}
                                renderText={value => <Text>{value}</Text>}
                            />
                        </Text>
                    </View>
                    <View style={dashboardCss.dashboard_order_list_box}>
                        <Text style={dashboardCss.dashboard_order_list_name}>Phải thu</Text>
                        <Text style={[dashboardCss.dashboard_order_list_name, Main.font_bold]}>
                            <NumberFormat
                                value={parseFloat(total_customer)}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={' đ'}
                                renderText={value => <Text>{value}</Text>}
                            />
                        </Text>
                    </View>
                    <View style={dashboardCss.dashboard_order_list_box}>
                        <Text style={dashboardCss.dashboard_order_list_name}>Phải trả</Text>
                        <Text style={[dashboardCss.dashboard_order_list_name, Main.font_bold]}>
                            <NumberFormat
                                value={parseFloat(total_supplier)}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={' đ'}
                                renderText={value => <Text>{value}</Text>}
                            />
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}
