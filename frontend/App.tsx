import React, {useState, useEffect} from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState('');
  const [credit, setCredit] = useState(3);
  //clear async storage
  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared successfully!');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  useEffect(() => {
    loadCredits();
  }, []);

  const loadCredits = async () => {
    try {
      const savedCredits = await AsyncStorage.getItem('credits');
      if (savedCredits !== null) {
        setCredit(parseInt(savedCredits, 10));
      }
    } catch (error) {
      console.error('Error loading credits from AsyncStorage:', error);
    }
  };

  const saveCredits = async value => {
    try {
      await AsyncStorage.setItem('credits', value.toString());
    } catch (error) {
      console.error('Error saving credits to AsyncStorage:', error);
    }
  };

  const generateCaption = async () => {
    try {
      if (credit <= 0) {
        // If no credits available, inform the user
        console.log('No credits available');
        return;
      }

      setLoading(true);
      const response = await axios.post(
        'http://localhost:3000/generateCaption',
        {
          imageUrl: `data:image/jpeg;base64,${photo.assets[0].base64}`,
        },
      );
      setLoading(false);
      setCaption(response.data.caption);

      setCredit(prevCredit => prevCredit - 1);
      saveCredits(credit - 1);
    } catch (error) {
      console.error('Error fetching caption:', error);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text style={styles.head}>AI CAPTION GENERATOR</Text>
          <Text style={styles.head2}>Available Credit : {credit}</Text>
          <Image source={require('./assets/abc.jpg')} style={styles.image} />

          {credit > 0 ? (
            <Button
              color="#139c5c"
              onPress={() =>
                ImagePicker.launchImageLibrary(
                  {
                    mediaType: 'photo',
                    includeBase64: true,
                    maxHeight: 200,
                    maxWidth: 200,
                  },
                  response => {
                    if (response.didCancel) {
                      console.log('Image selection cancelled');
                    } else if (response.error) {
                      console.error('ImagePicker Error: ', response.error);
                    } else {
                      setPhoto(response);
                    }
                  },
                )
              }
              title="Press me to pick an image"
            />
          ) : (
            <View>
              <Text style={styles.removePhoto}>No credit left</Text>
              <Button
                title="Click to Refill now!!!"
                color="blue"
                onPress={() => {
                  clearAsyncStorage();
                  setTimeout(() => {
                    setCredit(3);
                  }, 1000);
                  <ActivityIndicator size="large" color="blue" />;
                }}
              />
            </View>
          )}

          {photo && (
            <>
              <Text style={styles.textInner}>Selected Image:</Text>
              <Image
                source={{uri: photo.assets[0].uri}}
                style={styles.imageInner}
              />
              <Button title="Generate Caption" onPress={generateCaption} />
            </>
          )}

          {loading && <ActivityIndicator size="large" color="blue" />}

          {caption && (
            <View>
              <Text style={styles.caption}>{caption}</Text>
              <Button
                onPress={() => {
                  setCaption('');
                  setPhoto(null);
                }}
                title="Remove Photo"
                color="red"
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  head: {
    fontSize: 30,
    color: '#2495c1',
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold',
    fontFamily: '',
  },
  head2: {
    fontSize: 12,
    color: '#779908',
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold',
    fontFamily: '',
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    margin: 10,
  },
  textInner: {
    fontSize: 20,
    color: '#ed864c',
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold',
  },
  imageInner: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 10,
  },
  button: {
    alignSelf: 'center',
    color: 'blue',
  },
  caption: {
    fontSize: 20,
    color: '#ed864c',
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold',
  },
  removePhoto: {
    fontSize: 20,
    color: 'red',
    textAlign: 'center',

    fontWeight: 'bold',
  },
});
