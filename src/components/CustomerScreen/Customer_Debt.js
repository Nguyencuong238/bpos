import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator,Button, Modal} from 'react-native';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import { customer_api, getTags } from '../../services/api/fetch';
import Modal_PayDebt from './Modal_PayDebt';
import Modal_Debt from './Modal_Debt';
import { showMessage, FlashMessage } from "react-native-flash-message";
import Modal_Receipts from './Receipts';
import Spinner from 'react-native-loading-spinner-overlay';


class Customer_Debt extends Component {
    constructor(props) {
        super(props);
        this.props.navigation.addListener('willFocus', () => {
            this.setState(
                {
                    currentPage: 1,
                    spinner: true,
                },
                () => {
                    this.getListDebt();
                }
            );
        });
        this.state = {
            debt: null,
            total_debt: '',
            currentPage: 1,
            limit: 10,
            loading: false,
            refreshing: false,
            total: 0,
            loadingModal:false,
            modalVisible:false,
            modalVisible1:false,
            spinner: false,
            typeReceipts:'THU',
        }
    }

    componentDidMount() {
        this.getListDebt();
    }

    getListDebt = () => {
        const { info_customer } = this.props;
        const { currentPage, limit } = this.state;
        const offset = (currentPage - 1) * limit;
        this.setState({ loading:true }, () => {
            customer_api({
                mtype: 'getInfo',
                customer_id: info_customer.customer_id.value,
                offset,
                limit,
            }).then(({ customer }) => {
                console.log(customer,' tong total');
                this.setState({
                    loading: false,
                    debt: currentPage === 1 ? customer.debt : [...this.state.debt, ...customer.debt],
                    refreshing: false,
                    spinner:false,
                    total_debt: customer.total_debt,
                    total: (!isEmpty(customer.debt)) ? customer.totaldebt : this.state.total,
                });
                
            });
        });
        
    }

    resfreshList = () => {
        this.setState(
            {
                currentPage: 1,
                // spinner: true,
            },
            () => {
                this.getListDebt();
    
            }
        );
    } 

    getListDebtMore() {
        const { info_customer } = this.props;
        const { currentPage, limit } = this.state;
        const offset = (currentPage - 1) * limit;
        this.setState({ loading: true }, () => {
            customer_api({
                mtype: 'getInfo',
                customer_id: info_customer.customer_id.value,
                offset,
                limit,
            }).then(({ customer }) => {
                this.setState({
                    debt: currentPage === 1 ? customer.debt : [...this.state.debt, ...customer.debt],
                    loading: false,
                    refreshing: false,
                    total_debt: customer.total_debt,
                    total: (!isEmpty(customer.debt)) ? customer.totaldebt : this.state.total,
                });  
            });
        });
    }

    renderItem = (item,index) => {
        return (
            <View>
                
                <View style={styles.container2}>
                    <View style={{marginTop:15,marginLeft:15,marginRight:15}}>
                        <Text>
                            {item.bill_id}
                            {parseInt(item.is_delete, 10) !== 0
                                && ( 'Đã hủy')
                            }
                        </Text>
                        <Text style={{marginTop:7}}> {!isEmpty(item.create_time) ? moment(item.create_time).format('DD/MM/YYYY HH:mm:ss') : moment(item.created_at).format('DD/MM/YYYY HH:mm:ss')}</Text>
                    </View>
                    <View style={{marginTop:15,marginLeft:15,marginRight:15}}>
                        <Text>
                            {item.type === 'HD' && 'Bán hàng'}
                            {item.type === 'TTHD' && 'Thanh toán'}
                            {item.type === 'TH' && 'Trả hàng'}
                            {item.type === 'TTTH' && 'Thanh toán'}
                            {item.type === 'TTM' && 'Thanh toán(Sổ quỹ)'}
                            {item.type === 'CTM' && 'Thanh toán(Sổ quỹ)'}
                        </Text>
                        <Text style={{marginTop:7}}>        
                            <NumberFormat
                                value={parseFloat(item.amount)}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={' đ'}
                                renderText={value => <Text>{value}</Text>}
                            />
                        </Text>
                    </View>         
                </View>
            </View>
        )
    }

