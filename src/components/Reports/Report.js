import React from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import ReportRevenue from './ReportRevenue';
import Modal_DateOptions from './Modal_DateOptions';
import moment from 'moment';
import { standard_test_api } from '../../services/api/fetch';
import Revenue_Circle from './Revenue_Circle';
import { connect } from 'react-redux';

class Report extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            datef: moment().subtract(6, 'days').format('YYYY-MM-DD'),
            datet: moment().format('YYYY-MM-DD'),
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        const { datef, datet } = this.state;
        const { depots } = this.props;
        const list_depot = depots.map(v => v.id);
        this.setState({ refreshing: true }, () => {
            standard_test_api({ mtype: 'reportOrder', datef, datet, list_depot }).then((res) => {
                const data = Object.values(res);
                this.setState({ data, refreshing: false });
            });
            standard_test_api({ mtype: 'reportOrderByDepot', datef, datet, list_depot }).then((res) => {
                const depot_revenue = Object.values(res);
                const listDepots = [];
                depot_revenue.filter(v => v.net_revenue > 0).forEach(o => {
                    const tmp = o.depot_id;
                    listDepots.push(tmp)
                });
                this.setState({ depot_revenue, listDepots, refreshing: false });
            });
        });
    }

    getDate = (key) => {
        let datet, datef;
        if (key === '7days') {
            datef = moment().subtract(6, 'days').format('YYYY-MM-DD');
            datet = moment().format('YYYY-MM-DD');
        } else if (key === 'today') {
            datef = moment().format('YYYY-MM-DD');
            datet = moment().format('YYYY-MM-DD');
        } else if (key === 'yesterday') {
            datef = moment().subtract(1, 'days').format('YYYY-MM-DD');
            datet = moment().subtract(1, 'days').format('YYYY-MM-DD');
        } else if (key === 'thisweek') {
            datef = moment().startOf('isoweek').format('YYYY-MM-DD');
            datet = moment().format('YYYY-MM-DD');
        } else if (key === 'lastweek') {
            datef = moment().subtract(1, 'weeks').startOf('isoweek').format('YYYY-MM-DD');
            datet = moment().subtract(1, 'weeks').endOf('isoweek').format('YYYY-MM-DD');
        } else if (key === 'thismonth') {
            datef = moment().startOf('month').format('YYYY-MM-DD');
            datet = moment().format('YYYY-MM-DD');
        } else if (key === 'lastmonth') {
            datef = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
            datet = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
        }
        this.setState({ datef, datet }, () => this.getData());
    }

    render() {
        const { datef, datet, refreshing, data, depot_revenue, listDepots } = this.state;
        //console.log(listDepots)
        //console.log(this.props.token);
        return (
            <ScrollView
                style={{ flex: 1, backgroundColor: '#E5E5E5' }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => this.getData()}
                    />
                }
            >
                <Modal_DateOptions getDate={this.getDate} />
                <ReportRevenue {...this.props} listDepots={listDepots} data={data} refreshing={refreshing} datef={datef} datet={datet} />
                <Revenue_Circle  {...this.props} listDepots={listDepots} refreshing={refreshing} depot_revenue={depot_revenue} />
            </ScrollView>
        )
    }
}

const mapStateToProps = ({ persist }) => ({
    depots: persist.depots,
    token: persist.token,
});

export default connect(mapStateToProps)(Report);

Report.navigationOptions = {
    title: 'Báo cáo',
};