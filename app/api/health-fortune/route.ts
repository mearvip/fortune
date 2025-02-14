import { NextResponse } from 'next/server';
import { callSiliconFlow } from '@/lib/siliconflow';

interface HealthFortuneRequest {
  name: string;
  birthDate: string;
  healthStatus: string;
}

export async function POST(request: Request) {
  try {
    const { name, birthDate, healthStatus } = await request.json() as HealthFortuneRequest;

    const prompt = `作为一位专业的健康运势分析师，请根据以下信息为用户提供详细的健康运势预测：
    姓名：${name}
    出生日期：${birthDate}
    目前的健康状况：${healthStatus}

    请从以下几个方面进行分析：
    1. 整体健康运势
    2. 需要注意的健康问题
    3. 可能遇到的健康挑战
    4. 改善健康的建议

    请用专业、关心的语气给出分析结果。`;

    const result = await callSiliconFlow(prompt);

    return NextResponse.json({
      choices: [{
        message: {
          content: result
        }
      }]
    });

  } catch (error) {
    console.error('健康运势预测失败:', error);
    return NextResponse.json(
      { error: '健康运势预测服务暂时不可用，请稍后再试' },
      { status: 500 }
    );
  }
}