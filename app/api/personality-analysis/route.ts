import { NextResponse } from 'next/server';
import { callSiliconFlow } from '@/lib/siliconflow';

export async function POST(request: Request) {
  try {
    const { name, birthDate, emotionalState } = await request.json();

    const emotionalStateMap: { [key: string]: string } = {
      anxious: '焦虑',
      confused: '迷茫',
      excited: '兴奋',
      stressed: '压力大'
    };

    const prompt = `请根据以下信息进行深度性格分析：
姓名：${name}
出生日期：${birthDate}
当前情绪状态：${emotionalStateMap[emotionalState] || emotionalState}

请从以下几个方面进行分析：
1. 核心性格特征
2. 情感特质和人际关系模式
3. 潜在的优势和发展方向
4. 可能面临的挑战和建议
5. 适合的职业发展方向

请给出专业、深入且具体的分析。`;

    const result = await callSiliconFlow(prompt);

    return NextResponse.json({
      choices: [{
        message: {
          content: result
        }
      }]
    });
  } catch (error) {
    console.error('性格分析请求失败:', error);
    return NextResponse.json(
      { error: '性格分析生成失败，请稍后重试' },
      { status: 500 }
    );
  }
}