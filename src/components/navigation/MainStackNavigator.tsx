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
import { Platform } from 'react-native';
import React from 'react';
import SearchVoca from '../screen/SearchVoca';
import UpdateItem from '../screen/UpdateItem';

// import { createNativeStackNavigator } from 'react-native-screens/native-stack';

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
  const platformAnimation = () => {
    if (Platform.OS === 'android') {
      return {
        ...TransitionPresets.FadeFromBottomAndroid,
        headerShown: false,
      };
    }

    return {
      headerShown: false,
      ...TransitionPresets.DefaultTransition,
    };
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardOverlayEnabled: false,
        cardShadowEnabled: false,
        cardStyle: { backgroundColor: 'transparent' },
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
      <Stack.Screen
        name="Notebook"
        component={Notebook}
        options={platformAnimation}
      />
      <Stack.Screen
        name="AddItem"
        component={AddItem}
        options={platformAnimation}
      />
      <Stack.Screen
        name="UpdateItem"
        component={UpdateItem}
        options={platformAnimation}
      />
    </Stack.Navigator>
  );
}

export default MainStackNavigator;
