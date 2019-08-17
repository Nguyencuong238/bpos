import React, { PureComponent } from 'react';
import { createStackNavigator, } from 'react-navigation';
import Report from '../components/ReportsPromotion/Report';
import PromotionDetail from '../components/ReportsPromotion/PromotionDetail';
import { MenuCss } from '../styles/menu';
import HeaderLeft from '../navigation/HeaderLeft';


export default ReportPromotionScreen = createStackNavigator({
    ReportPromotion: {
        screen: Report,
        navigationOptions: ({ navigation }) => ({
            title: 'Báo cáo khuyến mại',
            headerLeft: <HeaderLeft navigationProps={navigation} />,
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
        }),
    },
    ReportPromotionDetail: {
        screen: PromotionDetail,
        navigationOptions: ({ navigation }) => ({
            title: 'Chi tiết',
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
        }),
    },
});