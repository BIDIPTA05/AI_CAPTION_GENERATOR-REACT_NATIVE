// CreditsScreen.js
import React from 'react';
import {View, Text} from 'react-native';

const CreditsScreen = ({route}) => {
  const {credits} = route.params;

  return (
    <View>
      <Text> Your Current Credits: {credits} </Text>{' '}
    </View>
  );
};

export default CreditsScreen;
