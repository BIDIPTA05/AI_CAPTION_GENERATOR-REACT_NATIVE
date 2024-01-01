// UploadScreen.js
import React, {useState} from 'react';
import {View, Text, Button} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';

const UploadScreen = ({navigation}) => {
  const [image, setImage] = useState(null);

  const pickImage = () => {
    ImagePicker.showImagePicker({}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setImage(response);
      }
    });
  };

  const generateCaption = async () => {
    // Call OpenAI Vision API to generate a caption
    // Use 'image.uri' to get the image URI
    try {
      const response = await axios.post('OpenAI Vision API Endpoint', {
        image_uri: image.uri,
      });
      // Display the generated caption to the user
      console.log(response.data.caption);
    } catch (error) {
      console.error('Error generating caption:', error);
    }
  };

  return (
    <View>
      <Text> Upload an Image </Text>{' '}
      <Button title="Pick an image" onPress={pickImage} />{' '}
      {image && (
        <>
          <Text> Selected Image: </Text>{' '}
          <Image source={{uri: image.uri}} style={{width: 200, height: 200}} />{' '}
          <Button title="Generate Caption" onPress={generateCaption} />{' '}
        </>
      )}{' '}
    </View>
  );
};

export default UploadScreen;
