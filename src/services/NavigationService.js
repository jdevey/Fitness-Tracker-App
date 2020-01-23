import React from 'react';

import {
    createAppContainer,
    createStackNavigator,
    NavigationActions
} from 'react-navigation';

import AfterActivity from '../screens/AfterActivity';
import History from '../screens/History';
import HistoryDetail from '../screens/HistoryDetail';
import Home from '../screens/Home';
import LiveActivity from '../screens/LiveActivity';
import Rewards from '../screens/Rewards';
import StartActivity from '../screens/StartActivity';
import TakePicture from '../screens/TakePicture';

let NavigationService = class NavigationService {
    constructor() {}

    getTopNavigator() {
        return (
            <TopLevelNavigator
                ref={navigatorRef => {
                    this._navigator = navigatorRef;
                }}
            />
        );
    }

    navigate(routeName, params) {
        this._navigator.dispatch(
            NavigationActions.navigate({
                routeName,
                params,
            })
        );
    }
}

const navigationService = new NavigationService();
export default navigationService;

const Root = createStackNavigator(
    {
		AfterActivity: AfterActivity,
		History: History,
		HistoryDetail: HistoryDetail,
		Home: Home,
		LiveActivity: LiveActivity,
		Rewards: Rewards,
		StartActivity: StartActivity,
		TakePicture: TakePicture
    },
    {
        initialRouteName: 'Home'
    }
);

const TopLevelNavigator = createAppContainer(Root);
