import { NextResponse } from 'next/server';
import { callSiliconFlow } from '@/lib/siliconflow';

export async function POST(request: Request) {
  try {
    const { occupation, birthDate, relationshipStatus } = await request.json();

    const prompt = `作为一位专业的情感分析师，请根据以下信息进行分析：
职业：${occupation}
出生日期：${birthDate}
关系状态描述：${relationshipStatus}

请从以下三个方面进行分析：
1. 可能存在的问题
2. 关系的优势
3. 改善建议

请确保分析专业、客观且具有建设性。`;

    const result = await callSiliconFlow(prompt);

    return NextResponse.json({
      choices: [{
        message: {
          content: result
        }
      }]
    });
  } catch (error) {
    console.error('情感关系分析失败:', error);
    return NextResponse.json(
      { error: '分析请求失败，请稍后重试' },
      { status: 500 }
    );
  }
}