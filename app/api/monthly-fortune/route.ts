import { NextResponse } from 'next/server';
import { callSiliconFlow } from '@/lib/siliconflow';

export async function POST(request: Request) {
    try {
        const { name, birthDate, currentStatus, month } = await request.json();

        const prompt = `作为一位专业的运势分析师，请根据以下信息为用户提供详细的月度运势预测：

姓名：${name}
出生日期：${birthDate}
当前状态：${currentStatus}
预测月份：${month}

请从以下几个方面进行分析：
1. 整体运势
2. 事业发展
3. 感情运势
4. 月度建议

请用专业、积极的语气给出分析结果。`;

        const result = await callSiliconFlow(prompt);

        return NextResponse.json({
            choices: [{
                message: {
                    content: result
                }
            }]
        });

    } catch (error) {
        console.error('月度运势预测失败:', error);
        return NextResponse.json(
            { error: '预测服务暂时不可用，请稍后再试' },
            { status: 500 }
        );
    }
}
