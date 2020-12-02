import { ItemType, NotebookType } from '../../types';
import {
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack';
import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';

import AddItem from '../screen/AddItem';
import Main from '../screen/Main';
import Notebook from '../screen/Notebook';
import React from 'react';
import SearchVoca from '../screen/SearchVoca';
import UpdateItem from '../screen/UpdateItem';
import { colors } from '../../theme';

export type StackParamList = {
  Main: undefined;
  SearchVoca: undefined;
  Notebook: {
    notebook: NotebookType;
  };
  AddItem: {
    notebookUID: string;
  };
  UpdateItem: {
    notebookUID: string;
    item: ItemType;
  };
};

export type StackNavigationProps<
  T extends keyof StackParamList = 'Main'
> = StackNavigationProp<StackParamList, T>;

const Stack = createStackNavigator<StackParamList>();

function MainStackNavigator(): React.ReactElement {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen
        name="SearchVoca"
        component={SearchVoca}
        options={(): StackNavigationOptions => ({
          headerShown: false,
          ...TransitionPresets.FadeFromBottomAndroid,
        })}
      />
      <Stack.Screen name="Notebook" component={Notebook} />
      <Stack.Screen name="AddItem" component={AddItem} />
      <Stack.Screen name="UpdateItem" component={UpdateItem} />
    </Stack.Navigator>
  );
}

export default MainStackNavigator;
