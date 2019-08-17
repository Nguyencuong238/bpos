import React, {Component} from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet,Text,View,TouchableOpacity ,TextInput,Picker,FlatList,TouchableHighlight,Alert} from 'react-native';
import { Input, Button } from 'react-native-elements';
import axios from 'axios';
import qs from 'qs';
import Modal from "react-native-modal";
import { R_PRODUCT_STOCK, R_STOCK_TAKES, R_EDIT_STOCKTAKES } from '../../reducers/actions';
import moment from 'moment';
import { isEmpty, findKey, includes, isArray, forEach, sumBy, filter,remove,  reduce as _reduce, chunk ,isNumber} from 'lodash';
import { Main } from '../../styles/main';
import { stocktakesCss } from '../../styles/stock';

class Modal_Save extends Component{
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    onVisibleLocal() {
        const { dispatch, onVisible1, onVisibleModal1 } = this.props;
        const list_stocktakes = [];
        dispatch({ type: R_EDIT_STOCKTAKES, payload: list_stocktakes });
        dispatch({ type: R_STOCK_TAKES, payload: list_stocktakes });
        if (onVisible1) onVisible1();
        if (onVisibleModal1) onVisibleModal1();
    }

    submitForm() {
        const { onVisible1, onVisibleModal1 } = this.props;
        if (onVisible1) onVisible1();
        if (onVisibleModal1) onVisibleModal1();
    }

    render() {
        const { visible } = this.props;
        return (
                <Modal
                    isVisible={visible}
                >   
                    <View style={{backgroundColor:'#fff',padding:15,overflow:'hidden'}}>
                        <View>
                            <Text style={{lineHeight:24,marginBottom:15,textAlign:'justify'}}>
                                Hệ thống tìm được 1 bản nháp chưa được lưu lên máy chủ. Bạn có muốn tiếp tục làm việc với bản nháp này?
                            </Text>
                        </View>
                        <View>
                            <View style={Main.row}>
                                <View style={Main.col_6}>
                                    <Button
                                        title="Bỏ qua"
                                        onPress={() => this.onVisibleLocal()}
                                        buttonStyle={{backgroundColor:'red',width:'100%'}}
                                        titleStyle={{fontSize:13}}
                                    />
                                </View>
                                <View style={Main.col_6}>
                                    <Button
                                        title="Đồng ý"
                                        onPress={() => this.submitForm(0)}
                                        buttonStyle={{backgroundColor:'#28af6b',width:'100%'}}
                                        titleStyle={{fontSize:13}}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
            </Modal>
        );
    }
}
const mapStateToProps = ({ state }) => ({
    product_stock: state.product_stock,
    list_stocktakes: state.list_stocktakes,
    list_stocktakes_save: state.list_stocktakes_save,
});
export default connect(mapStateToProps)(Modal_Save);
