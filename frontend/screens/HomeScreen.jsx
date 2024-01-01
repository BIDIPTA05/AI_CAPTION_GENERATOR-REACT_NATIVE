// HomeScreen.js
import React from 'react';
import {View, Text, Button} from 'react-native';

const HomeScreen = ({navigation}) => {
  return (
    <View>
      <Text> Welcome to the Caption Generator App! </Text>{' '}
      <Button
        title="Upload Image"
        onPress={() => navigation.navigate('Upload')}
      />{' '}
      <Button
        title="Check Credits"
        onPress={() => navigation.navigate('Credits')}
      />{' '}
    </View>
  );
};

export default HomeScreen;
