import React from 'react';
import { Text, View, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { G, Text as TextSvg } from 'react-native-svg';
import { sumBy, isEmpty, find } from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

class Revenue_Circle extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedSlice: {
                depot_id: '',
                depot: '',
                net_revenue: 0,
            },
            labelWidth: 0,
            colors: ['#ff7676', '#28af6b', '#2cabe3', '#707cd2', '#E67E22', '#4c5667'],
        }
    }

    componentWillReceiveProps(nextProps) {
        const { listDepots, refreshing } = nextProps;
        const { colors } = this.state;
        if (!isEmpty(listDepots)) {
            this.setState({ keys: [...listDepots] });
            const checked = {};
            listDepots.forEach((v, k) => {
                checked[k] = true;
                this.setState({ checked });
            });
        }
        if (refreshing) this.setState({ selectedSlice: { depot_id: '', depot: '', net_revenue: 0 } });
    }

    handleCheck(v, k, c) {
        const { checked, keys, test } = this.state;
        const selectedSlice = { depot_id: '', depot: '', net_revenue: 0 };
        checked[k] = !checked[k];
        if (checked[k]) {
            keys.push(v);
        } else {
            keys.splice(keys.indexOf(v), 1);
        };
        this.setState({ checked, keys, test: !test, selectedSlice });
    }

    render() {
        const { depot_revenue, navigation, depots, refreshing, listDepots } = this.props;
        const { labelWidth, selectedSlice, colors, keys, checked } = this.state;
        const { depot_id, depot, net_revenue } = selectedSlice;
        let total;
        if (!isEmpty(depot_revenue) && !isEmpty(keys)) {
            total = sumBy(depot_revenue.filter(v => keys.indexOf(v.depot_id) !== -1), (v) => v.net_revenue);
        }
        let data;
        if (!isEmpty(depot_revenue) && !isEmpty(keys)) {
            data = depot_revenue.map((v, k) => {
                const name = find(depots, o => o.id === v.depot_id).name;
                return ({
                    depot_id: v.depot_id,
                    depot: name,
                    net_revenue: v.net_revenue,
                    svg: { fill: colors[k] },
                    arc: { outerRadius: depot_id === v.depot_id ? '102%' : '100%', padAngle: 0.01 },
                    onPress: () => {
                        if (depot_id === v.depot_id) {
                            this.setState({ selectedSlice: { depot_id: '', depot: '', net_revenue: 0 } })
                        } else {
                            this.setState({ selectedSlice: { depot_id: v.depot_id, depot: name, net_revenue: v.net_revenue } })
                        }
                    },
                })
            }).filter(v => keys.indexOf(v.depot_id) !== -1 && v.net_revenue > 0);
        }

        const Labels = ({ slices }) => {
            return slices.map((slice, index) => {
                const { labelCentroid, data } = slice;
                return (
                    <G
                        key={index}
                        x={labelCentroid[0]}
                        y={labelCentroid[1]}
                        textAnchor={'middle'}
                    >
                        <TextSvg>{parseFloat(data.net_revenue / total * 100).toFixed(2) + '%'}</TextSvg>
                    </G>
                )
            })
        }
        const deviceWidth = Dimensions.get('window').width;

        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.navigate('Depot_Revenue', { depot_revenue })}>
                    <View style={styles.navi}>
                        <Text>Doanh thu theo chi nhánh</Text>
                        <Text>
                            <Icon
                                name='ios-arrow-forward'
                                size={17}
                                color='#000'
                            />
                        </Text>
                    </View>
                </TouchableOpacity>
                {(!isEmpty(data) && !refreshing) ? (
                    <View style={{ justifyContent: 'center' }}>
                        <PieChart
                            style={{ height: 300 }}
                            valueAccessor={({ item }) => item.net_revenue}
                            data={data}
                            outerRadius={'90%'}
                        >
                            <Labels />
                        </PieChart>
                        <Text
                            onPress={() => this.setState({ selectedSlice: { depot_id: '', depot: '', net_revenue: 0 } })}
                            onLayout={({ nativeEvent: { layout: { width } } }) => {
                                this.setState({ labelWidth: width });
                            }}
                            style={{
                                position: 'absolute',
                                left: deviceWidth / 2 - labelWidth / 2,
                                textAlign: 'center'
                            }}
                        >
                            {depot_id === '' ? `Tổng doanh thu\n${parseFloat(total / 1000000).toFixed(2)}tr` : `${depot}\n${parseFloat(net_revenue / 1000000).toFixed(2)}tr`}
                        </Text>
                    </View>
                ) : (
                        <View style={styles.no_data}>
                            <Text style={{ color: '#b06a13' }}>Chưa có dữ liệu</Text>
                        </View>
                    )}
                <View style={styles.depot}>
                    {!isEmpty(listDepots) && !isEmpty(colors) && listDepots.map((v, k) => (
                        <TouchableOpacity
                            key={k}
                            onPress={() => this.handleCheck(v, k, colors[k])}
                            style={{ flexDirection: 'row', width: '50%', marginBottom: 10 }}
                        >
                            <Text>
                                <Icon
                                    name={checked[k] ? 'md-checkmark-circle' : 'md-radio-button-off'}
                                    size={17}
                                    color={colors[k]}
                                />
                            </Text>
                            <Text style={{ marginLeft: 5 }}>{find(depots, o => o.id === v).name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        )
    }

}

const mapStateToProps = ({ persist }) => ({
    depots: persist.depots,
    token: persist.token,
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 15,
        borderRadius: 8,
    },
    navi: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 20
    },
    no_data: {
        height: 300,
        alignItems: 'center',
        justifyContent: 'center'
    },
    depot: {
        marginTop: 30,
        marginLeft: 10,
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
});
export default connect(mapStateToProps)(Revenue_Circle);

