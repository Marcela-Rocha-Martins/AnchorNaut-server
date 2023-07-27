const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const { Configuration, OpenAIApi } = require("openai");

// Configuração da chave de API do OpenAI
const configuration = new Configuration({ apiKey: process.env.OPEN_AI_KEY });
const openai = new OpenAIApi(configuration);

// Função para enviar uma mensagem para o modelo GPT-3.5-Turbo
async function runCompletion(prompt) {
  // Defina a mensagem do sistema a ser enviada ao modelo GPT-3.5-Turbo
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
    //   "You are an assistant that helps users plan and achieve their dreams. Please provide the structured steps, with short, objective phrases representing these steps and an estimated execution time for each step, for the following dream (please, respect this format(each steps SHOULD necessarily include): 'step': 'phrase with step' - 'estimated time': 'time'):"
    //   " --------->> You are an assistant that helps users achieve their dreams/plans. When a user sends you a dream/plan, you will respond ONLY with a list of array with sequencial, short and objective phrases representing the tasks and subtasks they need to take to achieve it. ----------->> Rules: Avoid giving tasks that are too similar; respect ALWAYS this format: 'task': 'phrase with task' 'estimated time':'time' (always provide the estimated time); be detailed and objective, your answer should include ONLY the list of tasks, without any introductory ou closure phrases --------->> Example of output for tasks:'create realistic goals estimated time: 1 day' (and everythint else that its necessary to create a achieve that goal)"
  };

  // Defina a mensagem do usuário a ser enviada ao modelo GPT-3.5-Turbo, contendo o prompt do usuário
  const userMessage = {
    role: "user",
    content: prompt,
  };

  // Combine as mensagens do sistema e do usuário em um array para ser enviado como mensagens de conversa
  const messages = [systemMessage, userMessage];

  try {
    // Envie a conversa (mensagens) para o modelo GPT-3.5-Turbo
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