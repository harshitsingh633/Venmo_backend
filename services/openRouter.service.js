import axios from "axios";

export async function callMimoAI(messages) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "xiaomi/mimo-v2-flash",
        messages,
        temperature: 0.3,
        max_tokens: 300
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173", // frontend URL
          "X-Title": "Venmo Chatbot"
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter Error:", error.response?.data || error.message);
    throw new Error("AI service failed");
  }
}
