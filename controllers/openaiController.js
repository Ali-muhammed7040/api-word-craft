const OPENAI = require("openai").OpenAI;

const openai = new OPENAI();

exports.paraphrasing = async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log(prompt);
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: `Give me best suggested paragraph and paraphrase it:"${prompt}"`,
      max_tokens: 1000,
      temperature: 1.5,
      n: 1,
    });
    return res.status(200).json({
      success: true,
      data: response.choices,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.response
        ? error.response.data
        : "there was an issue on server",
    });
  }
};

// Other OpenAI-related route handlers

exports.continueWriting = async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log(prompt, "working with contine");
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: `${prompt}continue writing provide me atleast two paragraph `,
      max_tokens: 1000,
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
};

exports.quotation = async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log(prompt, "working with contine");
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: `${prompt} give a relavtive quote`,
      max_tokens: 100,
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
};

exports.poetry = async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log(prompt, "working with contine");
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: `${prompt} give 20 lines of poem`,
      max_tokens: 10,
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
};
exports.actions = async (req, res) => {
  try {
    const { prompt, action } = req.body;
    // const newLine = Number(lines);
    // console.log(typeof newLine, action);
    console.log(prompt, action);

    if (prompt && action) {
      if (action === "Add a 500 lines of Repharsing") {
        console.log("yaha tha");
        const response = await openai.completions.create({
          model: "gpt-3.5-turbo-instruct",
          prompt: `${prompt}:${action}`,
          max_tokens: 1000,
          n: 1,
        });
        return res.status(200).json({
          success: true,
          data: response.choices[0].text,
        });
      } else {
        console.log("working");
        const response = await openai.completions.create({
          model: "gpt-3.5-turbo-instruct",
          prompt: `${prompt}:${action}`,
          max_tokens: 100,
          n: 1,
        });
        return res.status(200).json({
          success: true,
          data: response.choices[0].text,
        });
      }
    } else if (prompt) {
      const response = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt: `${prompt}`,
        max_tokens: 250,
        n: 1,
      });
      return res.status(200).json({
        success: true,
        data: response.choices[0].text,
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.response
        ? error.response.data
        : "there was an issue on server",
    });
  }
};
