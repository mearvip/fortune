import { NextResponse } from 'next/server';
import { callSiliconFlow } from '@/lib/siliconflow';

interface TarotRequest {
  name: string;
  birthDate: string;
  lifeStage: string;
}

export async function POST(request: Request) {
  try {
    const { name, birthDate, lifeStage } = await request.json() as TarotRequest;

    const prompt = `作为一位专业的塔罗牌占卜师，请为以下来访者进行塔罗牌占卜：
    姓名：${name}
    出生日期：${birthDate}
    当前生活阶段：${lifeStage}
    
    请抽取三张塔罗牌，并详细解释每张牌的含义以及对来访者的指引。`;

    const result = await callSiliconFlow(prompt);

    return NextResponse.json({
      choices: [
        {
          message: {
            content: result
          }
        }
      ]
    });

  } catch (error) {
    console.error('Tarot reading error:', error);
    return NextResponse.json(
      { error: '获取塔罗牌解读时发生错误' },
      { status: 500 }
    );
  }
}
