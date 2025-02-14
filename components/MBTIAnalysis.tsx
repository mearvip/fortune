"use client"

import type React from "react"
import { useState } from "react"
import { TextField, Button, Typography } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import ResultCard from './ResultCard'
import MysticLoading from './MysticLoading'
import { useFortuneState } from '../hooks/useFortuneState'
import { useRequestState } from '../hooks/useRequestState'

const MBTIAnalysis: React.FC = () => {
  const { state, setFormData, setResult: setAnalysis, setLoading } = useFortuneState({
    storageKey: 'mbtiAnalysis',
    keepAlive: true,
    initialState: {
      formData: {
        occupation: '',
        birthdate: null,
        hobbies: ''
      },
      result: '',
      loading: false
    }
  })
  const { isActive, createController, cleanup, setPendingRequest } = useRequestState({
    keepAlive: true,
    storageKey: 'mbtiAnalysis'
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setAnalysis('')

    const newController = createController()

    try {
      const timeoutId = setTimeout(() => {
        newController.abort()
      }, 100000) // 10秒超时

      const request = fetch('/api/mbti-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          occupation: state.formData.occupation,
          birthDate: state.formData.birthdate ? new Date(state.formData.birthdate).toISOString().split('T')[0] : '',
          hobbies: state.formData.hobbies
        }),
        signal: newController.signal
      });
      setPendingRequest(request);
      const response = await request;

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error('分析请求失败');
      }

      const data = await response.json();
      if (isActive) { // 只在组件仍然活跃时更新状态
        setAnalysis(data.choices[0].message.content);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('请求被取消或超时')
        setAnalysis('抱歉，请求超时。请重新尝试。')
        setLoading(false) // 立即重置加载状态
      } else {
        console.error('获取MBTI分析结果失败:', error);
        setAnalysis(error.message || '抱歉，获取MBTI分析结果时出现错误，请稍后重试。');
        setLoading(false) // 立即重置加载状态
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
      <Typography variant="h3" component="h3" className="text-center mb-2">MBTI性格分析</Typography>
      <Typography variant="body1" className="text-center text-gray-600 mb-6">探索你的性格特征，了解自己的潜力</Typography>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TextField
              fullWidth
              required
              label="你的职业"
              value={state.formData.occupation || ""}
              onChange={(e) => setFormData({ ...state.formData, occupation: e.target.value })}
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
              label="兴趣爱好"
              value={state.formData.hobbies || ""}
              onChange={(e) => setFormData({ ...state.formData, hobbies: e.target.value })}
              className="rounded-md"
            />

            <Button
              type="submit"
              variant="contained"
              disabled={state.loading}
              className="w-full h-12 text-base font-medium rounded-md shadow-md transition-all duration-300 hover:shadow-lg"
            >
              {state.loading ? '正在进行MBTI分析...' : '开始MBTI分析'}
            </Button>
          </LocalizationProvider>
        </form>
      </div>
      {state.loading && <MysticLoading text="MBTI性格分析结果..." />}

      {state.result && (
        <ResultCard
          title="MBTI性格分析结果"
          content={state.result}
          enableTypewriter={true}
          typewriterDelay={50}
        />
      )}
    </div>
  )
}

export default MBTIAnalysis

