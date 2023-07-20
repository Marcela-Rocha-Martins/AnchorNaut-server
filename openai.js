const openai = require("openai-api");

async function getOpenAIResponse(question) {
  const openaiInstance = new openai.OpenAiApi(process.env.OPENAI_API_KEY);

  const prompt =
    "I am going to provide you with a sentence about something I want to do but don't know how to start. Please respond with a detailed step-by-step plan and an estimated time for each task: {{question}}";

  const parameters = {
    model: "gpt-3.5-turbo",
    prompt: prompt.replace("{{question}}", question),
    maxTokens: 100,
    temperature: 0.5,
    n: 10,
    stop: "\n\n",
  };

  const response = await openaiInstance.complete(parameters);
  const { choices } = response.data;
  const steps = choices.map((choice) => choice.text.trim());

  const processedResponse = {
    answer: steps,
    prediction: "Estimated time for each step",
  };

  console.log("alo alo");
  return processedResponse;
}

module.exports = { getOpenAIResponse };
