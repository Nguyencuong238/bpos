import React from 'react';
import {View,TouchableOpacity,} from 'react-native';
import { Ionicons } from "@expo/vector-icons";

export default class HeaderLeft extends React.Component {
    toggleDrawer = () => {
        this.props.navigationProps.toggleDrawer();
    };
    render() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
                    <Ionicons
                        name="md-menu"
                        size={32}
                        color="#fff"
                        style={{ marginLeft: 15 }}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}