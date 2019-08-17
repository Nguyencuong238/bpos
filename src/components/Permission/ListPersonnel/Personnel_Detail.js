import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { ScreenOrientation } from 'expo';
import { Animated, ActivityIndicator, FlatList, StyleSheet, Text, View, Switch } from 'react-native';
import { isEmpty } from 'lodash';
import { personnel_api } from '../../../services/api/fetch';
import NumberFormat from 'react-number-format';
import ModalSearch from './ModalSearch';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from "@expo/vector-icons";

class Personnel_Detail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            refreshing: false,
            visibleModal: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        console.log(nextProps.navigation);
        const {personnel_id} = nextProps.navigation.state.params;
        this.setState({personnel_id}, () => {
            this.getData();
        });
    }

    getData() {
        const { personnel } = this.state;
        this.setState({ loading: true });
        personnel_api({ mtype: 'getById', personnel_id: 1 }).then(({ personnel }) => {
            console.log(personnel);
            this.setState({ personnel, loading: false });
        });
    }

    render() {
        const { personnel, refreshing, visibleModal, loading } = this.state;
        return (
            <View style={{flex: 1}}>
                {!loading ? (
                    <View style={{ flex: 1 }}>
                        <View>
                            <View>
                                <Image
                                    style={{width: 50, height: 50}}
                                    source={{uri: 'https://facebook.github.io/react-native/img/tiny_logo.png'}}
                                />
                            </View>
                            <View>
                                <Text>Vu minh duc</Text>
                                <Text>0989898983</Text>
                                <Text>abc@gmail.com</Text>
                            </View>
                        </View>
                        <View>
                            <Text>addd</Text>
                        </View>
                    </View>
                ) : (
                        <View style={styles.spin}>
                            <ActivityIndicator />
                        </View>
                    )}
            </View>
        );
    }
}

const mapStateToProps = ({ persist }) => ({
    depot_current: persist.depot_current,
});

export default connect(mapStateToProps)(Personnel_Detail);

const styles = StyleSheet.create({
    list_personnel: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        paddingRight: 5,
    },
    nodata: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    separator: {
        height: 1,
        width: "100%",
        backgroundColor: "#eee",
    },
    spin: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    fullname: {
        fontWeight: 'bold',
        paddingBottom: 10,
    },
    phone: {
        paddingBottom: 10,
        color: '#919191'
    },
    switch: {
        flex: 1,
        justifyContent: 'flex-start'
    },
    info_personnel: {
        flex: 1,
        flexDirection: 'column'
    }
});
