import { NextResponse } from 'next/server';
import { callSiliconFlow } from '@/lib/siliconflow';

export async function POST(request: Request) {
  try {
    const { occupation, birthDate, hobbies } = await request.json();

    const prompt = `作为一位专业的MBTI性格分析师，请根据以下信息进行详细的MBTI性格分析：

职业：${occupation}
出生日期：${birthDate}
兴趣爱好：${hobbies}

请提供以下方面的分析：
1. 可能的MBTI类型及其主要特征
2. 性格优势和潜在发展方向
3. 人际关系和沟通方式建议
4. 职业发展建议
5. 个人成长建议

请用专业、温和的语气，给出详细的分析和建议。`;

    const result = await callSiliconFlow(prompt);

    return NextResponse.json({
      choices: [{
        message: {
          content: result
        }
      }]
    });
  } catch (error) {
    console.error('MBTI分析失败:', error);
    return NextResponse.json(
      { error: 'MBTI分析请求失败' },
      { status: 500 }
    );
  }
}