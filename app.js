const express = require('express');
const speech = require('@google-cloud/speech');
const textToSpeech = require('@google-cloud/text-to-speech');
const multer = require('multer');

const app = express();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // Maximum file size (in bytes) for uploaded files (e.g., 10MB)
  },
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/process-voice', upload.single('voice'), async (req, res) => {
  try {
    const audioData = req.file.buffer;

    // Convert audio to text using speech-to-text functionality
    const text = await convertSpeechToText(audioData);

    // Process the text using GPT

    // Convert the GPT response to speech
    const audioResponse = await convertTextToSpeech(gptResponse);

    // Send the audio response back to the user
    res.set('Content-Type', 'audio/mpeg');
    res.send(audioResponse);
  } catch (error) {
    console.error('Error processing voice input:', error);
    res.status(500).send('Error processing voice input');
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

async function convertTextToSpeech(text) {
  const request = {
    input: { text },
    voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  const [response] = await ttsClient.synthesizeSpeech(request);
  const audioContent = response.audioContent;

  return audioContent;
}

async function convertSpeechToText(audioData) {
  const audioBytes = audioData.toString('base64');

  const request = {
    audio: {
      content: audioBytes,
    },
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    },
  };

  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');

  return transcription;
}
