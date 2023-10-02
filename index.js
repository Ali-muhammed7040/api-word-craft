require("dotenv").config();
const express = require("express");
const OPENAI = require("openai").OpenAI;
const cors = require("cors");

const openai = new OPENAI();

const app = express();

app.use(express.json(), cors());

app.post("/paraphrasing", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log(prompt);
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: `Paraphrase the following text:"${prompt}"`,
      max_tokens: 64,
      temperature: 0,
    });
    return res.status(200).json({
      success: true,
      data: response.choices[0].text,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.response
        ? error.response.data
        : "there was an issue on server",
    });
  }
});

app.post("/continuewriting", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log(prompt, "working with contine");
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: `${prompt}continue writing`,
      max_tokens: 100,
    });

    console.log(response.choices[0].text);
    return res.status(200).json({
      success: true,
      data: response.choices[0].text,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.response
        ? error.response.data
        : "there was an issue on server",
    });
  }
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Sever listening on port ${port}`);
});
