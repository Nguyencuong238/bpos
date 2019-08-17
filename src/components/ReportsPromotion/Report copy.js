import React from 'react';
import { connect } from 'react-redux';
import { Text, View, StatusBar, ScrollView, RefreshControl } from 'react-native';
import moment from 'moment';
import ReportRevenue from './ReportRevenue';
import Modal_DateOptions from './Modal_DateOptions';
import ListPromotion from './ListPromotion';
import { dashboardCss } from '../../styles/dashboard';

class Report extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            depot_id: 1,
            datef: moment("06/10/2019").format('YYYY-MM-DD'),
            datet: moment("06/15/2019").format('YYYY-MM-DD'),
            refreshing: false,
            chkRefresh: false,
        };
    }

    onRefresh = () => {
        const { chkRefresh } = this.state;
        this.setState({ refreshing: true, chkRefresh: !chkRefresh }, () => {
            this.setState({ refreshing: false });
        });
    }

    render() {
        const { visible, datef, datet, depot_id, chkRefresh, refreshing } = this.state;
        return (
            <View>
                <StatusBar
                    backgroundColor="blue"
                    barStyle="light-content"
                />
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={this.onRefresh}
                        />
                    }>
                    <View style={{ flex: 1 }}>
                        <Modal_DateOptions />
                        {/* <ReportRevenue {...this.props} datef={datef} datet={datet} depot_id={depot_id} /> */}
                        <ListPromotion {...this.props} datef={datef} datet={datet} depot_id={depot_id} chkRefresh={refreshing}/>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = ({ persist }) => ({
    depot_current: persist.depot_current,
});

export default connect(mapStateToProps)(Report);