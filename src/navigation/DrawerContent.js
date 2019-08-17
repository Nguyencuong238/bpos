import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from "react-native-vector-icons/Ionicons"
import { DrawerItems, DrawerView, SafeAreaView } from 'react-navigation';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { MenuCss } from '../styles/menu';
import AuthService from '../core/auth/AuthService';
import { isEmpty, forEach, filter, find, split } from 'lodash';
import { Ionicons } from "@expo/vector-icons";
import NavigatorService from '../services/NavigatorService';
import RNPickerSelect from 'react-native-picker-select';
import { R_DEPOT_CURRENT } from '../reducers/actions';
import MultiSelect from '../components/library/MultiSelect/react-native-multi-select';

const auth = new AuthService();

class DrawerContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [2],
        };
    }

    clickMenu(router) {
        this.setState({ current_router: router }, () => {
            NavigatorService.navigate(router);
        });
    }

    listDepot() {
        const { depots, profile, userRole } = this.props;
        const { depot } = profile;
        let items = [
            {
                label: 'Chọn kho...',
                value: 0,
            }
        ];
        let depots_perm = filter(split(depot, ','), (v) => !isEmpty(v));
        let listDepots = filter(depots, (v) => depots_perm.includes(v.id));
        if (find(userRole, (o) => o.role_id === 1)) {
            listDepots = depots;
        }
        if (!isEmpty(listDepots)) {
            items = [];
            forEach(listDepots, (v) => {
                items.push({
                    label: v.name,
                    value: v.id,
                })
            });
        }

        return items;
    }

    onChangeDepot(value) {
        const { dispatch } = this.props;
        const depot = parseInt(value);
        if (depot > 0) {
            dispatch({ type: R_DEPOT_CURRENT, payload: parseInt(value) });
        }
    }

    onSelectedItemsChange = (selectedItems) => {
        this.setState({ selectedItems });
    };

    render() {
        const { depot_current } = this.props;
        const { selectedItems } = this.state;

        const items = [
            {
                id: 1,
                name: 'Ondo',
            }, {
                id: 2,
                name: 'Ogun',
            }, {
                id: '16hbajsabsd',
                name: 'Calabar',
            }, {
                id: 'nahs75a5sg',
                name: 'Lagos',
            }, {
                id: '667atsas',
                name: 'Maiduguri',
            }, {
                id: 'hsyasajs',
                name: 'Anambra',
            }, {
                id: 'djsjudksjd',
                name: 'Benue',
            }, {
                id: 'sdhyaysdj',
                name: 'Kaduna',
            }, {
                id: 'suudydjsjd',
                name: 'Abuja',
            },
        ];

        return (
            <View style={MenuCss.navigation_main} >
                <TouchableOpacity onPress={this.onShowProfile}>
                    <View style={MenuCss.navigation_info_account}>
                        <View style={MenuCss.navigation_info_avatar}>
                            <Image
                                style={MenuCss.navigation_info_img}
                                source={{ uri: 'http://vanhienblog.info/wp-content/uploads/2019/02/anh-gai-xinh-dep-hot-girl-1-00-600x445.jpg' }}
                            />
                        </View>
                        <View style={MenuCss.navigation_info_text}>
                            <Text style={MenuCss.navigation_info_title}>Dương Thanh Minh</Text>
                            <Text style={MenuCss.navigation_info_sub}>Front-end</Text>
                        </View>
                    </View>
                    {/* <View style={{paddingHorizontal:15}}>
                        <MultiSelect
                            // single
                            items={items}
                            uniqueKey="id"
                            onSelectedItemsChange={this.onSelectedItemsChange}
                            selectedItems={selectedItems}
                            selectText="Chọn danh mục"
                            searchInputPlaceholderText="Tìm kiếm..."
                            displayKey="name"
                            submitButtonText="Xác nhận"
                            animationType='fade'
                            onRemoveItem={(item) => {console.log('156',item)}}
                            // styleInputGroup={{backgroundColor:'red',margin:30}}
                            // styleItemsContainer={{backgroundColor:'red',margin:30}}
                            // styleDropdownMenu={{backgroundColor:'red',paddingLeft:30,paddingRight:30}}
                            // styleDropdownMenuSubsection={{backgroundColor:'red',margin:30}}
                            // styleListContainer={{backgroundColor:'red',margin:30}}
                            // styleMainWrapper={{backgroundColor:'red',margin:30}}
                            // styleRowList={{backgroundColor:'red',margin:30}}
                            // styleSelectorContainer={{backgroundColor:'red',margin:30}}
                            // styleTextDropdown={{backgroundColor:'red',margin:30}}
                            // styleTextDropdownSelected={{backgroundColor:'red',margin:30}}
                        />
                    </View> */}
                </TouchableOpacity>
                <View style={{ padding: 15, alignItems: 'center' }}>
                    <RNPickerSelect
                        placeholder={{
                            label: 'Chọn kho...',
                            value: null,
                        }}
                        items={this.listDepot()}
                        onValueChange={(value) => this.onChangeDepot(value)}
                        style={{
                            ...pickerSelectStyles,
                            iconContainer: {
                                top: 10,
                                right: 12,
                            },
                        }}
                        value={parseInt(depot_current)}
                        Icon={() => {
                            return <Ionicons name="md-arrow-dropdown" size={24} color="gray" />;
                        }}
                    />
                </View>
                <ScrollView style={MenuCss.menu_main}>
                    {/* <SafeAreaView style={{ flex: 1,marginTop:0,marginVertical:0,paddingTop:0,paddingVertical:0 }} forceInset={{ top: 'always', horizontal: 'never' }}> */}
                        <DrawerItems
                            {...this.props}
                            getLabel={(scene) => (
                                <View style={MenuCss.menu_list}>
                                    <Text style={MenuCss.menu_list_text}>{this.props.getLabel(scene)}</Text>
                                </View>
                            )}
                        />
                        {/* {!isEmpty(listRouter) && (
                            <FlatList
                                data={listRouter}
                                renderItem={({ item, index }) => {
                                    // let menu_list = MenuCss.menu_list;
                                    // if (current_router === item.router){
                                    //     const bgColor = {
                                    //         backgroundColor: '#ccc'
                                    //     }
                                    //     menu_list = { ...MenuCss.menu_list, ...bgColor };
                                    // }
                                    
                                    return (
                                        // <TouchableOpacity style={menu_list} onPress={() => this.clickMenu(item.router)}>
                                        //     <Icon
                                        //         name={item.icon}
                                        //         color='#000'
                                        //         size={20}
                                        //     />
                                        //     <Text style={MenuCss.menu_list_text}>{item.label}</Text>
                                        // </TouchableOpacity>
                                        <View style={[styles.screenStyle, (this.props.activeItemKey == item.router) ? styles.activeBackgroundColor : null]}>
                                            <Text style={[styles.screenTextStyle, (this.props.activeItemKey == item.router) ? styles.selectedTextStyle : null]} onPress={() => this.clickMenu(item.router)}>
                                                {this.props.activeItemKey} - {item.label}
                                            </Text>
                                        </View>
                                    );
                                }}
                            ></FlatList>
                        )} */}
                        <TouchableOpacity style={MenuCss.menu_list} onPress={() => auth.logout(() => this.goHome())}>
                            <Icon
                                name='ios-power'
                                color='#000'
                                size={20}
                                style={{marginHorizontal:16,width:24,textAlign:'center'}}
                            />
                            <Text style={MenuCss.menu_list_text}>Đăng xuất</Text>
                        </TouchableOpacity>
                    {/* </SafeAreaView> */}
                </ScrollView>
                <View style={MenuCss.navigation_logout}>
                    <Icon
                        name='ios-apps'
                        color='#000'
                        size={16}
                    />
                    <Text style={MenuCss.navigation_logout_text}>BPOS Team, Phiên bản v1.0</Text>
                </View>
            </View >
        )
    }
}

const mapStateToProps = ({ persist }) => ({
    depots: persist.depots,
    depot_current: persist.depot_current,
    profile: persist.profile,
    userRole: persist.userRole,
});

export default connect(mapStateToProps)(DrawerContent);

const styles = StyleSheet.create({
    container: {
        paddingTop: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 14,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 4,
        backgroundColor: 'white',
        color: 'black',
    },
});
