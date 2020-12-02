import React from 'react';
import RootNavigator from './components/navigation/RootStackNavigator';
import RootProvider from './providers';
import { RootSiblingParent } from 'react-native-root-siblings';

function App(): React.ReactElement {
  return (
    <RootProvider>
      <RootSiblingParent>
        <RootNavigator />
      </RootSiblingParent>
    </RootProvider>
  );
}

export default App;
