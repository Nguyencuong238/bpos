import qs from 'qs';
import React, {Component} from 'react';
import { ScrollView,  Text,View, Button,Picker,FlatList,StyleSheet} from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';

class ScannerBarcode extends Component{
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
        // this.props.navigation.navigate('CreateStockTake',{barcodeProduct:data})
        this.props.navigation.navigate('SearchProductWarehouse',{barcodeProduct:data})
    };

    render() {
        const { hasCameraPermission, scanned } = this.state;
    
        if (hasCameraPermission === null) {
          return <Text>Requesting for camera permission</Text>;
        }
        if (hasCameraPermission === false) {
          return <Text>No access to camera</Text>;
        }
        return (
          <View
            style={{
              flex: 1,
            //   flexDirection: 'column',
            //   justifyContent: 'flex-end',
            }}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
    
            {scanned && (
              <Button title={'Tap to Scan Again'} onPress={() => this.setState({ scanned: false })} />
            )}
          </View>
        );
      }
}

export default ScannerBarcode;

ScannerBarcode.navigationOptions = {
    title: 'Quét mã vạch',
    drawerLabel: () => null,
};


