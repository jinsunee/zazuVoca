import { applyMiddleware, combineReducers, createStore } from 'redux';

import { Provider } from 'react-redux';
import React from 'react';
import ReduxThunk from 'redux-thunk';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './themeProvider';
import { notebooksReducer } from '../providers/notebooksProvider';
import { userReducer } from '../providers/userProvider';

const rootReducer = combineReducers({
  userReducer,
  notebooksReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

interface Props {
  children?: React.ReactElement;
}

function RootProvider({ children }: Props) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <SafeAreaProvider>{children}</SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default RootProvider;

// RootState 타입을 만들어서 내보내줘야한다.
export type RootState = ReturnType<typeof rootReducer>;
