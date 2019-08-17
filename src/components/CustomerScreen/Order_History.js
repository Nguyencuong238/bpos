import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator,TouchableOpacity} from 'react-native';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import { order_api, getTags } from '../../services/api/fetch';


class Order_History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            debt: null,
            customer:props.info_customer.customer_id,
            currentPage: 1,
            limit: 6,
            loading: false,
            refreshing: false,
            total: 0,
            loading: false,
            listOrder:null,
        }
    }

    componentDidMount() {
        this.getList();
    }

    getList() {
        const { currentPage, limit, customer } = this.state;
        const offset = (currentPage - 1) * limit;
        console.log(currentPage,'khach hehehe');
        const params = {
            mtype: 'getAll',
            limit,
            offset,
            customer_id: customer.value,
        };
        this.setState({ loading: true });
        console.log('chay heheh');
        order_api(params).then(({ orders, total }) => {
            console.log(orders,'tong lich su');
            this.setState({ 
                listOrder: orders,
                listOrder: currentPage === 1 ? orders : [...this.state.listOrder, ...orders],
                loading: false,
                total,
                refreshing:false
            });
        });
    }

    renderItem = (item,index) => {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('DetailOrder_History', { item })}>
                <View>
                    <View style={styles.container2}>
                        <View style={{marginTop:15,marginLeft:15,marginRight:15}}>
                            <Text>
                                <NumberFormat
                                    value={parseFloat(item.sub_total)}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={' đ'}
                                    renderText={value => <Text>{value}</Text>}
                                />
                            </Text>
                            <Text style={{marginTop:7}}>{item.invoice}</Text>
                            <Text style={{marginTop:7}}>{item.status_name}</Text>
                        </View>
                        <View style={{marginTop:15,marginLeft:15,marginRight:15}}>
                            <Text>{item.created_at}</Text>
                            <Text style={{marginTop:7}}>{item.seller_name}</Text>
                        </View>         
                    </View>
                </View>
            </TouchableOpacity>
            
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
    
    renderHeader = (list) => {
        console.log(list,'alal');
		return (
			<View style={styles.container1}>
                <View style={{marginTop:10,justifyContent: 'center',}}>
                    <Text >  giao dịch</Text>
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
				this.getList();
			}
		);
    };
    
    handleLoadMore = () => {
        const {listOrder,total} = this.state;
        const {length} = listOrder
		if ( this.state.loading === false && length < total) {
			this.setState(
				{
					currentPage: this.state.currentPage + 1,
					loading: true,
				},
				() => {
					this.getList();
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

    render() {
        const {listOrder} = this.state;
        console.log(listOrder,'than ma cl');
        return (
            <View>        
                <FlatList
					data={listOrder}
					extraData={this.state}
					renderItem={({ item, index }) => (
                        this.renderItem(item, index)
					)}
					keyExtractor={item => item.id}
					ItemSeparatorComponent={this.renderSeparator}
					// ListHeaderComponent={this.renderHeader(listOrder)}
					ListFooterComponent={this.renderFooter}
					onRefresh={this.handleRefresh}
					refreshing={this.state.refreshing}
					onEndReached={this.handleLoadMore}
					onEndReachedThreshold={0}
				/>    
            </View>
        );
    }
}

const mapStateToProps = ({ state, persist }) => ({
    info_customer: state.info_customer,
    depot_current: persist.depot_current,
});
export default connect(mapStateToProps)(Order_History);

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

const Main1 = StyleSheet.create({
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

