import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import moment from 'moment';
import { find } from 'lodash';
import NumberFormat from 'react-number-format';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

class Depot_Revenue extends Component {
    constructor(props) {
        super(props)
        this.state = {
            refreshing: true,
        }
    }

    componentDidMount() {
        setTimeout(() => this.setState({ refreshing: false }), 500);
    }

    onRefresh = () => {
        this.setState({ refreshing: true });
        setTimeout(() => this.setState({ refreshing: false }), 500);
    }

    render() {
        const { refreshing } = this.state;
        const { navigation, depots } = this.props;
        const { depot_revenue } = navigation.state.params;
        const inventory_value = 0;

        return (
            <ScrollView
                style={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={this.onRefresh}
                    />
                }
            >
                {!refreshing && (
                    <View style={{ marginBottom: 20, backgroundColor: '#fff' }}>
                        <FlatList
                            data={depot_revenue}
                            ItemSeparatorComponent={() => <View style={{ height: 1, width: "100%", backgroundColor: "#eee", }} />}
                            renderItem={({ item, index }) => (
                                <View style={{ padding: 10 }}>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <Text style={{ marginRight: 5 }}>
                                            <Icon
                                                name='md-locate'
                                                size={17}
                                                color='#000'
                                            />
                                        </Text>
                                        <Text>{find(depots, o => o.id === item.depot_id).name}</Text>
                                    </View>
                                    <View style={styles.space_between}>
                                        <Text>Doanh thu</Text>
                                        <Text>
                                            <NumberFormat
                                                thousandSeparator={'.'}
                                                decimalSeparator={','}
                                                value={parseInt(item.revenue)}
                                                displayType={'text'}
                                                suffix={'đ'}
                                                renderText={value => <Text>{value}</Text>}
                                            />
                                        </Text>
                                    </View>
                                    <View style={styles.space_between}>
                                        <Text>Giá trị trả</Text>
                                        <Text>
                                            <NumberFormat
                                                thousandSeparator={'.'}
                                                decimalSeparator={','}
                                                value={parseInt(item.return_value)}
                                                displayType={'text'}
                                                suffix={'đ'}
                                                renderText={value => <Text>{value}</Text>}
                                            />
                                        </Text>
                                    </View>
                                    <View style={styles.space_between}>
                                        <Text>Doanh thu thuần</Text>
                                        <Text>
                                            <NumberFormat
                                                thousandSeparator={'.'}
                                                decimalSeparator={','}
                                                value={parseInt(item.net_revenue)}
                                                displayType={'text'}
                                                suffix={'đ'}
                                                renderText={value => <Text>{value}</Text>}
                                            />
                                        </Text>
                                    </View>
                                    <View style={styles.space_between}>
                                        <Text>Giá trị tồn kho</Text>
                                        <Text>
                                            <NumberFormat
                                                thousandSeparator={'.'}
                                                decimalSeparator={','}
                                                value={parseInt(inventory_value)}
                                                displayType={'text'}
                                                suffix={'đ'}
                                                renderText={value => <Text>{value}</Text>}
                                            />
                                        </Text>
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                )}
            </ScrollView>
        );
    }
}

const mapStateToProps = ({ persist }) => ({
    depots: persist.depots,
    token: persist.token,
});

export default connect(mapStateToProps)(Depot_Revenue);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E5E5',
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: "#eee",
    },
    space_between: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }

});