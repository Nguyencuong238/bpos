import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Text as TextSVG } from 'react-native-svg';
import moment from 'moment';
import * as scale from 'd3-scale';
import { StackedBarChart, XAxis, Grid, YAxis } from 'react-native-svg-charts';
import { CheckBox } from 'react-native-elements';
import { isEmpty,isNumber,forEach } from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';
import { showMessage } from "react-native-flash-message";
export default class ReportRevenue extends Component {
    constructor(props) {
        super(props)
        this.state = {
            colors: ['#28af6b'],
            checked: true,
            selectedColumn: { key: '', value: 0 },
            space:0,
            label :'',
            listReport:'',
            type:'',
        }
    }

    componentWillReceiveProps(nextProps){
        console.log('nextProps')
        console.log(nextProps.data)
        const { navigation, datet, datef,  refreshing, depot_id, data } = this.props;
        if(!isEmpty(data)){
            let numberdatef = parseFloat(moment(datef,'YYYY-MM-DD').format('M'));
            let numberdatet = parseFloat(moment(datet,'YYYY-MM-DD').format('M'));
            let numberdayf = parseFloat(moment(datef,'YYYY-MM-DD').format('DD'));
            let numberdayt = parseFloat(moment(datet,'YYYY-MM-DD').format('DD'));
            if(numberdatef===numberdatet) {
                let space_day = numberdayt - numberdayf;
                let space ='';
                if(space_day >=0 && space_day <=7){
                    space = 0
                } else if(space_day >=8 && space_day <=14){
                    space = 1
                // this.setState({space});
                } else if(space_day >=15 && space_day <=21){
                    space = 2
                } else if(space_day >=22 && space_day <=27){
                    space = 3
                } else if(space_day >=28 ){
                    space = 4
                }
                let info1 = [];
                if(!isEmpty(data)&& isNumber(space)){
                    forEach(data, (v, k) => {
                        if(space ==0 || space ==1){
                            info1.push(v);
                        }else{
                            if(k%space == 0){
                                info1.push(v);
                            }
                        }  
                    });
                } 
                this.setState({space,label:info1,listReport:nextProps.data,type:''});
            }else{
                let numberdatef = parseFloat(moment(datef,'YYYY-MM-DD').format('M'));
                let numberdatet = parseFloat(moment(datet,'YYYY-MM-DD').format('M'));
                let numberyearf = parseFloat(moment(datef,'YYYY-MM-DD').format('YYYY'));
                let numberyeart = parseFloat(moment(datet,'YYYY-MM-DD').format('YYYY'));
                let listMonth =[];
                let options = [];
                let listTotal = [];
                forEach(data, (v, k) => {
                    let a = parseFloat(moment(v['date'],'YYYY-MM-DD').format('M'));
                    // let b = (moment(v['date'],'YYYY-MM-DD').format('YYYY-MM'));
                    // let c = parseFloat(moment(v['date'],'YYYY-MM-DD').format('YYYY'));
                    let b = (moment(v['date'],'DD/MM/YYYY').format('YYYY-MM'));
                    let c = parseFloat(moment(v['date'],'DD/MM/YYYY').format('YYYY'));
                    let object1 = {month:a};
                    let object2 = {year_month:b};
                    let object3 = {year:c};
                    v1 = {...object1, ...v,...object2,...object3};
                    options.push(v1);
                });
                if(numberyearf > numberyeart){
                    this.setState({listReport:[]});
                }else if(numberyearf == numberyeart){
                    if(numberdatef>numberdatet){
                        this.setState({listReport:[]});
                    }else if(numberdatef<numberdatet){
                        for (i = numberdatef; i <= numberdatet; i++) { 
                            listMonth.push(i) 
                        }
                        if(!isEmpty(listMonth)){
                            forEach(listMonth, (v, k) => {
                                let getTotal= options.reduce(function(sum, record){
                                    if(record.month == v) return sum + record.totalAll;
                                    else return sum;
                                }, 0);
                                let month_year = `${v}-${numberyeart}`;
                                let object4 = {totalAll:getTotal,date:month_year}
                                listTotal.push(object4);
                            });
                        }
                        this.setState({label:listTotal,listReport:listTotal,type:'month'});
                    }
                }else if(numberyearf < numberyeart){
                    let listMonthf =[];
                    let listMontht =[];
                    if(numberyearf+1 == numberyeart ){
                        for (i = numberdatef; i <= 12; i++) { 
                            listMonthf.push(i) 
                        }
                        for (i = 1; i <= numberdatet; i++) { 
                            listMontht.push(i) 
                        }
                        if(!isEmpty(listMonthf)){
                            forEach(listMonthf, (v, k) => {
                                let getTotal= options.reduce(function(sum, record){
                                    if(record.month == v && record.year == numberyearf) return sum + record.totalAll;
                                    else return sum;
                                }, 0);
                                let month_year = `${v}-${numberyeart}`;
                                let object4 = {totalAll:getTotal,date:month_year}
                                listTotal.push(object4);
                            });
                        }
                        if(!isEmpty(listMontht)){
                            forEach(listMontht, (v, k) => {
                                let getTotal= options.reduce(function(sum, record){
                                    if(record.month == v && record.year == numberyeart) return sum + record.totalAll;
                                    else return sum;
                                }, 0);
                                let month_year = `${v}-${numberyeart}`;
                                let object4 = {totalAll:getTotal,date:month_year}
                                listTotal.push(object4);
                            });
                        }
                    
                        this.setState({label:listTotal,listReport:listTotal,type:'month'});
                    }else{
                        this.setState({listReport:[],type:'month'});
                        showMessage({
                            message: "Bạn phải lựa chọn khoảng cách lớn hơn 1 năm",
                            description: "",
                            type: "error",
                        });
                    }

                    // this.setState({listReport:[],type:'month'});
                    // showMessage({
                    //     message: "Bạn phải lựa chọn khoảng cách trong cùng 1 năm",
                    //     description: "",
                    //      type: "error",
                    //  });
                }           
            }
        }
    }

