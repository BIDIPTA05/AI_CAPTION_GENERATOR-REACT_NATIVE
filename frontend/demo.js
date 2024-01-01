import React, { useState } from 'react';

import { Button, Image, SafeAreaView, Text, View } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import OpenAI from 'openai';

const App = () => {
    const [photo, setPhoto] = useState(null);

    const openai = new OpenAI({
        apiKey: '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',
    });

    const generateCaption = async() => {
        // Call OpenAI Vision API to generate a caption
        // Use 'image.uri' to get the image URI
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4-vision-preview',
                messages: [{
                    role: 'user',
                    content: [
                        { type: 'text', text: 'What’s in this image?' },
                        {
                            type: 'image_url',
                            image_url: {
                                url: photo ? .assets[0].uri,
                            },
                        },
                    ],
                }, ],
            });
            console.log(response.choices[0]);
            // Display the generated caption to the user
            console.log(response.data.caption);
        } catch (error) {
            console.error('Error generating caption: --->>', error);
        }
    };
    return ( <
        SafeAreaView >
        <
        View >
        <
        Button onPress = {
            () =>
            ImagePicker.launchImageLibrary({
                    mediaType: 'photo',
                    includeBase64: false,
                    maxHeight: 200,
                    maxWidth: 200,
                },
                response => {
                    console.log(response);
                    setPhoto(response);
                },
            )
        }
        title = "Select Image" /
        >

        {
            photo && ( <
                >
                <
                Text > Selected Image: < /Text> <
                Image source = {
                    { uri: photo.assets[0].uri } }
                style = {
                    { width: 200, height: 200 } }
                /> <
                Button title = "Generate Caption"
                onPress = { generateCaption }
                /> <
                />
            )
        } <
        View >
        <
        Text > The caption is: {} < /Text> <
        /View> <
        /View> <
        /SafeAreaView>
    );
};

export default App;