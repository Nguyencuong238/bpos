import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/reducers/store/index';
import AppNavigator from './src/navigation/AppNavigator';
import Navigation from './src/navigation/Navigation';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import FlashMessage from "react-native-flash-message";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  renderDrawer = () => {
    return (
      <View>
        <Text>I am in the drawer!</Text>
      </View>
    );
  };

  render() {
    console.disableYellowBox = true;
    return (
      <Provider store={store}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <Navigation {...this.props} />
        </View>
        <FlashMessage position="top" />
      </Provider>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
