import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';
import { sumBy, isEmpty } from 'lodash';
import NumberFormat from 'react-number-format';
import { report_api } from '../../services/api/fetch';

export default class RevenueDetailTH extends Component {
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
        const { datef, datet, depot_id } = this.props.navigation.state.params;
        this.setState({ refreshing: true }, () => {
            report_api({ mtype: 'reportOrder', datef, datet, depot_id, is_mobile: 1 }).then((response) => {
                const data = Object.values(response);
                this.setState({ data, refreshing: false });
            });
        });
    }

    render() {
        const { refreshing, data } = this.state;
        const revenue = sumBy(data, (o) => (o.tong_banhang - o.tong_chietkhau - o.tong_diem_amount));
        const return_value = sumBy(data, (o) => o.tong_th);
        const net_revenue = sumBy(data, (o) => o.doanhthu_thuan);

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
                            onPress={() => this.props.navigation.navigate('List_Bill', {
                                net_revenue: item.doanhthu_thuan,
                                date: item.date,
                                type:'TH'
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
                                        value={parseInt(item.tong_banhang - item.tong_chietkhau - item.tong_diem_amount)}
                                        displayType={'text'}
                                        renderText={value => <Text>{value}</Text>}
                                    />
                                </Text>
                                <Text style={styles.td}>
                                    <NumberFormat
                                        thousandSeparator={'.'}
                                        decimalSeparator={','}
                                        value={parseInt(item.tong_th)}
                                        displayType={'text'}
                                        renderText={value => <Text>{value}</Text>}
                                    />
                                </Text>
                                <Text style={styles.td}>
                                    <NumberFormat
                                        thousandSeparator={'.'}
                                        decimalSeparator={','}
                                        value={parseInt(item.doanhthu_thuan)}
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