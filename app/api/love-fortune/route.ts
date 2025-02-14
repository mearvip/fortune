import { NextResponse } from 'next/server';
import { callSiliconFlow } from '@/lib/siliconflow';

export async function POST(request: Request) {
  try {
    const { name, birthDate, relationshipStatus } = await request.json();

    const prompt = `作为一位专业的爱情运势分析师，请根据以下信息为用户提供详细的爱情运势预测：

姓名：${name}
出生日期：${birthDate}
目前的情感状态：${relationshipStatus}

请从以下几个方面进行分析：
1. 整体爱情运势
2. 桃花运和机遇
3. 可能遇到的挑战
4. 改善建议

请用温暖、专业的语气给出分析结果。`;

    const result = await callSiliconFlow(prompt);

    return NextResponse.json({
      choices: [{
        message: {
          content: result
        }
      }]
    });

  } catch (error) {
    console.error('爱情运势预测失败:', error);
    return NextResponse.json(
        { error: '预测服务暂时不可用，请稍后再试' },
        { status: 500 }
    );
  }
}
