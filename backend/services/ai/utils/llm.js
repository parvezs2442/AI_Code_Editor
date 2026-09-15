import "dotenv/config";
import { ChatOpenRouter } from "@langchain/openrouter";

const llm = new ChatOpenRouter({
  model: process.env.AI_MODEL || "deepseek/deepseek-chat",
  apiKey: process.env.OPENROUTER_API_KEY,
  temperature: 0,
  maxTokens: 1024,
});

export default llm;