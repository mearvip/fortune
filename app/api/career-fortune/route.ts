import { NextResponse } from 'next/server';
import { callSiliconFlow } from '@/lib/siliconflow';

export async function POST(request: Request) {
    try {
        const { occupation, birthDate, workStatus } = await request.json();

        const prompt = `作为一位专业的事业运势分析师，请根据以下信息为用户提供详细的事业运势预测：

职业：${occupation}
出生日期：${birthDate}
当前工作状态：${workStatus}

请从以下几个方面进行分析：
1. 整体事业运势
2. 职业发展机遇
3. 可能遇到的挑战
4. 职业发展建议

请用专业、鼓励的语气给出分析结果。`;

        const result = await callSiliconFlow(prompt);

        return NextResponse.json({
            choices: [{
                message: {
                    content: result
                }
            }]
        });
    } catch (error) {
        console.error('事业运势预测失败:', error);
        return NextResponse.json(
            { error: '预测服务暂时不可用，请稍后再试' },
            { status: 500 }
        );
    }
}
