import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { report_api } from '../../services/api/fetch';
import { dashboardCss } from '../../styles/dashboard';
import { Main } from '../../styles/main';
import NumberFormat from 'react-number-format';
import NavigatorService from '../../services/NavigatorService';
    
export default class ListPromotion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            promotion_list: null,
            search: {
                name: '',
                type: '',
                status: '',
                depot_id: '',
                datef: '',
                datet: '',
            },
        }
    }

    componentDidMount() {
        this.getList();
    }

    componentWillReceiveProps(props) {
        if (props.chkRefresh){
            this.getList();
        }
    }

    getList() {
        const { search } = this.state;
        const { depot_current, dispatch } = this.props;
        //Filter
        // const name_find = find(data_filter, (o) => o.name === 'name');
        // const name = name_find !== undefined ? name_find.value : '';

        // const type_find = find(data_filter, (o) => o.name === 'type');
        // const type = type_find !== undefined ? type_find.value : '';

        // const status_find = find(data_filter, (o) => o.name === 'status');
        // const status = status_find !== undefined ? status_find.value : '';

        // const depot_id_find = find(data_filter, (o) => o.name === 'depot_id');
        // const depot_id = depot_id_find !== undefined ? depot_id_find.value : depot_current;

        // const date_find = find(data_filter, (o) => o.name === 'date');
        // let datef = moment().subtract(3, 'days').format('YYYY-MM-DD');
        // let datet = moment().format('YYYY-MM-DD');
        // if (date_find !== undefined && date_find.value !== undefined && moment(date_find.value).isValid()) {
        //     datef = moment(date_find.value).format('YYYY-MM-DD');
        //     datet = moment(date_find.value).format('YYYY-MM-DD');
        // }
        // if (date_find !== undefined && date_find.value.length === 2) {
        //     datef = !isEmpty(date_find.value[0]) ? moment(date_find.value[0]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        //     datet = !isEmpty(date_find.value[1]) ? moment(date_find.value[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        // }

        const params = {
            mtype: 'reportPromotion',
            depot_id: depot_current,
            is_list: 1,
            // name,
            // status,
            // type,
            // datef,
            // datet,
            // isDownload: 0,
            // total_page,
            // page: currentPage,
        };
        // this.setState({ data_filter_show: params });

        // this.setState({ loading: true });
        report_api(params).then(({ promotion_list }) => {
            console.log('76', promotion_list);
            if (!isEmpty(promotion_list)){
                this.setState({ promotion_list });
            }
        });
    }
  
    render() {
        const { promotion_list } = this.state;
        return (
            <View style={styles.container}>
                {!isEmpty(promotion_list) && (
                    <FlatList
                        data={promotion_list}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity key={index} onPress={() => NavigatorService.navigate('ReportPromotionDetail', { promotion: item })}>
                                    <View style={styles.item}>
                                        <View>
                                            <View style={styles.item_content}>
                                                <Text style={[styles.item_name, Main.font_bold]}>
                                                    {item.name}
                                                </Text>
                                            </View>
                                            <View style={styles.item_content}>
                                                <Text style={styles.item_amount}>
                                                    <NumberFormat
                                                        value={parseFloat(9999999)}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        suffix={' đ'}
                                                        renderText={value => <Text>{value}</Text>}
                                                    />
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.item_line}/>
                                </TouchableOpacity>
                            );
                        }}
                    >
                    </FlatList>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    item: {
        flex: 1,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    item_line: {
        height: 2,
        backgroundColor: 'green',
    },
    item_content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    item_name: {
        
    },
    item_amount: {
        
        fontWeight: '200',        
    }
});
