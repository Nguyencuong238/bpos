import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator, FlatList, Text, Modal, Button } from 'react-native';
import { ListItem, SearchBar, Input } from 'react-native-elements';
import { getTags, tag_api } from '../../services/api/fetch';
import MultiSelect from '../../components/library/MultiSelect/react-native-multi-select';
import { R_TAG } from '../../reducers/actions/index';
import { connect } from 'react-redux';
import FlashMessage, { showMessage } from "react-native-flash-message";
import { findKey, remove } from 'lodash';


class GroupCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            loadingModal: true,
            loadingModal1: false,
            page: 1,
            seed: 1,
            tags: [],
            text: '',
            refreshing: false,
            query: '',
            modalVisible: false,
            deletedRowKey: null,
            listProvince: null,
            selectedItems: [],
            selectedTags: [],
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        const customer_id = navigation.getParam('customer_id', 'NO-ID');
        this.getTags();
        if (customer_id !== 'NO-ID') {
            this.getTagsCustomer(customer_id);
        }
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    getTags() {
        const { dispatch } = this.props;
        tag_api({ mtype: 'getall' }).then(({ tags }) => {
            const tagid_arr = tags.map(v => {           //lấy id của tags 
                return v.tag_id;
            });
            this.setState({ selectedTags: tagid_arr });
            if (tags !== undefined) dispatch({ type: R_TAG, payload: tags });
        });
    }

    getTagsCustomer(customer_id) {
        getTags({ mtype: 'getall', customer_id: customer_id }).then(({ customer_tags }) => {
            if (customer_tags !== undefined) {
                const customer_tags_id = customer_tags.map(v => { // lấy tất cả các thẻ của id khách hàng chuyển vào selectedItems để hiển thị
                    return v.tag_id;
                });
                this.setState({
                    customer_tags,
                    selectedItems: customer_tags_id,
                    loadingModal: false,
                    customer_id,
                });
            } else {
                this.setState({
                    selectedItems: [],
                    loadingModal: false,
                    customer_id,
                });
            }
        });
    }

    onSelectedItemsChange = selectedItems => {
        const length = selectedItems.length;
        this.setState({ selectedItems });
        const { customer_id , customer_tags } = this.state;
        const params = {
            mtype: 'create',
            tag_id: selectedItems[length - 1],
            customer_id,
        };
        getTags(params).then(({ customer_tag }) => {
            customer_tag.tag_id = parseInt(customer_tag.tag_id);
            customer_tag.customer_id = parseInt(customer_tag.customer_id);
            const customer_tag_arr = [];
            customer_tag_arr.push(customer_tag);
            this.setState({ customer_tags: customer_tags.concat(customer_tag_arr) });
        });
    };

    onSelectedTagsChange = selectedTags => {
        this.setState({ selectedTags });
    };

    onCreateTag() {
        const { text, selectedTags } = this.state;
        const { tags, dispatch } = this.props;
        this.setState({ loading: true,loadingModal1:true }, () => {
            tag_api({
                mtype: 'create',
                name: text,
                color: 'blue',
            }).then((data) => {
                const tagsN = Object.assign([], tags);
                if (data.errors !== undefined) {
                    showMessage({
                        message: "Lỗi.",
                        description: "",
                        type: "danger",
                        duration: 1000,
                    });
                } else {
                    const { tag } = data;
                    const tmp = {
                        tag_id: tag.tag_id,
                        name: tag.name,
                        color: tag.color,
                        total_customer: 0,
                    };
                    tagsN.unshift(tmp);
                    dispatch({ type: R_TAG, payload: tagsN });
                    showMessage({
                        message: "Thêm thành công.",
                        description: "",
                        type: "success",
                        duration: 1000,
                    });
                }
                selectedTags.push(data.tag.tag_id);
                this.setState({ selectedTags,loadingModal1:false });
            });
        });
    }

    removeTagsCus = (item) => {
        const { tag_id } = item;
        const { customer_tags } = this.state;
        const id_delete = customer_tags.find((v) => {
            if (v.tag_id === tag_id) {
                return v;
            }
        });
        getTags({
            mtype: 'delete',
            id: id_delete.id,
        }).then(() => {
            
        });
    }

    removeTags = (item) => {
        const { tag_id } = item;
        const { dispatch, tags } = this.props;
        tag_api({
            mtype: 'delete',
            tag_id,
        }).then((data) => {
            const tagsClone = Object.assign([], tags);
            if (data.errors !== undefined) {
                // notification('error', 'Lỗi', first_array(data.errors.message));
                showMessage({
                    message: array[Object.keys(data.errors.message)[0]],
                    description: "",
                    type: "danger",
                });
            } else {
                remove(tagsClone, (v) => parseInt(v.tag_id, 10) === parseInt(tag_id, 10));
                dispatch({ type: R_TAG, payload: tagsClone });
                // notification('success', 'Thành công', first_array(data.data.message));
            }
        });
    }


    render() {
        const { selectedItems, loadingModal, selectedTags,loadingModal1 } = this.state;
        const { tags } = this.props;
        return (
            <View style={styles.container}>
                <MultiSelect
                    items={tags}
                    uniqueKey='tag_id'
                    ref={(component) => { this.multiSelect = component }}
                    onSelectedItemsChange={this.onSelectedItemsChange}
                    selectedItems={selectedItems}
                    selectText="Nhóm khách hàng"
                    searchInputPlaceholderText="Tìm kiếm..."
                    onChangeInput={(text) => console.log(text)}
                    tagRemoveIconColor="#CCC"
                    tagBorderColor="#CCC"
                    tagTextColor="#CCC"
                    selectedItemTextColor="#CCC"
                    selectedItemIconColor="#CCC"
                    itemTextColor="#000"
                    displayKey="name"
                    animationType='fade'
                    searchInputStyle={{ color: '#CCC' }}
                    submitButtonColor="#CCC"
                    submitButtonText="Submit"
                    onRemoveItem={(item) => { this.removeTagsCus(item) }}
                />
                <View>
                    {
                        this.multiselect
                            ?
                            this.multiselect.getSelectedItemsExt(selectedItems)
                            :
                            null
                    }
                </View>
                <View>
                    <Button
                        title="Thêm nhãn"
                        color="#841584"
                        onPress={() => {
                            this.setModalVisible(true);
                        }}
                    />
                </View>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                }}>
                    <Modal
                        transparent={true}
                        animationType={'none'}
                        visible={loadingModal1}
                        onRequestClose={() => { console.log('close modal') }}>
                        <View style={styles.modalBackground}>
                            <View style={styles.activityIndicatorWrapper}>
                                <ActivityIndicator
                                    animating={loadingModal1}
                                    size='large'
                                />
                            </View>
                        </View>
                    </Modal>
                    <View style={Main.select_box_main1}>
                        <View>
                            <Button
                                style={Main.select_box_item_action_icon}
                                title="Hủy"
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                }}
                            />
                        </View>
                        <View>
                            <Text style={Main.title}>Thêm nhóm KH</Text>
                        </View>
                        <View>
                            <Button
                                style={Main.select_box_item_action_icon}
                                title="Áp dụng "
                                onPress={() => {
                                    this.onCreateTag();
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ marginTop: 10, marginLeft: 10 }}>
                        <Text>KeyWord</Text>
                        <Input
                            onChangeText={(text) => this.setState({ text })}
                            style={{ marginTop: 50 }}
                            placeholder="Nhập tên nhãn"
                        />
                    </View>
                    <MultiSelect
                        items={tags}
                        uniqueKey='tag_id'
                        ref={(component) => { this.multiSelect = component }}
                        onSelectedItemsChange={this.onSelectedTagsChange}
                        selectedItems={selectedTags}
                        selectText="Nhóm khách hàng"
                        tagRemoveIconColor="#CCC"
                        tagBorderColor="#CCC"
                        tagTextColor="#CCC"
                        selectedItemTextColor="#CCC"
                        selectedItemIconColor="#CCC"
                        itemTextColor="#000"
                        displayKey="name"
                        animationType='fade'
                        searchInputStyle={{ color: '#CCC' }}
                        submitButtonColor="#CCC"
                        submitButtonText="Submit"
                        // hideDropdown = {true}
                        onRemoveItem={(item) => { this.removeTags(item) }}
                    />
                </Modal>
                <Modal
                    transparent={true}
                    animationType={'none'}
                    visible={loadingModal}
                    onRequestClose={() => { console.log('close modal') }}>
                    <View style={styles.modalBackground}>
                        <View style={styles.activityIndicatorWrapper}>
                            <ActivityIndicator
                                animating={loadingModal}
                                size='large'
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const mapStateToProps = ({ state }) => ({
    tags: state.tags,
});
export default connect(mapStateToProps)(GroupCustomer);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E',
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
});

