"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {TextField, Select, Button, MenuItem, FormControl, InputLabel, Typography} from "@mui/material"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import ResultCard from './ResultCard'
import MysticLoading from './MysticLoading'
import { useFortuneState } from '../hooks/useFortuneState'
import { useRequestState } from '../hooks/useRequestState'

const BaziAnalysis: React.FC = () => {
  const { state, setFormData, setResult: setAnalysis, setLoading } = useFortuneState({
    storageKey: 'baziAnalysis',
    keepAlive: true,
    initialState: {
      formData: {
        name: '',
        birthdate: null,
        birthTime: null,
        gender: '',
        question: ''
      },
      result: '',
      loading: false
    }
  })
  const { isActive, createController, cleanup, setPendingRequest } = useRequestState({
    keepAlive: true,
    storageKey: 'baziAnalysis'
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setAnalysis('')

    const newController = createController()

    try {
      const timeoutId = setTimeout(() => {
        newController.abort()
      }, 10000) // 100秒超时

      const request = fetch('/api/bazi-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: state.formData.name,
          birthDate: state.formData.birthdate ? new Date(state.formData.birthdate).toISOString() : "",
          birthTime: state.formData.birthTime ? new Date(state.formData.birthTime).toISOString() : "",
          gender: state.formData.gender,
          question: state.formData.question
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
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('请求被取消或超时')
        if (isActive) {
          setAnalysis('抱歉，请求超时。请重新尝试。')
          setLoading(false)
        }
      } else {
        console.error('获取八字分析结果失败:', error);
        if (isActive) {
          setAnalysis(error.message || '抱歉，获取八字分析结果时出现错误，请稍后重试。');
          setLoading(false)
        }
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
      <Typography variant="h3" component="h3" className="text-center mb-2">八字命理分析</Typography>
      <Typography variant="body1" className="text-center text-gray-600 mb-6">探索命理奥秘，了解人生方向</Typography>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TextField
              fullWidth
              required
              label="姓名"
              value={state.formData.name || ""}
              onChange={(e) => setFormData({ ...state.formData, name: e.target.value })}
              className="rounded-md"
            />

            <DateTimePicker
              label="出生日期"
              value={state.formData.birthdate || null}
              onChange={(newDate) => {
                if (newDate) {
                  setFormData({
                    ...state.formData,
                    birthdate: newDate
                  });
                }
              }}
              className="w-full"
              views={['year', 'month', 'day']}
              format="yyyy-MM-dd"
              slotProps={{
                textField: {
                  required: true,
                  className: "rounded-md"
                }
              }}
            />

            <DateTimePicker
              label="出生时辰"
              value={state.formData.birthTime || null}
              onChange={(newTime) => {
                if (newTime) {
                  setFormData({
                    ...state.formData,
                    birthTime: newTime
                  });
                }
              }}
              className="w-full"
              views={['hours', 'minutes']}
              ampm={false}
              format="HH:mm"
              defaultView="hours"
              disableFuture
              slotProps={{
                textField: {
                  required: true,
                  className: "rounded-md"
                },
                layout: {
                  sx: {
                    '& .MuiTabs-root': {
                      display: 'none'
                    }
                  }
                }
              }}
            />

            <FormControl fullWidth required>
              <InputLabel id="gender-label">性别</InputLabel>
              <Select
                labelId="gender-label"
                value={state.formData.gender || ""}
                onChange={(e) => setFormData({ ...state.formData, gender: e.target.value })}
                sx={{ borderRadius: '4px' }}
                label="性别"
              >
                <MenuItem value=""><em>请选择性别</em></MenuItem>
                <MenuItem value="male">男</MenuItem>
                <MenuItem value="female">女</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="想要了解的问题"
              value={state.formData.question || ""}
              onChange={(e) => setFormData({ ...state.formData, question: e.target.value })}
              placeholder="请输入您想要了解的具体问题（选填）"
              className="rounded-md"
            />

            <Button
              type="submit"
              variant="contained"
              disabled={state.loading}
              className="w-full h-12 text-base font-medium rounded-md shadow-md transition-all duration-300 hover:shadow-lg"
            >
              {state.loading ? '正在进行八字分析...' : '开始八字分析'}
            </Button>
          </LocalizationProvider>
        </form>
      </div>
      {state.loading && <MysticLoading text="正在进行八字分析..."/>}
      {state.result && (
        <ResultCard
          title="八字分析结果"
          enableTypewriter={true}
          typewriterDelay={50}
          content={state.result}
        />
      )}
    </div>
  )
}

export default BaziAnalysis

