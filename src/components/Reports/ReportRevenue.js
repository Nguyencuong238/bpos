import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Text as TextSVG, G } from 'react-native-svg';
import moment from 'moment';
import * as scale from 'd3-scale';
import { StackedBarChart, XAxis, Grid, YAxis } from 'react-native-svg-charts';
import { isEmpty, find, filter } from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

class ReportRevenue extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedColumn: '',
            colors: ['#ff7676', '#28af6b', '#2cabe3', '#707cd2', '#E67E22', '#4c5667'],
        }
    }

    componentWillReceiveProps(nextProps) {
        const { listDepots, refreshing } = nextProps;
        const { colors } = this.state;
        if (!isEmpty(listDepots)) {
            this.setState({ keys: [...listDepots], color1: [...colors] });
            const checked = {};
            listDepots.forEach((v, k) => {
                checked[k] = true;
                this.setState({ checked });
            });
        }
        if (refreshing) this.setState({ selectedColumn: '' });
    }

    handleCheck(v, k, c) {
        const { checked, keys, color1 } = this.state;
        checked[k] = !checked[k];
        if (checked[k]) {
            keys.splice(k, 0, v);
            color1.splice(k, 1, c);
        } else {
            keys.splice(keys.indexOf(v), 1);
            color1.splice(k, 1, '');
        };
        this.setState({ checked, keys, color1 });
    }

    render() {
        const { selectedColumn, checked, keys, colors, color1 } = this.state;
        const { navigation, datet, datef, refreshing, data, depots, listDepots } = this.props;

        let info;
        if (!isEmpty(data) && !isEmpty(keys)) {
            info = data.map((v, k) => {
                let tmp = { ...v };
                keys.forEach((v1, k1) => {
                    if (tmp[v1] !== undefined) {
                        tmp[v1] = {
                            value: v[v1],
                            svg: {
                                onPress: () => {
                                    if (selectedColumn === (k + 1) * 100 + k1) {
                                        this.setState({ selectedColumn: '' });
                                    } else {
                                        this.setState({ selectedColumn: (k + 1) * 100 + k1 });
                                    }
                                }
                            }
                        }
                    } else {
                        tmp[v1] = {
                            value: 0,
                            svg: {
                                onPress: null
                            }
                        }
                    }
                })
                return tmp;
            })
        }

        const Labels = (props) => {
            const { x, y, data } = props;
            return data.map((val, index) => {
                let tmp = 0;
                return keys.map((v, k) => {
                    const sum = val[v].value;
                    const pX = x(index) + x.bandwidth() / 2;
                    const pY = y(sum + tmp) - 10;
                    tmp += sum;
                    return (
                        <G
                            key={index * 100 + k}
                        >
                            <TextSVG
                                key={index * 100 + k}
                                x={pX}
                                y={pY}
                                fontSize={13}
                                fill='red'
                                alignmentBaseline={'middle'}
                                textAnchor={'middle'}
                            >
                                {selectedColumn === (index + 1) * 100 + k ? parseFloat(sum / 1000000).toFixed(2) : null}
                            </TextSVG>
                        </G>
                    )
                })

            });
        }

        const yData = [];
        if (!isEmpty(info)) {
            info.forEach(v => {
                let tmp = 0;
                keys.forEach(k => {
                    tmp += parseFloat(v[k].value);
                });
                yData.push(tmp);
            });
        }

        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.navigate('RevenueDetail', { datet, datef })}>
                    <View style={{ flexDirection: 'row', marginLeft: 10, marginRight: 10, marginTop: 10 }}>
                        <Text style={{ flex: 1 }}>Doanh thu theo ngày</Text>
                        <Text style={{ flex: 1, textAlign: 'right' }}>
                            <Icon
                                name='ios-arrow-forward'
                                size={17}
                                color='#000'
                            />
                        </Text>
                    </View>
                </TouchableOpacity>
                <View style={{ height: 300, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    {(!isEmpty(info) && !isEmpty(yData) && !refreshing) ? (
                        <View style={styles.chart}>
                            <YAxis
                                style={{ marginBottom: 20 }}
                                data={yData}
                                formatLabel={(value) => parseFloat(value / 1000000) + 'tr'}
                                contentInset={{ top: 20, bottom: 10 }}
                                svg={{ fontSize: 10, fill: 'grey' }}
                                min={0}
                            />
                            <View style={{ flex: 1, marginLeft: 5 }}>
                                <StackedBarChart
                                    style={{ flex: 1 }}
                                    keys={keys}
                                    colors={filter(color1, v => v !== '')}
                                    data={info}
                                    spacingInner={0.5}
                                    spacingOuter={0.5}
                                    contentInset={{ top: 20 }}
                                    gridMin={0}
                                    valueAccessor={({ item, key }) => item[key].value}
                                >
                                    <Labels />
                                    <Grid />
                                </StackedBarChart>
                                <View style={styles.line} />
                                <XAxis
                                    style={{ marginTop: 10 }}
                                    data={info}
                                    formatLabel={(index) => moment(data[index].date, 'DD/MM/YYYY').format('DD')}
                                    scale={scale.scaleBand}
                                    spacingInter={0.05}
                                    spacingOuter={0.05}
                                    contentInset={{ left: 10, right: 10 }}
                                    svg={{ fontSize: 13, fill: 'black' }}
                                />
                            </View>
                        </View>
                    ) : (
                            <Text style={{ color: '#b06a13' }}>Chưa có dữ liệu</Text>
                        )}
                </View>
                <View style={styles.depot}>
                    {!isEmpty(listDepots) && !isEmpty(colors) && listDepots.map((v, k) => (
                        <TouchableOpacity
                            key={k}
                            onPress={() => this.handleCheck(v, k, colors[k])}
                            style={{ flexDirection: 'row', width: '50%', marginBottom: 10 }}
                        >
                            <Text>
                                <Icon
                                    name={checked[k] ? 'md-checkbox' : 'md-square-outline'}
                                    size={17}
                                    color={colors[k]}
                                />
                            </Text>
                            <Text style={{ marginLeft: 5 }}>{find(depots, o => o.id === v).name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    }
}

const mapStateToProps = ({ persist }) => ({
    depots: persist.depots,
});

export default connect(mapStateToProps)(ReportRevenue);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 0,
        borderRadius: 8,
    },
    chart: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        height: 300,
        flexDirection: 'row'
    },
    line: {
        borderBottomWidth: 1,
        borderColor: '#d1cfcf'
    },
    hline: {
        borderLeftWidth: 1,
        borderColor: '#f48a92',
        marginLeft: 5,
        marginBottom: 30,
        marginTop: 10,
    },
    depot: {
        marginTop: 30,
        marginLeft: 10,
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
});
