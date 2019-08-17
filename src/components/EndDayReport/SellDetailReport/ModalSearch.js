import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty, filter, split, find, forEach } from 'lodash';
import { View, ScrollView, Text, RefreshControl, TouchableOpacity, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import NavigatorService from '../../../services/NavigatorService';
import Modal from 'react-native-modal';
import Icon from "react-native-vector-icons/Ionicons";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
import { goodsCss } from '../../../styles/goods';

class ModalSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datef: props.datef,
            datet: props.datet,
            depot_id: props.depot_id,
            isDateTimePickerVisibleF: false,
            isDateTimePickerVisibleT: false,
        };
    }

    handleDatePicked = (type, date) => {
        if (type === 'from') {
            this.setState({ datef: moment(date).format('YYYY-MM-DD') });
            this.hideDateTimePickerF();
        } else if (type === 'to') {
            this.setState({ datet: moment(date).format('YYYY-MM-DD') });
            this.hideDateTimePickerT();
        }
    };

    onChangeDepot(value) {
        const depot_id = parseInt(value);
        if (depot_id > 0) {
            this.setState({ depot_id });
        }
    }

    onSubmit() {
        const { datef, datet, depot_id } = this.state;
        const {handleFilter, onModal} = this.props;
        if (onModal) onModal();
        if (handleFilter) handleFilter(depot_id, datef, datet);
    }

    listDepot() {
        const { depots } = this.props;
        const items = [];
        if (!isEmpty(depots)) {
            forEach(depots, (v) => {
                items.push({
                    label: v.name,
                    value: v.id,
                })
            });
        }
        return items;
    }

    hideDateTimePickerF = () => {
        this.setState({ isDateTimePickerVisibleF: false });
    };

    hideDateTimePickerT = () => {
        this.setState({ isDateTimePickerVisibleT: false });
    };

    showDateTimePickerF = () => {
        this.setState({ isDateTimePickerVisibleF: true });
    };

    showDateTimePickerT = () => {
        this.setState({ isDateTimePickerVisibleT: true });
    };

    resetForm() {
        const {onModal} = this.props;
        if (onModal) onModal();
    }

    _renderModalContent = () => {
        const { datet, datef, depot_id } = this.state;
        return (
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={{ flex: 95, textAlign: 'center', color: '#fff', fontSize: 18 }} >Bộ lọc</Text>
                    <TouchableOpacity style={{ flex: 5 }} onPress={() => this.resetForm()}>
                        <Icon
                            name="ios-close"
                            size={35}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.modalInfo}>
                    <ScrollView>
                        <View style={goodsCss.goods_details_list}>
                            <Text style={{ flex: 50 }} onPress={this.showDateTimePickerF}>Ngày bắt đầu:</Text>
                            <Text style={{ flex: 50 }} onPress={this.showDateTimePickerF}>
                                {moment(datef).format('YYYY-MM-DD')}
                            </Text>
                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisibleF}
                                onConfirm={(date) => this.handleDatePicked('from', date)}
                                onCancel={this.hideDateTimePickerF}
                                date={new Date(datef)}
                            />
                        </View>
                        <View style={goodsCss.goods_details_list}>
                            <Text style={{ flex: 50 }} onPress={this.showDateTimePickerT}>Ngày kết thúc:</Text>
                            <Text style={{ flex: 50 }} onPress={this.showDateTimePickerT}>
                                {moment(datet).format('YYYY-MM-DD')}
                            </Text>
                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisibleT}
                                onConfirm={(date) => this.handleDatePicked('to', date)}
                                onCancel={this.hideDateTimePickerT}
                                date={new Date(datet)}
                            />
                        </View>
                        <View style={styles.test}>
                            <Text> Chọn kho:</Text>
                            <RNPickerSelect
                                placeholder={{
                                    label: 'Chọn kho...',
                                    value: null,
                                }}
                                items={this.listDepot()}
                                onValueChange={(value) => this.onChangeDepot(value)}
                                style={{
                                    iconContainer: {
                                        top: 10,
                                        right: 12,
                                    },
                                }}
                                value={parseInt(depot_id)}
                                Icon={() => <Ionicons name="md-arrow-dropdown" size={24} color="gray" />}
                            />
                        </View>
                        <View style={{ marginTop: 10, backgroundColor: '#28af6b' }}>
                            <Text
                                onPress={() => this.onSubmit()}
                                style={{ width: '100%', textAlign: 'center', padding: 10, color: '#fff', fontSize: 18 }}
                            >
                                Áp dụng
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
        )
    };

    render() {
        const { visibleModal } = this.props;
        return (
            <Modal isVisible={visibleModal}>
                {this._renderModalContent()}
            </Modal>
        );
    }
}

const mapStateToProps = ({ persist }) => ({
    depots: persist.depots,
});

export default connect(mapStateToProps)(ModalSearch);

const styles = StyleSheet.create({
    modalContent: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
    },
    modalHeader: {
        flex: 10,
        flexDirection: 'row',
        backgroundColor: '#28af6b',
        alignSelf: 'center',
        alignItems: 'center',
        height: 10,
        padding: 15,
        overflow: 'hidden'
    },
    modalInfo: {
        flex: 100,
        padding: 15
    },
    test: {
        borderBottomWidth: 1,
        borderColor: '#eaeaea',
        backgroundColor: '#f5f5f5',
        padding: 15,
    }
});