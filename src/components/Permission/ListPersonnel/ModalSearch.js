import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty, forEach } from 'lodash';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import Icon from "react-native-vector-icons/Ionicons";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from 'react-native-picker-select';
import { goodsCss } from '../../../styles/goods';
import { role_api } from '../../../services/api/fetch';

class ModalSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keywords: {}
        };
    }

    componentDidMount() {
        role_api({ mtype: 'getAll' }).then(({ role }) => {
            this.setState({ listRoles: role, loading: false });
        });
    }

    onChange(value, key) {
        const { keywords } = this.state;
        keywords[key] = value;
        this.setState({ keywords });
    }

    onSubmit() {
        const { keywords } = this.state;
        const { handleFilter, onModal } = this.props;
        if (onModal) onModal();
        if (handleFilter) handleFilter(keywords);
    }

    listRole() {
        const { listRoles } = this.state;
        const items = [];
        if (!isEmpty(listRoles)) {
            forEach(listRoles, (v) => {
                items.push({
                    label: v.role_name,
                    value: v.id,
                })
            });
        }
        return items;
    }

    resetForm() {
        const { onModal } = this.props;
        if (onModal) onModal();
    }

    _renderModalContent = () => {
        const { keywords } = this.state;
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
                            <Text style={{ flex: 50 }}>Tên nhân viên:</Text>
                            <TextInput
                                style={{ flex: 50 }}
                                placeholder="Tên nhân viên"
                                onChangeText={(v) => this.onChange(v, 'name')}
                                value={keywords.name}
                            />
                        </View>
                        <View style={goodsCss.goods_details_list}>
                            <Text style={{ flex: 50 }}>Email:</Text>
                            <TextInput
                                style={{ flex: 50 }}
                                placeholder="Email"
                                onChangeText={(v) => this.onChange(v, 'email')}
                                value={keywords.email}
                            />
                        </View>
                        <View style={goodsCss.goods_details_list}>
                            <Text style={{ flex: 50 }}>Điện thoại:</Text>
                            <TextInput
                                style={{ flex: 50 }}
                                placeholder="Điện thoại"
                                onChangeText={(v) => this.onChange(v, 'phone')}
                                value={keywords.phone}
                            />
                        </View>
                        <View style={goodsCss.goods_details_list}>
                            <Text style={{ flex: 50 }}>Nhóm quyền:</Text>
                            <View style={{ flex: 50 }}>
                                <RNPickerSelect
                                    placeholder={{
                                        label: 'Nhóm quyền',
                                        value: null,
                                    }}
                                    items={this.listRole()}
                                    onValueChange={(v) => this.onChange(v, 'role')}
                                    style={{
                                        iconContainer: {
                                            top: 10,
                                            right: 12,
                                        },
                                    }}
                                    value={parseInt(keywords.role)}
                                    Icon={() => <Ionicons name="md-arrow-dropdown" size={24} color="gray" />}
                                />
                            </View>
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
        //height: 10,
        padding: 10,
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