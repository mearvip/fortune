const API_URL = 'https://api.siliconflow.cn/v1/chat/completions';

interface SiliconFlowResponse {
  choices: [{
    message: {
      content: string;
    }
  }];
}

export async function callSiliconFlow(prompt: string) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      top_p: 0.8,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`硅基流动 API 请求失败: ${response.status}, ${JSON.stringify(errorData)}`);
  }

  const data: SiliconFlowResponse = await response.json();
  console.log('siliconflow response:', data);
  return data.choices[0].message.content;
}