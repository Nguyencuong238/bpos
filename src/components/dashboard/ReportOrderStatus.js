import React, { PureComponent } from 'react';
import { isEmpty, map, filter, find } from 'lodash';
import { purchase_order_api } from '../../services/api/fetch';
import { View, Text } from 'react-native';
import { dashboardCss } from '../../styles/dashboard';
import { Main } from '../../styles/main';

export default class ReportOrderStatus extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            listStatus: [],
            list: [],
        };
    }

    componentDidMount() {
        this.getList();
    }

    componentWillReceiveProps(props) {
        this.getList();
    }

    getList() {
        const { depot_current } = this.props;
        this.setState({ loading: true });
        purchase_order_api({ mtype: 'listStatusOrder' }).then(({ listStatus }) => {
            purchase_order_api({ mtype: 'countStatusShip', depot_id: depot_current }).then(({ list }) => {
                this.setState({ listStatus, list, loading: false });
            });
        });
    }

    renderStatusShip(status_ship, listStatus) {
        if (!isEmpty(listStatus)) {
            const array_to_obj = map(listStatus, (v, k) => ({ key: k, value: v }));
            const htm = map(filter(array_to_obj, (o) => (parseInt(o.key) > 30 && parseInt(o.key) < 39 && parseInt(o.key) !== 37 && parseInt(o.key) !== 38) && parseInt(o.key) !== 35), (v, k) => {
                const counts = find(status_ship, (o2) => parseInt(o2.status) === parseInt(v.key));
                let totalcount = 0;
                if (counts !== undefined) {
                    totalcount = counts.total;
                }
                return (
                    <View key={k} style={dashboardCss.dashboard_order_list_box}>
                        <Text style={dashboardCss.dashboard_order_list_name}>{v.value}</Text>
                        <Text style={[dashboardCss.dashboard_order_list_name, Main.font_bold]}>{totalcount}</Text>
                    </View>
                );
            });
            return htm;
        }
        return null;
    }

    render() {
        const { loading, listStatus, list } = this.state;
        return (
            <View style={[dashboardCss.dashboard_order_main, , dashboardCss.dashboard_box]}>
                <View style={dashboardCss.dashboard_title_box}>
                    <Text style={dashboardCss.dashboard_title}>Đơn hàng</Text>
                </View>
                <View style={dashboardCss.dashboard_order_list_main}>
                    {this.renderStatusShip(list, listStatus)}
                </View>
            </View>
        );
    }
}
