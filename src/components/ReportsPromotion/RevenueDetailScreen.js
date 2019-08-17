import React, {Component} from 'react';
import { Text, View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';

export default class RevenueDetailScreen extends Component {
    onPress() {

    }

    renderSeparator() {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#eee",
                }}
            />
        );
    };

    render() {
        const revenue = 100000;
        const return_value = 30000;
        const net_revenue = 70000;
        return (
            <View style={ styles.container }>
                <View style={ styles.thead }>
                    <View style={{ flex: 1.5, flexDirection: 'column', borderRightColor: '#eee', borderRightWidth: 1 }}>
                        <Text style={ styles.th }>Doanh thu</Text>
                        <Text style={ styles.th }>{revenue}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column', borderRightColor: '#eee', borderRightWidth: 1}}>
                        <Text style={ styles.th }>GT trả</Text>
                        <Text style={ styles.th }>{return_value}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={{ textAlign: 'right' }}>DT thuần</Text>
                        <Text style={{ textAlign: 'right' }}>{net_revenue}</Text>
                    </View>
                </View>
                <FlatList
                    data={[
                        {revenue: '100', return_value: 10, net_revenue: 90},
                        {revenue: '200', return_value: 50, net_revenue: 150},
                        {revenue: '130', return_value: 40, net_revenue: 90},
                        {revenue: '180', return_value: 20, net_revenue: 160},
                        {revenue: '100', return_value: 10, net_revenue: 90},
                        {revenue: '100', return_value: 10, net_revenue: 90},
                        {revenue: '100', return_value: 10, net_revenue: 90},
                        {revenue: '100', return_value: 10, net_revenue: 90},
                        {revenue: '100', return_value: 10, net_revenue: 90},
                        {revenue: '100', return_value: 10, net_revenue: 90},
                        {revenue: '100', return_value: 10, net_revenue: 90},
                        {revenue: '100', return_value: 10, net_revenue: 90},
                        {revenue: '100', return_value: 10, net_revenue: 90},
                    ]}
                    ItemSeparatorComponent={() => this.renderSeparator()}
                    renderItem={({item, index}) => (
                        <TouchableOpacity>
                            <View style={ styles.tbody }>
                                <View style={{ flex: 0.5 }} onPress={() => this.onPress()}>
                                    <Text style={{color: 'green'}}>{moment().subtract(index, 'days').format('DD/MM')}</Text>
                                    <Text>{moment().subtract(index, 'days').format('YYYY')}</Text>
                                </View>
                                <Text style={ styles.td } onPress={() => this.onPress()}>{item.revenue}</Text>
                                <Text style={ styles.td } onPress={() => this.onPress()}>{item.return_value}</Text>
                                <Text style={ styles.td } onPress={() => this.onPress()}>{item.net_revenue}</Text>
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