const Main = StyleSheet.create({
    color_link: {
        color: '#0084cc',
    },
    color_error: {
        color: 'red',
    },
    no_bg: {
        backgroundColor: 0,
    },
    padding_15: {
        padding: 15,
    },
    margin_15: {
        margin: 15,
    },
    table_container: {
        padding: 10,
        backgroundColor: '#FFF',
        height: 230
    },
    table_scroll: {
        height: 120
    },
    table_head: {
        height: 40,
        backgroundColor: '#f1f8ff'
    },
    table_total: {
        height: 40,
        backgroundColor: '#FFF'
    },
    table_wrapper: {
        flexDirection: 'row'
    },
    table_title: {
        flex: 1,
        backgroundColor: '#f6f8fa'
    },
    table_row: {
        height: 30,
        backgroundColor: '#f9f9f9'
    },
    table_text: {
        textAlign: 'center'
    },
    select_box_main: {
        backgroundColor: '#efefef',
        padding: 15,
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    select_box_main1: {
        backgroundColor: '#39b54a',
        padding: 15,
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    select_box_item: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    select_box_item_action_icon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    select_box_item_action_add: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    btn_fixed: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#ddd',
        justifyContent: 'space-around',
        padding: 20,
        paddingHorizontal: 0,
    },
    btn_fixed_box: {
        flex: 50,
        width: '50%',
        paddingHorizontal: 15,
    },
    btn_submit_button: {
        width: '100%',
    },
    btn_submit_button_title: {
        fontSize: 15,
    },
    btn_submit_button_success: {
        backgroundColor: '#28af6b',
    },
    title: {
        fontSize: 20,
        marginTop: 6,
        color: 'white',
    },

})


