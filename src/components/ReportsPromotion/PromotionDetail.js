import React from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { report_api } from '../../services/api/fetch';
import { dashboardCss } from '../../styles/dashboard';
import { Main } from '../../styles/main';

export default class PromotionDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            promotion: null,    
        };
    }

    componentDidMount(){
        const promotion = this.props.navigation.getParam('promotion');
        if (promotion !== undefined){
            this.setState({promotion});
        }
    }

    render() {
        const { promotion } = this.state;
        return (
            <View style={styles.container}>
                {!isEmpty(promotion) && !isEmpty(promotion.list_order) && (
                    <FlatList
                        data={promotion.list_order}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity key={index}>
                                    <View style={styles.item}>
                                        <View>
                                            <View style={styles.item_content}>
                                                <Text style={[styles.item_name, Main.font_bold]}>
                                                    {item.invoice}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.item_line} />
                                </TouchableOpacity>
                            );
                        }}
                    >
                    </FlatList>
                )}
            </View>
        )
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