    renderSeparator = () => {
		return (
			<View
				style={{
					height: 1,
					width: "100%",
					backgroundColor: "#CED0CE",
					 marginTop: 15,
				}}
			/>
		);
    };
    
    renderHeader = () => {
        const {total_debt, total} = this.state;
        const { info_customer } = this.props;
		return (
			<View style={styles.container1}>
                <View style={{marginTop:10}}>
                    <Text > {total} bản ghi</Text>
                </View>
                <View style={{marginTop:10, flexDirection: 'row'}}>
                    <Text > Nợ cần thu :</Text>
                    <Text> 
                        <NumberFormat
                            value={parseFloat(total_debt)}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={' đ'}
                            renderText={value => <Text>{value}</Text>}
                        />
                    </Text>
                </View>   
            </View>
		);
    };
    
    handleRefresh = () => {
		this.setState(
			{
				currentPage: 1,
				refreshing: true,
			},
			() => {
				this.getListDebt();
			}
		);
    };
    
    handleLoadMore = () => {
        const { debt, total } = this.state;
        const {length} = debt;
		if ( this.state.loading === false && length <total) {
			this.setState(
				{
					currentPage: this.state.currentPage + 1,
					loading: true,
				},
				() => {
					this.getListDebt();
				}
			);
		}
    };
    
    renderFooter = () => {
		if (!this.state.loading) return null;
		return (
			<View
				style={{
					paddingVertical: 20,
					borderTopWidth: 1,
					borderColor: "#CED0CE"
				}}
			>
				<ActivityIndicator animating size="large" />
			</View>
		);
    };

    setModalVisible = (visible) => {
		this.setState({ modalVisible: visible });

	}
    
    onVisible = (spinner) => {
        
        this.onVisibleLocal(spinner);
    }

    onVisibleLocal(spinner) {
        const { modalVisible } = this.state;
        if (spinner) {
            this.setState({
                modalVisible: !modalVisible,
                spinner,
            },() =>{});
        } else {
            this.setState({
                modalVisible: !modalVisible,
            });
        }    
    }

    onVisible1 = (spinner) => {
        this.onVisibleLocal1(spinner);
    }

    onVisibleLocal1(spinner) {
        const { modalVisible1 } = this.state;
        if (spinner) {
            this.setState({
                modalVisible1: !modalVisible1,
                spinner,
            },()=>{});
        } else {
            this.setState({
                modalVisible1: !modalVisible1,
            });
        }
        
    }

