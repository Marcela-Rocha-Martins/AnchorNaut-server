const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({ apiKey: process.env.OPEN_AI_KEY });
const openai = new OpenAIApi(configuration);

async function runCompletion(prompt) {
  const systemMessage = {
    role: "system",
    content:`You will be provided with a text that represents a goal. Your task is to suggest steps an user can take to achieve this goal.
    - Each step is a short objective and actionable phrase.
    - There can be a minimum of 5 steps and a maximum of 15 steps.
    - Each step can have up to 180 characters.
    - The steps should not be numbered in any way but should begin with a #.
    - Every step should have an estimated range of time to complete the step in hours, days, weeks or months (never years).
    - If its not possible to estimate type or the estimation varies, guess one.
    - No other information (introduction, context or summary) should be returned beyond what is asked here.
    - Follow this format:
    "#Brainstorm book ideas and choose a topic / 1-2h
    #Create an outline with chapters and subtopics / 2-3h
    #Conduct research on the chosen topic / 5-10h"
    `
  };

  const userMessage = {
    role: "user",
    content: prompt,
  };

  const messages = [systemMessage, userMessage];

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 1,
      presence_penalty: 0,
    });

    console.log("Model Response:", response.data.choices[0].message.content);

    const dreamSteps = response.data.choices[0].message["content"].split("\n");
    console.log("dreamSteps:", dreamSteps);

    const formattedSteps = dreamSteps.map((step) => {
        
        
        if (step.startsWith("#") || step.startsWith(" #")) {
            step = step.replace("#", "").trim();
          }
        const stepParts = step.split("/");
      
        if (stepParts.length === 2) {
          // If the step can be divided into two parts, extract the text and the time
          return {
            text: stepParts[0].trim(), // The first part represents the text of the step
            time: stepParts[1].trim(), // The second part represents the estimated time of the step
          };
        } else {
        // If the step cannot be divided into two parts, return the step as it is with a placeholder for the estimated time
        return {
          text: step.trim(), // The entire step as it is
          time: "imprecise", // Placeholder for the estimated time (or any other value that signifies no estimated time)
        };
      }
    });

    return formattedSteps;
  } catch (error) {
    console.error(
      "Error sending the message to the GPT-3.5-Turbo model:",
      error.message
    );
    return null;
  }
}

router.post("/assistant", isAuthenticated, async (req, res) => {
  try {
    const { prompt } = req.body;
    const chatbotResponse = await runCompletion(prompt);

    console.log("chatbotResponse:", chatbotResponse);
    if (!chatbotResponse) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid response from the model." });
    }

    return res.status(200).json({ success: true, data: chatbotResponse });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Error calling Dream Assistant API." });
  }
});

module.exports = router;