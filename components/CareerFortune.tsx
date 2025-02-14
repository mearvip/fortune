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

const CareerFortune: React.FC = () => {
  const { state, setFormData, setResult: setFortune, setLoading } = useFortuneState({
    storageKey: 'careerFortune',
    keepAlive: true
  })
  const { isActive, createController, cleanup, setPendingRequest } = useRequestState({
    keepAlive: true,
    storageKey: 'careerFortune'
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
      const request = fetch('/api/career-fortune', {
        signal: newController.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          occupation: state.formData.occupation,
          birthDate: state.formData.birthdate ? new Date(state.formData.birthdate).toISOString().split('T')[0] : '',
          workStatus: state.formData.workStatus
        }),
      });
      setPendingRequest(request);
      const response = await request;

      if (!response.ok) {
        throw new Error('预测请求失败');
      }

      clearTimeout(timeoutId)

      const data = await response.json();
      if (isActive) {
        setFortune(data.choices[0].message.content);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('请求被取消或超时')
        setFortune('抱歉，请求超时。请重新尝试。')
      } else {
        console.error('获取事业运势预测失败:', error);
        setFortune(error.message || '抱歉，获取事业运势预测结果时出现错误，请稍后重试。');
      }
    } finally {
      if (isActive) {
        setLoading(false);
        cleanup();
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Typography variant="h3" component="h3" className="text-center mb-2">事业运势预测</Typography>
      <Typography variant="body1" className="text-center text-gray-600 mb-6">探索你的职业前景，获得事业指引</Typography>
      
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

            <FormControl fullWidth required>
              <InputLabel id="work-status-label">当前工作状态</InputLabel>
              <Select
                labelId="work-status-label"
                fullWidth
                value={state.formData.workStatus || ""}
                onChange={(e) => setFormData({ ...state.formData, workStatus: e.target.value })}
                sx={{ borderRadius: '4px' }}
                label="当前工作状态"
                tabIndex={0}
                MenuProps={{
                  PaperProps: {
                    'aria-hidden': false
                  }
                }}
              >
                <MenuItem value="">
                  <em>请选择</em>
                </MenuItem>
                <MenuItem value="job_hunting">求职中</MenuItem>
                <MenuItem value="employed">在职</MenuItem>
                <MenuItem value="entrepreneur">创业</MenuItem>
              </Select>
            </FormControl>

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

      {state.loading && <MysticLoading text='事业运势预测结果' />}

      {state.result && (
        <ResultCard
          title="事业运势预测结果"
          content={state.result}
          enableTypewriter={true}
          typewriterDelay={50}
        />
      )}
    </div>
  )
}

export default CareerFortune

