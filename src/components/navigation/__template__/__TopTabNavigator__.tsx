import {
  MaterialTopTabNavigationProp,
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import React, {ReactElement} from 'react';

export type __TopTabParamList = {
  Test: undefined;
};

export type MyCollectionTopTabNavigationProps<
  T extends keyof __TopTabParamList
> = MaterialTopTabNavigationProp<__TopTabParamList, T>;

const Tab = createMaterialTopTabNavigator<__TopTabParamList>();

function __TopTabNavigator(): ReactElement {
  return (
    <Tab.Navigator>
      {/* <Tab.Screen name="Test" component={Test} /> */}
    </Tab.Navigator>
  );
}

export default __TopTabNavigator;
