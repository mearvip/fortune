import { NextResponse } from 'next/server';
import { callSiliconFlow } from '@/lib/siliconflow';

export async function POST(req: Request) {
  try {
    const { birthDate, bloodType } = await req.json();

    if (!birthDate || !bloodType) {
      return NextResponse.json(
        { error: '请提供完整的出生日期和血型信息' },
        { status: 400 }
      );
    }

    const prompt = `作为一位专业的星座和血型分析师，请根据以下信息进行详细的性格分析：

出生日期：${birthDate}
血型：${bloodType}

请从以下几个方面进行分析：
1. 星座特征分析
2. 血型性格特点
3. 星座和血型组合带来的独特性格特征
4. 人际关系倾向
5. 职业发展建议

请给出专业、详细且个性化的分析结果。`;

    const result = await callSiliconFlow(prompt);

    return NextResponse.json({
      choices: [{
        message: {
          content: result
        }
      }]
    });
  } catch (error) {
    console.error('星座血型分析请求失败:', error);
    return NextResponse.json(
      { error: '分析过程中发生错误' },
      { status: 500 }
    );
  }
}