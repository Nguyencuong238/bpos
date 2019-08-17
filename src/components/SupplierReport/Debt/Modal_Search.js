// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { isEmpty, filter, split, find, forEach } from 'lodash';
// import { View, ScrollView, Text, Image, RefreshControl, TouchableOpacity, StyleSheet, AsyncStorage } from 'react-native';
// import { product_api, productCategory_api } from '../../../services/api/fetch';
// import NumberFormat from 'react-number-format';
// import { goodsCss } from '../../../styles/goods';
// import { Main } from '../../../styles/main';
// import NavigatorService from '../../../services/NavigatorService';
// import Modal from 'react-native-modal';
// import Icon from "react-native-vector-icons/Ionicons";
// import { Ionicons } from "@expo/vector-icons";
// import DateTimePicker from "react-native-modal-datetime-picker";
// import moment from 'moment';
// import RNPickerSelect from 'react-native-picker-select';

// class Modal_Search extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             loading: false,
//             refreshing: false,
//             datef: moment().format('YYYY-MM-DD'),
//             datet: moment().format('YYYY-MM-DD'),
//             visibleModal: false,
//             isDateTimePickerVisibleF: false,
//             isDateTimePickerVisibleT: false,
//             depot: 1,
//         };
//     }

//     componentDidMount() {
//     }

//     componentWillReceiveProps(nextProps) {
//         const { visibleModal } = this.props;
//         if (visibleModal) {
//             this.setState({ visibleModal: this.props.visibleModal });
//         }
//     }

//     _onRefresh = () => {
//         this.setState({ refreshing: true });
//         this.getList();
//     }

//     handleDatePicked = (type, date) => {
//         if (type === 'from') {
//             this.setState({ datef: moment(date).format('YYYY-MM-DD') });
//             this.hideDateTimePickerF();
//         } else if (type === 'to') {
//             this.setState({ datet: moment(date).format('YYYY-MM-DD') });
//             this.hideDateTimePickerT();
//         }
//     };

//     onChangeDepot(value) {
//         const depot = parseInt(value);
//         if (depot > 0) {
//             this.setState({ depot });
//         }
//     }

//     async onSubmit() {
//         const { datef, datet, depot } = this.state;
//         if (depot > 0) {
//             await AsyncStorage.multiSet([['depot', JSON.stringify(depot)], ['datef', JSON.stringify(datef)], ['datet', JSON.stringify(datet)]]);
//             NavigatorService.navigate('CustomerReport', {
//                 depot: 3,
//                 datef: datef,
//                 datet: datet,
//             });
//         }
//         this.setState({ visibleModal: false });
//     }

//     listDepot() {
//         const { depots, profile, userRole } = this.props;
//         const { depot } = profile;
//         let items = [
//             {
//                 label: 'Chọn kho...',
//                 value: 0,
//             }
//         ];
//         let depots_perm = filter(split(depot, ','), (v) => !isEmpty(v));
//         let listDepots = filter(depots, (v) => depots_perm.includes(v.id));
//         if (find(userRole, (o) => o.role_id === 1)) {
//             listDepots = depots;
//         }
//         if (!isEmpty(listDepots)) {
//             items = [];
//             forEach(listDepots, (v) => {
//                 items.push({
//                     label: v.name,
//                     value: v.id,
//                 })
//             });
//         }
//         return items;
//     }

//     hideDateTimePickerF = () => {
//         this.setState({ isDateTimePickerVisibleF: false });
//     };

//     hideDateTimePickerT = () => {
//         this.setState({ isDateTimePickerVisibleT: false });
//     };

//     showDateTimePickerF = () => {
//         this.setState({ isDateTimePickerVisibleF: true });
//     };

//     showDateTimePickerT = () => {
//         this.setState({ isDateTimePickerVisibleT: true });
//     };

