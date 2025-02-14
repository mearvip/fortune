"use client"

import type React from "react"
import { TextField, Button, Typography } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import ResultCard from './ResultCard'
import MysticLoading from './MysticLoading'
import { useFortuneState } from '../hooks/useFortuneState'
import { useRequestState } from '../hooks/useRequestState'

const FortunePrediction: React.FC = () => {
  const { state, setFormData, setResult: setFortune, setLoading } = useFortuneState({
    storageKey: 'fortunePrediction',
    keepAlive: true,
    initialState: {
      formData: {
        name: '',
        birthdate: null,
        question: ''
      },
      result: '',
      loading: false
    }
  })
  const { isActive, createController, cleanup, setPendingRequest } = useRequestState({
    keepAlive: true,
    storageKey: 'fortunePrediction'
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setFortune('')

    const newController = createController()

    try {
      const timeoutId = setTimeout(() => {
        newController.abort()
      }, 100000) // 10秒超时

      const request = fetch('/api/fortune-prediction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: state.formData.name,
          birthDate: state.formData.birthdate ? new Date(state.formData.birthdate).toISOString().split('T')[0] : '',
          question: state.formData.question
        }),
        signal: newController.signal
      });
      setPendingRequest(request);
      const response = await request;

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error('预测请求失败');
      }

      const data = await response.json();
      if (isActive) { // 只在组件仍然活跃时更新状态
        setFortune(data.choices[0].message.content);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('请求被取消或超时')
        setFortune('抱歉，请求超时。请重新尝试。')
      } else {
        console.error('获取运势预测失败:', error);
        setFortune(error.message || '抱歉，获取运势预测结果时出现错误，请稍后重试。');
      }
    } finally {
      if (isActive) { // 只在组件仍然活跃时更新状态
        setLoading(false);
        cleanup();
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Typography variant="h3" component="h3" className="text-center mb-2">运势预测</Typography>
      <Typography variant="body1" className="text-center text-gray-600 mb-6">探索你的未来，获得人生指引</Typography>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TextField
              fullWidth
              required
              label="你的名字"
              value={state.formData.name || ""}
              onChange={(e) => setFormData({ ...state.formData, name: e.target.value })}
              className="rounded-md"
            />

            <DatePicker
              label="出生日期"
              value={state.formData.birthdate}
              onChange={(date) => setFormData({ ...state.formData, birthdate: date })}
              className="w-full"
              slotProps={{
                textField: {
                  required: true,
                  className: "rounded-md"
                }
              }}
            />

            <TextField
              fullWidth
              required
              multiline
              rows={4}
              label="想要预测的问题"
              value={state.formData.question || ""}
              onChange={(e) => setFormData({ ...state.formData, question: e.target.value })}
              placeholder="请输入您想要预测的具体问题"
              className="rounded-md"
            />

            <Button
              type="submit"
              variant="contained"
              disabled={state.loading}
              className="w-full h-12 text-base font-medium rounded-md shadow-md transition-all duration-300 hover:shadow-lg"
            >
              {state.loading ? '正在进行运势预测...' : '开始运势预测'}
            </Button>
          </LocalizationProvider>
        </form>
      </div>

      {state.loading && <MysticLoading text="正在进行运势预测..." />}

      {state.result && (
        <ResultCard
          title="运势预测结果"
          content={state.result}
          enableTypewriter={true}
          typewriterDelay={50}
        />
      )}
    </div>
  )
}

export default FortunePrediction

