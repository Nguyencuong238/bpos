import React, { Component } from 'react';
import { View, StyleSheet, Button,  } from 'react-native';
import { Text } from 'react-native-svg';
import moment from 'moment';
import * as scale from 'd3-scale';
import { StackedBarChart, XAxis, Grid, YAxis } from 'react-native-svg-charts';
import { CheckBox } from 'react-native-elements';
import { report_api } from '../../services/api/fetch';
    
const Labels = (props) => {
    const { x, y, data } = props;
    return data.map((value, index) => {
        const sum = value.travel
        const pX = x(index) + x.bandwidth() / 2
        const pY = y(sum) - 10
        return (
            <Text
                key={ index }
                x={ pX }
                y={ pY }
                fontSize={ 13 }
                fill='red'
                alignmentBaseline={ 'middle' }
                textAnchor={ 'middle' }
            >
                {sum}
            </Text>
        )
    });
}
    
export default class ReportRevenue extends Component {
    constructor(props) {
        super(props)
        this.state = {
            expenseData: [
                {
                    date: moment('2018-06-01', 'YYYY-MM-DD'),
                    travel: 100,
                },
                {
                    date: moment('2018-07-01', 'YYYY-MM-DD'),
                    travel: 120,
                },
                {
                    date: moment('2018-08-01', 'YYYY-MM-DD'),
                    travel: 200,
                }
            ],
            keys: ['travel'],
            colors: ['#28af6b'],
            checked: true,
        }
    }

    componentWillMount() {
        const { datef, datet, depot_id } = this.props;
        report_api({ mtype: 'reportOrder', datef, datet, depot_id, is_mobile: 1 }).then((data) => {
            const tmp = Object.values(data);
            console.log(tmp);
            this.setState({ data: tmp });
        });
    }

  
    render() {
        const { expenseData, checked, keys, colors, data } = this.state;
        console.log(data);
        return (
            <View style={styles.container}>
                <View style={styles.chart}>
                    <YAxis
                        style={{ marginBottom: 20 }}
                        data={ expenseData }
                        formatLabel={ (value, index) =>  value }
                        yAccessor={({item}) => item.travel }
                        contentInset={{ top: 20, bottom: 10 }}
                        svg={{ fontSize: 10, fill: 'grey' }}
                        min={0}
                    />
                    <View style={styles.hline} />
                    <View style={{ flex: 1 }}>
                        <StackedBarChart
                            style={{ flex: 1 }}
                            keys={ keys }
                            colors={ colors }
                            data={ expenseData }
                            spacingInner={ 0.5 }
                            spacingOuter={ 0.5 }
                            contentInset={{ top: 20 }}
                            gridMin={0}
                        >
                            <Labels />
                            <Grid />
                        </StackedBarChart>
                        <View style={styles.line} />
                        <XAxis
                            style={{ marginTop: 10 }}
                            data={ expenseData }
                            formatLabel={ (value, index) => { return index } }
                            scale={ scale.scaleBand }
                            spacingInter={ 0.5 }
                            spacingOuter={ 0.5 }
                            contentInset={{ left: 10, right: 10 }}
                            svg={{ fontSize: 13, fill: 'black' }}
                        />
                    </View>
                </View>
                <View style={{ marginTop: 40 }}>
                    <CheckBox
                        title='Chi nhánh Trung Tâm'
                        checked={ checked }
                        onPress={() => this.setState({ checked: !checked })}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  chart: {
    marginTop: 100,
    marginLeft: 20,
    marginRight: 20,
    height: 300,
    flexDirection: 'row'
  },
  line: {
    borderBottomWidth: 1,
    borderColor: '#f48a92'
  },
  hline: {
    borderLeftWidth: 1,
    borderColor: '#f48a92',
    marginLeft: 10,
    marginBottom: 28,
  },
});