//     _renderModalContent = () => {
//         const { depot_current } = this.props;
//         const { datet, datef } = this.state;
//         return (
//             <View style={styles.modalContent}>
//                 <View style={styles.modalHeader}>
//                     <TouchableOpacity style={{ flex: 20 }} onPress={() => this.setState({ visibleModal: false })}>
//                         <Icon
//                             name="md-arrow-back"
//                             size={25}
//                             color="white"
//                         />
//                     </TouchableOpacity>
//                     <Text style={{ flex: 60, textAlign: 'center', color: '#fff', fontSize: 18 }} >Bộ lọc</Text>
//                     <TouchableOpacity style={{ flex: 20, textAlign: 'right' }} onPress={() => this.onSubmit()}>
//                         <Icon
//                             name="ios-search"
//                             size={25}
//                             color="white"
//                             style={{ textAlign: 'right' }}
//                             rotate={-90}
//                             flip={'horizontal'}
//                         />
//                     </TouchableOpacity>
//                 </View>
//                 <View style={styles.modalInfo} >
//                     <View style={styles.modalInfoRows}>
//                         <Text style={styles.modalTitle} onPress={this.showDateTimePickerF}>Ngày bắt đầu:</Text>
//                         <Text style={styles.modalInput} >{moment(this.state.datef).format('YYYY-MM-DD')}</Text>
//                         <DateTimePicker
//                             isVisible={this.state.isDateTimePickerVisibleF}
//                             onConfirm={(date) => this.handleDatePicked('from', date)}
//                             onCancel={this.hideDateTimePickerF}
//                             date={new Date(datef)}
//                         />
//                     </View>
//                     <View style={styles.modalInfoRows}>
//                         <Text style={styles.modalTitle} onPress={this.showDateTimePickerT}>Ngày kết thúc:</Text>
//                         <Text style={styles.modalInput}>{moment(this.state.datet).format('YYYY-MM-DD')}</Text>
//                         <DateTimePicker
//                             isVisible={this.state.isDateTimePickerVisibleT}
//                             onConfirm={(date) => this.handleDatePicked('to', date)}
//                             onCancel={this.hideDateTimePickerT}
//                             date={new Date(datet)}
//                         />
//                     </View>
//                     <Text> Chọn kho:</Text>
//                     <RNPickerSelect
//                         placeholder={{
//                             label: 'Chọn kho...',
//                             value: null,
//                         }}
//                         items={this.listDepot()}
//                         onValueChange={(value) => this.onChangeDepot(value)}
//                         style={{
//                             flex: 60,
//                             // ...pickerSelectStyles,
//                             iconContainer: {
//                                 top: 10,
//                                 right: 12,
//                             },
//                         }}
//                         value={parseInt(this.state.depot)}
//                         Icon={() => {
//                             return <Ionicons name="md-arrow-dropdown" size={24} color="gray" />;
//                         }}
//                     />
//                 </View>
//             </View>
//         )
//     };

//     render() {
//         const { visibleModal } = this.state;
//         return (
//             <ScrollView
//                 refreshControl={
//                     <RefreshControl
//                         refreshing={this.state.refreshing}
//                         onRefresh={this._onRefresh}
//                     />
//                 }>
//                 <View>
//                     <Modal isVisible={visibleModal === true}>
//                         {this._renderModalContent()}
//                     </Modal>
//                 </View>
//             </ScrollView>
//         );
//     }
// }

// const mapStateToProps = ({ persist }) => ({
//     depot_current: persist.depot_current,
//     depots: persist.depots,
//     profile: persist.profile,
//     userRole: persist.userRole,
// });

// export default connect(mapStateToProps)(Modal_Search);

// const styles = StyleSheet.create({
//     modalContent: {
//         flex: 1,
//         flexDirection: 'column',
//         backgroundColor: 'white',
//         borderRadius: 4,
//         borderColor: 'rgba(0, 0, 0, 0.1)',
//         overflow: 'hidden'
//     },
//     modalHeader: {
//         flex: 10,
//         flexDirection: 'row',
//         backgroundColor: '#28af6b',
//         alignSelf: 'center',
//         alignItems: 'center',
//         height: 10,
//         padding: 15,
//         overflow: 'hidden'
//     },
//     modalInfo: {
//         flex: 100,
//         padding: 15
//     },
//     modalTitle: {
//         flex: 40,
//     },
//     modalInput: {
//         flex: 60,
//     },
//     modalInfoRows: {
//         flex: 100,
//         flexDirection: 'row',
//         // alignSelf: 'center',
//         alignItems: 'stretch',
//         overflow: 'hidden'
//     }
// });







import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty, filter, split, find, forEach } from 'lodash';
import { View, ScrollView, Text, Image, RefreshControl, TouchableOpacity, StyleSheet, AsyncStorage } from 'react-native';
import { product_api, productCategory_api } from '../../../services/api/fetch';
import NumberFormat from 'react-number-format';
import { goodsCss } from '../../../styles/goods';
import { Main } from '../../../styles/main';
import NavigatorService from '../../../services/NavigatorService';
import Modal from 'react-native-modal';
import Icon from "react-native-vector-icons/Ionicons";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
import { Input, Button } from 'react-native-elements';
class Modal_Save extends Component{
    constructor(props) {
        super(props);
        this.state = {
            datef: moment().startOf('isoWeek').format('YYYY-MM-DD'),
            datet: moment().format('YYYY-MM-DD'),
        };
    }

    onVisibleLocal() {
        const { onVisible1 } = this.props;
        if (onVisible1) onVisible1();
        
    }

    submitForm() {
        // const { onVisible1, onVisibleModal1 } = this.props;
        // if (onVisible1) onVisible1();
        // if (onVisibleModal1) onVisibleModal1();
    }

