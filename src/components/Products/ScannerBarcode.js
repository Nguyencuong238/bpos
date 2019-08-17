import qs from 'qs';
import React, { Component } from 'react';
import { ScrollView, Text, View, Button, Picker, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import NavigatorService from '../../services/NavigatorService';

class ScannerBarcode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      scanned: false,
    };
  }

  async componentDidMount() {
    this.getPermissionsAsync();
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  };

  handleBarCodeScanned = ({ type, data }) => {
    this.setState({ scanned: true });
    Alert.alert(`Mã: ${data}`);

    NavigatorService.navigate('Goods', {
      barcodeProduct: data
    })
  };

  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Yêu cầu quyền truy cập camera</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>Không thể mở camera</Text>;
    }
    return (
      <View
        style={{
          flex: 1,
        }}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />

        {scanned && (
          <Button title={'Click để tiếp tục'} onPress={() => this.setState({ scanned: false })} />
        )}
      </View>
    );
  }
}

export default ScannerBarcode;

ScannerBarcode.navigationOptions = {
  title: 'Quet Ma Vach',
  drawerLabel: () => null,
};