    render() {
        const {debt, modalVisible, total_debt, loadingModal, typeReceipts,modalVisible1} = this.state;
        const {info_customer} = this.props;
        return (
            <View >        
                <FlatList
					data={debt}
					extraData={this.state}
					renderItem={({ item, index }) => (
                        this.renderItem(item, index)
					)}
					keyExtractor={item => item.id}
					ItemSeparatorComponent={this.renderSeparator}
					ListHeaderComponent={this.renderHeader}
					ListFooterComponent={this.renderFooter}
					onRefresh={this.handleRefresh}
					refreshing={this.state.refreshing}
					onEndReached={this.handleLoadMore}
					onEndReachedThreshold={0}
                    stickyHeaderIndices={[0]}
				/>
                <View style={Main.btn_fixed} >
                    <View style={Main.btn_fixed_box}>
                        <Button
                            title="Thêm"
                            // onPress={this.onShowType}
                            onPress={this.onVisible1}
                            // onPress={() => this.setState({modalVisible:true})}
                            buttonStyle={Main.btn_submit_button}
                            containerStyle={Main.btn_submit_button_box}
                            titleStyle={Main.btn_submit_button_title}
                        />
                    </View>
                    <View style={Main.btn_fixed_box}>
                        <Button
                            title="Thanh toán"
                            // onPress={this.onShowType}
                            onPress={this.onVisible }
                            // onPress={() => this.setState({modalVisible:true})}
                            buttonStyle={Main.btn_submit_button}
                            containerStyle={Main.btn_submit_button_box}
                            titleStyle={Main.btn_submit_button_title}
                        />
                    </View>
                    <View style={Main.btn_fixed_box}>
                        <Button
                            title="Nộp tiền"
                            // onPress={this.onShowType}
                            onPress={() => this.props.navigation.navigate(
                                'Receipts', 
                                { 
                                    item:{
                                        current_id:0,
                                        typeReceipts:typeReceipts,
                                    }
                                }
                            )}
                            buttonStyle={[Main.btn_submit_button, Main.btn_submit_button_success]}
                            containerStyle={Main.btn_submit_button_box}
                            titleStyle={Main.btn_submit_button_title}
                        />
                    </View>
                </View>
                <Spinner
					visible={this.state.spinner}
					textStyle={styles.spinnerTextStyle}
				/> 
                <Modal_PayDebt
                    resfreshList={this.resfreshList} 
                    onVisible={this.onVisible} 
                    modalVisible = {modalVisible} 
                    total_debt= {total_debt} 
                    {...this.props}

                />
                <Modal_Debt
                    onVisible1={this.onVisible1}
                    modalVisible1 = {modalVisible1} 
                    resfreshList={this.resfreshList} 
                />         
            </View>
        );
    }
}

const mapStateToProps = ({ state, persist }) => ({
    info_customer: state.info_customer,
    depot_current: persist.depot_current,
    profile: persist.profile,
});
export default connect(mapStateToProps)(Customer_Debt);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor:'#4CAF50',
    },
    container1: {
        flex: 1,
        backgroundColor:'#D3D3D3',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height:35,
    },
    container2: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    input: {
        marginTop: 20,
    },
    picker: {

        marginLeft: 10,
        marginTop: -10,

    },
    title: {
        marginRight: 37,
        fontSize: 18,
    },
    title1: {
        marginRight: 25,
        fontSize: 18,
    },
    title2: {
        marginRight: 32,
        fontSize: 18,
    },
    title3: {
        marginRight: 56,
        fontSize: 18,
    },
    title4: {
        marginRight: 42,
        fontSize: 18,
    },
    gender: {
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    actiitemityIndicatorWrapper: {
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
    color_link:{
       color:'#0084cc',
    },
    color_error:{
        color:'red',
    },
    no_bg:{
       backgroundColor:0,
    },
    padding_15:{
        padding:15,
    },
    margin_15:{
        margin:15,
    },
    table_container: { 
        padding: 10, 
        backgroundColor: '#FFF',
        height:230 
    },
    table_scroll: {
        height:120 
    },
    table_head: {  
        height: 40, 
        backgroundColor: '#f1f8ff'  
    },
    table_total:{
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
    select_box_main:{
        backgroundColor:'#efefef',
        padding:15,
        flexDirection:'row',
        justifyContent: 'space-between',
        borderBottomWidth:1,
        borderBottomColor:'#ddd'
    },
    select_box_item:{
        flexDirection:'row',
        alignItems: 'center',
    },
    select_box_item_action_icon:{
        flexDirection:'row',
        alignItems: 'center',
    },
    btn_fixed:{
        position:'absolute',
        bottom:0,
        width:'100%',
        flexDirection:'row',
        backgroundColor:'#ddd',
        justifyContent:'space-around',
        padding:10,
        paddingHorizontal: 0,
    },
    btn_fixed_box:{
        flex:50,
        width:'33.33%',
        paddingHorizontal:15,
    },
    btn_submit_button:{
        width:'100%',
    },
    btn_submit_button_title:{
        fontSize:15,
    },
    btn_submit_button_success:{
        backgroundColor:'#28af6b',
    }
})