    render() {
        const { checked, colors, selectedColumn,space,label,listReport,type } = this.state;
        console.log('listReport')
        console.log(listReport)
        const { key, value } = selectedColumn;
        const { navigation, datet, datef,  refreshing, depot_id, data } = this.props;
        let info;
        if (!isEmpty(listReport)) {
            info = listReport.map((v,k) => ({
                ...v,
                totalAll: {
                    value: v.totalAll,
                    svg: {
                        onPress: () => {
                            if (key === k) {
                                this.setState({ selectedColumn: { key: '', value: 0 } })
                            } else {
                                this.setState({ selectedColumn: { key: k, value: v.totalAll } })
                            }
                        }
                    }
                }
            }))

        }
        const Labels = (props) => {
            const { x, y, data } = props;
            if (!isEmpty(listReport)) {
                return data.map((value, index) => {
                    const sum = value.totalAll.value;
                    const pX = x(index) + x.bandwidth() / 2;
                    const pY = y(sum) - 10;
                    return (
                        <TextSVG
                            key={index}
                            x={pX}
                            y={pY}
                            fontSize={13}
                            fill='red'
                            alignmentBaseline={'middle'}
                            textAnchor={'middle'}
                        >
                            {key === index ? parseFloat(sum / 1000000).toFixed(2) : null}
                        </TextSVG>
                    )
                });
            }
        }

        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.navigate('RevenueDetailEndDay', { depot_id, datet, datef })}>
                    <View style={{ flexDirection: 'row', marginLeft: 10, marginRight: 10, marginTop: 10 }}>
                    <Text style={{ flex: 1 }}>Tổng (Thu-Chi)</Text>
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
                    {(!isEmpty(listReport) && !refreshing && isNumber(space)) && !isEmpty(label)  && isEmpty(type)? (
                        <View style={styles.chart}>
                            <YAxis
                                style={{ marginBottom: 20 }}
                                data={info}
                                formatLabel={(value) => parseFloat(value / 1000000) + 'tr'}
                                yAccessor={({ item }) => item.totalAll.value}
                                contentInset={{ top: 20, bottom: 10 }}
                                svg={{ fontSize: 10, fill: 'grey' }}
                            />
                            <View style={{ flex: 1, marginLeft: 5 }}>
                                <StackedBarChart
                                    style={{ flex: 1 }}
                                    keys={['totalAll']}
                                    colors={colors}
                                    data={info}
                                    spacingInner={0.5}
                                    spacingOuter={0.5}
                                    contentInset={{ top: 20 }}
                                    valueAccessor={({ item, key }) => item[key].value}
                                >
                                    <Labels />
                                    <Grid />
                                </StackedBarChart>
                                <View style={styles.line} />
                                <XAxis
                                    style={{ marginTop: 10 }}
                                    data={label}
                                    formatLabel={(index) => {
                                        if(space == 0){
                                            return (parseInt(moment(info[index].date, 'DD/MM/YYYY').format('DD')))
                                        }else{
                                            return ((parseInt(moment(info[index].date, 'DD/MM/YYYY').format('DD'))-1)*space+1)
                                        }
                                       
                                    }}
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
                    {!isEmpty(listReport) && !refreshing && !isEmpty(label) && !isEmpty(type)? (
                        <View style={styles.chart}>
                            <YAxis
                                style={{ marginBottom: 20 }}
                                data={info}
                                formatLabel={(value) => parseFloat(value / 1000000) + 'tr'}
                                yAccessor={({ item }) => item.totalAll.value}
                                contentInset={{ top: 20, bottom: 10 }}
                                svg={{ fontSize: 10, fill: 'grey' }}
                            />
                            <View style={{ flex: 1, marginLeft: 5 }}>
                                <StackedBarChart
                                    style={{ flex: 1 }}
                                    keys={['totalAll']}
                                    colors={colors}
                                    data={info}
                                    spacingInner={0.5}
                                    spacingOuter={0.5}
                                    contentInset={{ top: 20 }}
                                    valueAccessor={({ item, key }) => item[key].value}
                                >
                                    <Labels />
                                    <Grid />
                                </StackedBarChart>
                                <View style={styles.line} />
                                <XAxis
                                    style={{ marginTop: 10 }}
                                    data={label}
                                    formatLabel={(index) => {
                                        return (info[index].date)
                                    }}
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
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
});
