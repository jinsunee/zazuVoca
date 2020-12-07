import React, { useEffect, useState } from 'react';
import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';
import { fetchNotebooks, fetchUser } from '../../apis/fetch';

import Loading from '../screen/Loading';
import MainStack from '../navigation/MainStackNavigator';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import { StatusBar } from 'react-native';
import auth from '@react-native-firebase/auth';
import { insertUser } from '../../apis/insert';
import useNotebooksProvider from '../../providers/notebooksProvider';
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
  const { setUser } = useUserProvider();
  const { setNotebooks } = useNotebooksProvider();

  const [loading, setLoading] = useState<boolean>(true);

  const first = async () => {
    const userResult = await insertUser();

    await requestFetchUser(userResult);
    setTimeout(() => {
      SplashScreen.hide();
      setLoading(false);
    }, 1500);
  };

  const fetchFirst = async () => {
    try {
      auth().onAuthStateChanged(async (fireUser) => {
        if (fireUser) {
          const userResult = await fetchUser(fireUser.uid);
          const notebooksResult = await fetchNotebooks(fireUser.uid);

          if (userResult) {
            setUser(userResult);
          }

          if (notebooksResult) {
            setNotebooks(notebooksResult);
          }
          SplashScreen.hide();
          setTimeout(() => {
            // SplashScreen.hide();
            setLoading(false);
          }, 1500);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const requestFetchUser = async (userUID: string) => {
    const userResult = await fetchUser(userUID);
    const notebooksResult = await fetchNotebooks(userUID);

    if (userResult) {
      setUser(userResult);
    }

    if (notebooksResult) {
      setNotebooks(notebooksResult);
    }
  };

  useEffect(() => {
    fetchFirst();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const currentUser = auth().currentUser;

    if (!currentUser) {
      first();
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth().currentUser]);

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
