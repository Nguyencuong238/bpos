import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { View, ScrollView, Text, ListView, Image, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { productCategory_api } from '../../services/api/fetch';
import { dashboardCss } from '../../styles/dashboard';
import { Main } from '../../styles/main';
import NavigatorService from '../../services/NavigatorService';


class ItemGood extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            refreshing: false,
            category: '',
            value: 0,
        };
    }

    componentDidMount() {
        this.getListCategory();
    }

    getListCategory() {
        productCategory_api({ mtype: 'getAll' }).then(({ category }) => {
            this.setState({ category, refreshing: false });
        });
    }

    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.getListCategory();
    }

    renderItem(category) {
        console.log(category)
        const options = [];
        if (!isEmpty(category)) {
            category.forEach((v) => {
                console.log(v)
                const tmp = {
                    value: v.id,
                    label: v.name,
                };
                options.push(tmp);
                console.log(options)
            });
        }
        return (
            <View>
                {/* <RadioForm
                    radio_props={options}
                    initial={1}
                    formHorizontal={false}
                    labelHorizontal={true}
                    buttonColor={'#1bab62'}
                    buttonInnerColor={'#1bab62'}
                    animation={true}
                    onPress={(value) => { this.setState({ value: value }) }}
                /> */}
            </View>
        )
    }


    render() {
        const { category } = this.state;
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />
                }>
                <View style={styles.container} >
                    {!isEmpty(category) ? this.renderItem(category) : (<View><Text>HELLO</Text></View>)}
                </View>
            </ScrollView>
        );
    }
}

const mapStateToProps = ({ persist }) => ({
    depot_current: persist.depot_current,
});

export default connect(mapStateToProps)(ItemGood);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 5,
    },
});
