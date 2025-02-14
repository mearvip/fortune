import { NextResponse } from 'next/server';
import { callSiliconFlow } from '@/lib/siliconflow';

export async function POST(request: Request) {
  try {
    const { name, birthDate, emotionalState } = await request.json();

    const prompt = `作为一位专业的心理分析师，请根据以下信息对这个人进行深入的性格分析：

姓名：${name}
出生日期：${birthDate}
最近的情绪状态：${emotionalState}

请从以下几个方面进行分析：
1. 核心性格特征
2. 情感特点和表达方式
3. 人际关系模式
4. 工作和学习风格
5. 潜在的性格优势
6. 可能面临的挑战
7. 个人成长建议

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
    console.error('性格分析生成失败:', error);
    return NextResponse.json(
      { error: '性格分析生成失败，请稍后重试' },
      { status: 500 }
    );
  }
}