"use client"

import type React from "react"
import { useState } from "react"
import { TextField, Select, Button, MenuItem, Card, Typography, FormControl, InputLabel } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import ResultCard from './ResultCard'
import MysticLoading from './MysticLoading'
import { useFortuneState } from '../hooks/useFortuneState'
import { useRequestState } from '../hooks/useRequestState'

const DeepPersonalityAnalysis: React.FC = () => {
  const { state, setFormData, setResult: setAnalysis, setLoading } = useFortuneState({
    storageKey: 'personalityAnalysis'
  })
  const { isActive, createController, cleanup, setPendingRequest } = useRequestState()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setAnalysis('')

    const newController = createController()

    try {
      const timeoutId = setTimeout(() => {
        newController.abort()
      }, 100000) // 10秒超时

      const request = fetch('/api/deep-personality', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: state.formData.name,
          birthDate: state.formData.birthdate ? new Date(state.formData.birthdate).toISOString().split('T')[0] : '',
          emotionalState: state.formData.emotionalState
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
      } else {
        console.error('获取性格分析结果失败:', error);
        setAnalysis(error.message || '抱歉，获取性格分析结果时出现错误，请稍后重试。');
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
      <Typography variant="h3" component="h3" className="text-center mb-6">深度性格剖析</Typography>

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

            <FormControl fullWidth required>
              <InputLabel id="emotional-state-label">最近的情绪状态</InputLabel>
              <Select
                labelId="emotional-state-label"
                fullWidth
                value={state.formData.emotionalState || ""}
                onChange={(e) => setFormData({ ...state.formData, emotionalState: e.target.value })}
                sx={{ borderRadius: '4px' }}
                label="最近的情绪状态"
              >
                <MenuItem value="">
                  <em>请选择</em>
                </MenuItem>
                <MenuItem value="anxious">焦虑</MenuItem>
                <MenuItem value="confused">迷茫</MenuItem>
                <MenuItem value="excited">兴奋</MenuItem>
                <MenuItem value="stressed">压力大</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              disabled={state.loading}
              className="w-full h-12 text-base font-medium rounded-md shadow-md transition-all duration-300 hover:shadow-lg"
            >
              {state.loading ? '正在进行性格分析...' : '开始性格分析'}
            </Button>
          </LocalizationProvider>
        </form>
      </div>

      {state.loading && <MysticLoading text="深度性格分析结果..." />}

      {state.result && (
        <ResultCard
          title="深度性格分析结果"
          content={state.result}
          enableTypewriter={true}
          typewriterDelay={50}
        />
      )}
    </div>
  )
}

export default DeepPersonalityAnalysis

