import React, { useEffect, useState } from 'react';
import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import Loading from '../screen/Loading';
import MainStack from '../navigation/MainStackNavigator';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import { StatusBar } from 'react-native';
import { fetchUser } from '../../apis/fetch';
import useUserProvider from '../../providers/userProvider';

export type StackParamList = {
  Loading: undefined;
  MainStack: undefined;
};

export type RootStackNavigationProps<
  T extends keyof StackParamList = 'MainStack'
> = StackNavigationProp<StackParamList, T>;

const Stack = createStackNavigator<StackParamList>();

function RootStackNavigator(): React.ReactElement {
  const { setUser, resetUser } = useUserProvider();

  const [loading, setLoading] = useState<boolean>(true);

  const requestFetchUser = async (userUID: string) => {
    const userResult = await fetchUser(userUID);

    if (userResult) {
      setUser(userResult);
    }
  };

  async function onAuthStateChanged(
    firebaseUser: FirebaseAuthTypes.User | null,
  ): Promise<void> {
    if (!firebaseUser) {
      resetUser();
    } else {
      requestFetchUser(firebaseUser.uid);
    }
    setLoading(false);
  }

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NavigationContainer>
      <StatusBar
        // barStyle={theme === ThemeType.LIGHT ? 'dark-content' : 'light-content'}
        barStyle={'light-content'}
        backgroundColor={'transparent'}
        translucent={true}
      />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: false,
        }}
      >
        {loading ? (
          <Stack.Screen name="Loading" component={Loading} />
        ) : (
          <Stack.Screen name="MainStack" component={MainStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootStackNavigator;
