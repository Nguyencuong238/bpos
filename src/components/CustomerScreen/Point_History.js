import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator} from 'react-native';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import { customer_api, getTags } from '../../services/api/fetch';


class Point_History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            debt: null,
            customer:props.info_customer.customer_id,
            currentPage: 1,
            limit: 10,
            loading: false,
            refreshing: false,
            total: 0,
            loading: false,
            listPoint:null,
        }
    }

    componentDidMount() {
        this.getList();
    }

    getList() {
        const { currentPage, customer,limit } = this.state;
        const offset = (currentPage - 1) * limit;
        const params = {
            mtype: 'getPointHistory',
            limit,
            offset,
            customer_id: customer.value,
        };
        this.setState({ loading: true });
        customer_api(params).then(({ listPoint, total }) => {
            console.log(listPoint,'le ke');
            this.setState({ 
                listPoint:currentPage === 1 ? listPoint : [...this.state.listPoint, ...listPoint],
                refreshing:false, 
                loading: false,
                total 
            });
        });
    }

    renderItem = (item,index) => {
        return (
            <View>
                <View style={styles.container2}>
                    <View style={{marginTop:15,marginLeft:15,marginRight:15}}>
                        <Text style={{marginTop:7}}>{item.order_invoice}</Text>
                        <Text style={{marginTop:7}}>{item.created_at}</Text>
                    </View>
                    <View style={{marginTop:15,marginLeft:15,marginRight:15}}>
                    <Text style={{marginTop:7}}>{item.point}</Text> 
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
        console.log('chay load more');
        const {listPoint, total} = this.state;
        const {length} = listPoint;
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
        const {listPoint} = this.state;
        return (
            <View>        
                <FlatList
					data={listPoint}
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
export default connect(mapStateToProps)(Point_History);

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