    _renderModalContent = () => {
        const { depot_current } = this.props;
        const { datet, datef } = this.state;
        return (
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity style={{ flex: 20 }} onPress={() => this.onVisibleLocal()}>
                        <Icon
                            name="md-arrow-back"
                            size={25}
                            color="white"
                        />
                    </TouchableOpacity>
                    <Text style={{ flex: 60, textAlign: 'center', color: '#fff', fontSize: 18 }} >Bộ lọc</Text>
                    <TouchableOpacity style={{ flex: 20, textAlign: 'right' }} onPress={() => this.onSubmit()}>
                        <Icon
                            name="ios-search"
                            size={25}
                            color="white"
                            style={{ textAlign: 'right' }}
                            rotate={-90}
                            flip={'horizontal'}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.modalInfo} >
                    <View style={styles.modalInfoRows}>
                        <Text style={styles.modalTitle} onPress={this.showDateTimePickerF}>Ngày bắt đầu:</Text>
                        <Text style={styles.modalInput} >{moment(this.state.datef).format('YYYY-MM-DD')}</Text>
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisibleF}
                            onConfirm={(date) => this.handleDatePicked('from', date)}
                            onCancel={this.hideDateTimePickerF}
                            date={new Date(datef)}
                        />
                    </View>
                    <View style={styles.modalInfoRows}>
                        <Text style={styles.modalTitle} onPress={this.showDateTimePickerT}>Ngày kết thúc:</Text>
                        <Text style={styles.modalInput}>{moment(this.state.datet).format('YYYY-MM-DD')}</Text>
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisibleT}
                            onConfirm={(date) => this.handleDatePicked('to', date)}
                            onCancel={this.hideDateTimePickerT}
                            date={new Date(datet)}
                        />
                    </View>
                    <Text> Chọn kho:</Text>
                    <RNPickerSelect
                        placeholder={{
                            label: 'Chọn kho...',
                            value: null,
                        }}
                        items={this.listDepot()}
                        onValueChange={(value) => this.onChangeDepot(value)}
                        style={{
                            flex: 60,
                            // ...pickerSelectStyles,
                            iconContainer: {
                                top: 10,
                                right: 12,
                            },
                        }}
                        value={parseInt(this.state.depot)}
                        Icon={() => {
                            return <Ionicons name="md-arrow-dropdown" size={24} color="gray" />;
                        }}
                    />
                </View>
            </View>
        )
    };

    render() {
        const { visible } = this.props;
        return (
                <Modal
                    isVisible={visible}
                >   
                <View style={styles.modalContent}>
                    <Text>
                        Hệ thống tìm được 1 bản nháp chưa được lưu lên máy chủ. Bạn có muốn tiếp tục làm việc với bản nháp này?
                    </Text>
                    {/* {this._renderModalContent()} */}
                </View>
                    <Button
                        title="Bỏ qua"
                        onPress={() => this.onVisibleLocal()}
                    />
                    <Button
                        title="Đồng ý"
                        onPress={() => this.submitForm(0)}
                    />
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


  
const stocktakesCss = StyleSheet.create({
      menu_action:{
          backgroundColor:'#ddd',
          padding:10,
          justifyContent: 'flex-end',
          flexDirection: 'row',
      },
      stocktakesCss_list_right:{
          textAlign:'right',
      },
      stocktakesCss_list_code:{
          fontWeight:'700',
          fontSize:15,
          marginBottom: 5,
      },
      stocktakesCss_list_time:{
          fontSize:12,
          fontStyle:'italic',
          color:'#545454'
      },
      stocktakesCss_list_status:{
          fontSize:13,
          marginTop:5,
          color:'#545454'
      },
      stocktakesCss_list_user:{
          fontSize:12,
          color:'#28af6b',
          textAlign:'right',
          flexDirection:'row',
          alignItems:'center',
          justifyContent:'flex-end'
      },
      stocktakesCss_list_link:{
          paddingLeft: 5,
      },
      stocktakesCss_list_box:{
          flex:1,
          padding:10,
          flexDirection:'row',
          alignItems:'center',
          justifyContent: 'space-between',
          //backgroundColor: this.props.index % 2  == 0 ? 'red' : 'yellow'
      },
      stocktakesCss_list:{
          marginBottom:150,
          paddingBottom: 10,
      },
      createStockTake_box:{
          flex:1,
      },
      createStockTake_main:{
          paddingVertical:10,
          alignItems:'center'
      },
      search_form_control:{
          backgroundColor:'#fff',
          flex:30,
          padding:0,
      },
      search_form_input:{
          fontSize:14,
          paddingHorizontal: 10,
      },
      search_icon:{
          marginLeft:0,
      }
});
  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      backgroundColor: 'lightblue',
      padding: 12,
      margin: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 22,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
});