import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';
import { sumBy } from 'lodash';
import NumberFormat from 'react-number-format';
import { standard_test_api } from '../../services/api/fetch';
import { connect } from 'react-redux';

class RevenueDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            refreshing: false,
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        const { navigation, depots } = this.props;
        const list_depot = depots.map(v => v.id);
        const { datef, datet } = navigation.state.params;
        this.setState({ refreshing: true }, () => {
            standard_test_api({ mtype: 'reportOrder', datef, datet, list_depot }).then((res) => {
                const data = Object.values(res);
                this.setState({ data, refreshing: false });
            });
        });
    }

    render() {
        const { refreshing, data } = this.state;
        const { navigation } = this.props;
        const revenue = sumBy(data, (o) => o.revenue);
        const return_value = sumBy(data, (o) => o.return_value);
        const net_revenue = sumBy(data, (o) => o.net_revenue);

        return (
            <View style={styles.container}>
                <View style={styles.thead}>
                    <View style={{ flex: 1.5, flexDirection: 'column', borderRightColor: '#eee', borderRightWidth: 1 }}>
                        <Text style={styles.th}>Doanh thu</Text>
                        <Text style={styles.th}>
                            <NumberFormat
                                thousandSeparator={'.'}
                                decimalSeparator={','}
                                value={parseInt(revenue)}
                                displayType={'text'}
                                renderText={value => <Text>{value}</Text>}
                            />
                        </Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column', borderRightColor: '#eee', borderRightWidth: 1 }}>
                        <Text style={styles.th}>GT trả</Text>
                        <Text style={styles.th}>
                            <NumberFormat
                                thousandSeparator={'.'}
                                decimalSeparator={','}
                                value={parseInt(return_value)}
                                displayType={'text'}
                                renderText={value => <Text>{value}</Text>}
                            />
                        </Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={{ textAlign: 'right' }}>DT thuần</Text>
                        <Text style={{ textAlign: 'right' }}>
                            <NumberFormat
                                thousandSeparator={'.'}
                                decimalSeparator={','}
                                value={parseInt(net_revenue)}
                                displayType={'text'}
                                renderText={value => <Text>{value}</Text>}
                            />
                        </Text>
                    </View>
                </View>
                <FlatList
                    refreshing={refreshing}
                    onRefresh={() => this.getData()}
                    data={data}
                    ItemSeparatorComponent={() => <View style={{ height: 1, width: "100%", backgroundColor: "#eee", }} />}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('List_Bill', {
                                net_revenue: item.net_revenue,
                                date: item.date,
                            })}
                        >
                            <View style={styles.tbody}>
                                <View style={{ flex: 0.5 }}>
                                    <Text style={{ color: 'green' }}>{moment(item.date, 'DD/MM/YYYY').format('DD/MM')}</Text>
                                    <Text>{moment(item.date, 'DD/MM/YYYY').format('YYYY')}</Text>
                                </View>
                                <Text style={styles.td}>
                                    <NumberFormat
                                        thousandSeparator={'.'}
                                        decimalSeparator={','}
                                        value={parseInt(item.revenue)}
                                        displayType={'text'}
                                        renderText={value => <Text>{value}</Text>}
                                    />
                                </Text>
                                <Text style={styles.td}>
                                    <NumberFormat
                                        thousandSeparator={'.'}
                                        decimalSeparator={','}
                                        value={parseInt(item.return_value)}
                                        displayType={'text'}
                                        renderText={value => <Text>{value}</Text>}
                                    />
                                </Text>
                                <Text style={styles.td}>
                                    <NumberFormat
                                        thousandSeparator={'.'}
                                        decimalSeparator={','}
                                        value={parseInt(item.net_revenue)}
                                        displayType={'text'}
                                        renderText={value => <Text>{value}</Text>}
                                    />
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        );
    }
}

const mapStateToProps = ({ persist }) => ({
    depots: persist.depots,
});

export default connect(mapStateToProps)(RevenueDetail);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10
    },
    thead: {
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10,
        marginTop: 0,
        alignItems: 'center'
    },
    th: {
        textAlign: 'right',
        marginRight: 10,
    },
    tbody: {
        flexDirection: 'row',
        margin: 20,
        alignItems: 'center'
    },
    td: {
        flex: 1,
        textAlign: 'right',
    }
});