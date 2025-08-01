// almost finished dont mess

const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const cors = require('cors');
require('dotenv').config();



const app = express();

const port = process.env.PORT;
const apiKey = process.env.API_KEY;

app.use(express.static('public'));

app.use(cors({
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));

// app.get('/',(req,res)=>{
//     res.sendFile(__dirname+"/index.html");
// })

app.post('/generate', async (req, res) => {
    const inputText = req.body.inputText;

    
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
    });

    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    const chatSession = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
    });

    const result = await chatSession.sendMessage(inputText);
    res.send(result.response.text());
});

app.listen(port, () => {
});
