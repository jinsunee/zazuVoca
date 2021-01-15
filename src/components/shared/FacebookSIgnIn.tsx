import { Text, TouchableOpacity } from 'react-native';

import React from 'react';

const FacebookSignIn = ({ onFacebookButtonPress }) => {
  return (
    <TouchableOpacity onPress={onFacebookButtonPress}>
      <Text>facebook</Text>
    </TouchableOpacity>
  );
};
export default FacebookSignIn;
