import React from 'react';
import { connect } from 'react-redux';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { Circle, G, Line, Rect, Text as TextSVG } from 'react-native-svg';
import { View, StyleSheet, ActivityIndicator, Text, ScrollView, RefreshControl } from 'react-native';
import { report_api } from '../../../services/api/fetch';
import { isEmpty, sumBy, forEach } from 'lodash';
import NumberFormat from 'react-number-format';
import ModalSearch from './ModalSearch';
import moment from 'moment';

class LineReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            refreshing: false,
            visibleModal: false,
            depot_id: props.depot_current,
            datef: moment().subtract(1, 'months').format('YYYY-MM-DD'),
            datet: moment().format('YYYY-MM-DD'),
        };
    }

    componentDidMount() {        
        //this.getData();
        const { navigation } = this.props;
        navigation.setParams({
            dispatch: this.onModal
        });
    }

    componentWillReceiveProps(nextProps) {
        const {navigation} = nextProps;
        const {datef, datet, depot_id} = navigation.state.params;
        this.setState({datef, datet, depot_id}, () => this.getData());
        
        // navigation.setParams({
        //     dispatch: this.onModal
        // });
    }

    getData() {
        const {depot_id, datef, datet } = this.state;
        this.setState({loading: true});
        report_api({mtype: 'reportOrder', depot_id, datef, datet, is_mobile: 1}).then((res) => {
            const data = Object.values(res);
            this.setState({ data, loading: false });
        });
    }

    onModal = () => {
        const { visibleModal } = this.state;
        this.setState({ visibleModal: !visibleModal });
    }

    handleFilter = (depot_id, datef, datet) => {
        this.setState({ depot_id, datef, datet }, () => this.getData());
    }

    render() {
        const { data, loading, visibleModal, datef, datet, depot_id, refreshing } = this.state;
        const profit = [];
        const date = [];
        if (!isEmpty(data)) {
            data.forEach( v => {
                const dt_thuan = parseInt(v.tong_banhang) - parseInt(v.tong_chietkhau) - parseInt(v.tong_diem_amount) - parseInt(v.tong_th);
                const tong_von =  parseInt(v.tong_giavon) - parseInt(v.tong_th_giavon);
                const p = dt_thuan - tong_von;
                const d = v.date;
                profit.push(p);
                date.push(d);
            });
        }

        const Tooltip = ({ x, y, data }) => data.map((v, k) => (
            <G
                x={ x(k) - 75 / 2}
                y={ y(v) - 30 }
                key={ 'tooltip' }
                onPress={ () => alert('hello') }
            >
                {/*<TextSVG
                    x={ 75 / 2 }
                    dy={ 20 }
                    alignmentBaseline={ 'middle' }
                    textAnchor={ 'middle' }
                    stroke={ 'red' }
                >
                    {parseFloat(parseFloat(v/1000000).toFixed(2))}
                </TextSVG>*/}
                <Circle
                    x={ 75 / 2 }
                    cy={ 30 }
                    r={ 2 }
                    stroke={ 'red' }
                    strokeWidth={ 1 }
                    fill={ 'red' }
                />
            </G>
        ))

        return (
            <View style={{flex: 1}}>
                {!loading ? (
                    <View style={{flex: 1}}>
                        {(!isEmpty(profit) && !isEmpty(date)) ? (
                            <ScrollView
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={() => this.getData()}
                                    />
                                }
                            >
                                <View style={styles.container}>
                                    <YAxis
                                        data={profit}
                                        contentInset={{ top: 20, bottom: 10 }}
                                        spacing={0.2}
                                        min={0}
                                        formatLabel={(value) => value !== 0 ? parseFloat(value/1000000) + 'tr' : 0}
                                        style={{ marginBottom: 20, textAlign: 'center' }}
                                    />
                                    <View style={{ flex: 1,  }}>
                                        <LineChart
                                            style={{ flex: 1 }}
                                            data={ profit }
                                            svg={{ stroke: '#28af6b', strokeWidth: 2 }}
                                            contentInset={{ top: 20, left: 10, right: 10, bottom: 3 }}
                                            curve={ shape.curveLinear }
                                            gridMin={0}
                                        >
                                            <Grid/>
                                            <Tooltip/>
                                        </LineChart>
                                        <XAxis
                                            style={{ marginTop: 10 }}
                                            data={date}
                                            formatLabel={(index) => index % 3 ? null : moment(data[index].date, 'DD/MM/YYYY').format('DD')}
                                            contentInset={{ left: 10, right: 10 }}
                                            svg={{ fontSize: 13, fill: 'black' }}
                                        />
                                    </View>
                                </View>
                            </ScrollView>
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
        )
    }

}

const mapStateToProps = ({ persist }) => ({
    depot_current: persist.depot_current,
});

export default connect(mapStateToProps)(LineReport);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 300,
        padding: 10,
        paddingLeft: 0,
        marginTop: 10,
    },
    line: {
        borderBottomWidth: 1,
        borderColor: '#d1cfcf',
    },
});