import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { standard_test_api } from '../../services/api/fetch';
import NumberFormat from 'react-number-format';

export default class List_Bill extends Component {
    constructor(props) {
        super(props)
        this.state = {
            refreshing: false,
            count_bill: 0,
            date: moment(props.navigation.state.params.date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        const { date } = this.state;
        this.setState({ refreshing: true }, () => {
            standard_test_api({ mtype: 'reportOrderDetail', datef: date, datet: date }).then((data) => {
                this.setState({ data, count_bill: data.length, refreshing: false });
            });
        });
    }
    render() {
        const { refreshing, count_bill, data } = this.state;
        const { navigation } = this.props;
        const { net_revenue } = navigation.state.params;
        return (
            <View style={styles.container}>
                <View style={{marginBottom: 80}}>
                    <Text style={{ marginBottom: 10, paddingLeft: 10, paddingRight: 10 }}>Tổng số {count_bill} đơn</Text>
                    <FlatList
                        refreshing={refreshing}
                        onRefresh={() => this.getData()}
                        data={data}
                        ItemSeparatorComponent={() => <View style={{ height: 1, width: "100%", backgroundColor: "#eee", paddingLeft: 10, paddingRight: 10 }} />}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                key={index}
                                style={{ paddingLeft: 10, paddingRight: 10 }}
                                onPress={() => navigation.navigate('BillDetail', {
                                    invoice: item.invoice,
                                    data: item,
                                })}
                            >
                                <View style={styles.flatlist}>
                                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                        <Text style={{ flex: 1, fontWeight: 'bold' }}>{item.invoice}</Text>
                                        <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                            <NumberFormat
                                                thousandSeparator={'.'}
                                                decimalSeparator={','}
                                                value={item.type === 'HD'
                                                    ? parseInt(item.tong_banhang - item.tong_chietkhau - item.tong_diem_amount)
                                                    : `- ${parseInt(item.tong_th)}`
                                                }
                                                displayType={'text'}
                                                suffix={'đ'}
                                                renderText={value => <Text>{value}</Text>}
                                            />
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ flex: 1, }}>{moment(item.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')}</Text>
                                        <Text style={{ flex: 1, textAlign: 'right' }}>{item.customer || 'Khách vãng lai'}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <View style={styles.net_revenue}>
                    <Text style={{ color: '#fff' }}>Doanh thu thuần: </Text>
                    <Text style={{ color: '#fff', fontSize: 16 }}>
                        {!isEmpty(data) ? (
                            <NumberFormat
                                thousandSeparator={'.'}
                                decimalSeparator={','}
                                value={parseInt(net_revenue)}
                                displayType={'text'}
                                suffix={'đ'}
                                renderText={value => <Text>{value}</Text>}
                            />
                        ) : 0
                        }
                    </Text>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
    },
    flatlist: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    net_revenue: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#229c5e',
        color: '#fff',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 10,
        width: '100%',
        alignItems: 'center',
    }
});