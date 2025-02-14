import { NextResponse } from 'next/server';
import { callSiliconFlow } from '@/lib/siliconflow';

interface BaziRequest {
  name: string;
  birthDate: string;
  birthTime: string;
  gender: 'male' | 'female';
  question?: string;
}

export async function POST(request: Request) {
  try {
    const { name, birthDate, birthTime, gender, question } = await request.json() as BaziRequest;

    const prompt = `作为一位专业的八字命理师，请为以下来访者进行八字分析：
    姓名：${name}
    出生日期：${birthDate}
    出生时间：${birthTime}
    性别：${gender === 'male' ? '男' : '女'}
    ${question ? `咨询问题：${question}` : ''}

    请从以下方面进行详细分析：
    1. 八字命盘解读
    2. 五行喜忌分析
    3. 事业发展建议
    4. 财运分析
    5. 感情姻缘分析
    6. 健康建议
    7. 流年运势预测
    
    请给出专业、详细且有建设性的分析和建议。`;

    const result = await callSiliconFlow(prompt);

    return NextResponse.json({
      choices: [{
        message: {
          content: result
        }
      }]
    });

  } catch (error) {
    console.error('八字分析失败:', error);
    return NextResponse.json(
      { error: '八字分析请求失败' },
      { status: 500 }
    );
  }
}