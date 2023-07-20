require("./db");
require("dotenv/config");

const express = require("express");
const { isAuthenticated } = require("./middleware/jwt.middleware");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(express.json()); // Adicionar este middleware para analisar JSON no corpo das requisições

// Configuração da chave de API do OpenAI
const configuration = new Configuration({ apiKey: process.env.OPEN_AI_KEY });
const openai = new OpenAIApi(configuration);

// Função para enviar uma mensagem para o modelo GPT-3.5-Turbo
async function runCompletion(prompt) {
  // Define the system message to be sent to the GPT-3.5-Turbo model
  const systemMessage = {
    role: "system",
    content:
      "You are an assistant that helps users plan and achieve their dreams. Please provide the structured steps, with short, objective phrases representing these steps and an estimated execution time for each step, for the following dream (please, respect this format: 'step': 'phrase with step' - 'estimated time': 'time'):",
  };

  // Define the user message to be sent to the GPT-3.5-Turbo model, which contains the user's prompt
  const userMessage = {
    role: "user",
    content: prompt,
  };

  // Combine the system and user messages into an array to be sent as conversation messages
  const messages = [systemMessage, userMessage];

  try {
    // Send the conversation (messages) to the GPT-3.5-Turbo model
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 1,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Extract and format the dream steps from the model's response
    const dreamSteps = response.data.choices[0].message["content"].split("\n");
    // Remove empty lines and whitespace from the response
    const filteredDreamSteps = dreamSteps.filter((step) => step.trim() !== "");
    console.log(filteredDreamSteps);

    // Check if the response contains the structured steps
    if (!filteredDreamSteps || filteredDreamSteps.length === 0) {
      throw new Error(
        "The model's response does not contain structured steps."
      );
    }

  // Create a new array 'formattedSteps' by mapping over each 'step' in the 'filteredDreamSteps' array
const formattedSteps = filteredDreamSteps.map((step) => {
  // Split each 'step' into two parts using the correct delimiter ' - Estimated time: '
  const stepParts = step.split(" - Estimated time: ");

  // Check if the split resulted in exactly two parts, if not, throw an error
  if (stepParts.length !== 2) {
    throw new Error("Invalid step format in the model's response.");
  }

  // Return an object with the 'text' and 'time' properties extracted from the split parts, after removing leading/trailing whitespaces
  return {
    text: stepParts[0].trim(), // The first part represents the text of the step
    time: stepParts[1].trim(), // The second part represents the estimated time of the step
  };
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

// Rota para a API do OpenAI
app.post("/openai", async (req, res) => {
  try {
    const { prompt } = req.body;
    const chatbotResponse = await runCompletion(prompt);

    return res.status(200).json({ success: true, data: chatbotResponse });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Erro na chamada da API do OpenAI." });
  }
});

// require("./db");
// require("dotenv/config");

// const express = require("express");
// const { isAuthenticated } = require("./middleware/jwt.middleware");
// const { Configuration, OpenAIApi } = require("openai");

// const app = express();

// // app.use(express.json());

// require("./config")(app);

// //-------configuration of openAI
// const configuration = new Configuration({ apiKey: process.env.OPEN_AI_KEY });

// const openai = new OpenAIApi(configuration);

// async function runCompletion(prompt) {

//   // const response = await openai.createChatCompletion({
//   //   model: "gpt-3.5-turbo",
//   //   messages: [],
//   //   temperature: 1,
//   //   max_tokens: 256,
//   //   top_p: 1,
//   //   frequency_penalty: 0,
//   //   presence_penalty: 0,
//   // });

//   const response = await openai.createCompletion({
//     model: "text-davinci-003",
//     prompt: `
//             ${prompt}

//             Me de

//           `,
//     max_tokens: 550, // Ajuste este valor para obter aproximadamente 10 linhas
//     temperature: 0, // Defina como 0 para respostas mais determinísticas
//     // stop: ["\n "],
//   });

//   let chatbotResponse = response.data.choices[0].text;

//   // Dividir o texto da resposta em linhas usando quebras de linha (\n)
//   const lines = chatbotResponse.split("\n");

//   // Limitar o número de caracteres em cada linha para o máximo desejado
//   const maxCharactersPerLine = 60; // Ajuste este valor para o máximo desejado
//   chatbotResponse = lines
//     .map((line) => line.slice(0, maxCharactersPerLine)) // Limitar os caracteres em cada linha
//     .join("\n"); // Juntar as linhas novamente

//   return chatbotResponse;
// }

// // Rota para a API do OpenAI
// app.post("/openai", async (req, res) => {
//   try {
//     const { prompt } = req.body;
//     const chatbotResponse = await runCompletion(prompt);

//     return res.status(200).json({ success: true, data: chatbotResponse });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ success: false, error: "Erro na chamada da API do OpenAI." });
//   }
// });

// Start handling routes here
const allRoutes = require("./routes/index");
app.use("/", allRoutes);

const projectRouter = require("./routes/project.routes");
app.use("/api", isAuthenticated, projectRouter);

const taskRouter = require("./routes/task.routes");
app.use("/api", isAuthenticated, taskRouter);

const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

const dailylogsRouter = require("./routes/dailylogs.routes");
app.use("/api", isAuthenticated, dailylogsRouter);

require("./error-handling")(app);

module.exports = app;

// require("dotenv/config");
// require("./db");
// const express = require("express");
// const { getOpenAIResponse } = require("./openai");

// const { isAuthenticated } = require("./middleware/jwt.middleware");
// // const { getOpenAIResponse } = require("./openai"); // Importe a função do arquivo openai.js

// const app = express();
// require("./config")(app);

// // 👇 Start handling routes here
// const allRoutes = require("./routes/index");
// app.use("/", allRoutes);

// const projectRouter = require("./routes/project.routes");
// app.use("/api", isAuthenticated, projectRouter);

// const taskRouter = require("./routes/task.routes");
// app.use("/api", isAuthenticated, taskRouter);

// const authRouter = require("./routes/auth.routes");
// app.use("/auth", authRouter);

// const dailylogsRouter = require("./routes/dailylogs.routes");
// app.use("/api", isAuthenticated, dailylogsRouter);

// require("./error-handling")(app);

// module.exports = app;
