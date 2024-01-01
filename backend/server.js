const express = require('express');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = 3000;

const openai = new OpenAI({
  apiKey: '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',
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('connecting to server');
});

app.post('/generateCaption', async (req, res) => {
  try {
    const {imageUrl} = req.body;
    console.log({imageUrl});

    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {type: 'text', text: 'Give me a awesome caption for instagram'},
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
    });

    console.log(response.choices);
    const caption = response.choices[0].message.content;
    res.json({caption});
  } catch (error) {
    console.error('Error in generateCaption:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
