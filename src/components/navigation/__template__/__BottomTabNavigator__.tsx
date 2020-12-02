import {
  MaterialBottomTabNavigationProp,
  createMaterialBottomTabNavigator,
} from '@react-navigation/material-bottom-tabs';
import React, { ReactElement } from 'react';

export type __BottomTabParamList = {
  Test: undefined;
};

export type __BottomTabNavigationProps<
  T extends keyof __BottomTabParamList
> = MaterialBottomTabNavigationProp<__BottomTabParamList, T>;

const Tab = createMaterialBottomTabNavigator<__BottomTabParamList>();

function __BottomTabNavigator(): ReactElement {
  return (
    <Tab.Navigator>
      {/* <Tab.Screen name="Test" component={Test} /> */}
    </Tab.Navigator>
  );
}

export default __BottomTabNavigator;
