import App from './src/App';
import { enableScreens } from 'react-native-screens';
import firebase from '@react-native-firebase/app';
import { firebaseConfig } from './config';

enableScreens();

const config = {
  name: 'MAIN_APP',
};
firebase.initializeApp(firebaseConfig, config);

export default App;
