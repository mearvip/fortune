import { NextResponse } from 'next/server';
import { callSiliconFlow } from '@/lib/siliconflow';

export async function POST(req: Request) {
  try {
    const { occupation, birthDate, location } = await req.json();

    const prompt = `请根据以下信息进行运势预测分析：
职业：${occupation}
出生日期：${birthDate}
居住地：${location}

请从以下几个方面进行详细分析：
1. 整体运势
2. 事业发展
3. 财运分析
4. 人际关系
5. 健康状况
6. 改善建议`;

    const result = await callSiliconFlow(prompt);

    return NextResponse.json({
      choices: [{
        message: {
          content: result
        }
      }]
    });
  } catch (error) {
    console.error('运势预测失败:', error);
    return NextResponse.json(
      { error: '运势预测请求失败，请稍后重试' },
      { status: 500 }
    );
  }
}