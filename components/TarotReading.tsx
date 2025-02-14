"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { TextField, Select, Button, Card, Typography, MenuItem, FormControl, InputLabel } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import ResultCard from "@/components/ResultCard";
import MysticLoading from './MysticLoading'
import { useFortuneState } from '../hooks/useFortuneState'
import { useRequestState } from '../hooks/useRequestState'

const TarotReading: React.FC = () => {
  const { state, setFormData, setResult: setReading, setLoading } = useFortuneState({
    storageKey: 'tarotReading',
    keepAlive: true,
    initialState: {
      formData: {
        name: '',
        birthdate: null,
        lifeStage: ''
      },
      result: '',
      loading: false
    }
  })

  const { isActive, createController, cleanup, setPendingRequest } = useRequestState({
    keepAlive: true,
    storageKey: 'tarotReading'
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setReading('')
    const newController = createController()

    try {
      const timeoutId = setTimeout(() => {
        newController.abort()
      }, 100000)

      const request = fetch('/api/tarot-reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: state.formData.name,
          birthDate: state.formData.birthdate ? new Date(state.formData.birthdate).toISOString().split('T')[0] : '',
          lifeStage: state.formData.lifeStage
        }),
        signal: newController.signal
      });
      setPendingRequest(request);
      const response = await request;

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error('占卜请求失败');
      }

      const data = await response.json();
      if (isActive) {
        if (data.choices && data.choices[0] && data.choices[0].message) {
          setReading(data.choices[0].message.content);
        } else {
          throw new Error('返回数据格式不正确');
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('请求被取消或超时')
        if (isActive) {
          setReading('抱歉，请求被中断。请重新尝试。')
        }
      } else {
        console.error('获取塔罗牌占卜结果失败:', error);
        const errorMessage = error.message || '抱歉，获取塔罗牌占卜结果时出现错误，请稍后重试。';
        setReading(errorMessage);
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
      <Typography variant="h3" component="h3" className="text-center mb-2">塔罗牌占卜</Typography>
      <Typography variant="body1" className="text-center text-gray-600 mb-6">探索你的命运，获得生活指引</Typography>

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
              value={state.formData.birthdate || null}
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
              <InputLabel id="life-stage-label">当前生活阶段</InputLabel>
              <Select
                labelId="life-stage-label"
                fullWidth
                value={state.formData.lifeStage || ""}
                onChange={(e) => setFormData({ ...state.formData, lifeStage: e.target.value })}
                sx={{ borderRadius: '4px' }}
                label="当前生活阶段"
              >
                <MenuItem value="">请选择</MenuItem>
                <MenuItem value="career">事业发展</MenuItem>
                <MenuItem value="study">学习深造</MenuItem>
                <MenuItem value="marriage">婚恋情感</MenuItem>
                <MenuItem value="health">健康养生</MenuItem>
                <MenuItem value="wealth">财富规划</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              disabled={state.loading}
              className="w-full h-12 text-base font-medium rounded-md shadow-md transition-all duration-300 hover:shadow-lg"
            >
              {state.loading ? '正在进行塔罗牌解读...' : '开始塔罗牌解读'}
            </Button>
          </LocalizationProvider>
        </form>
      </div>
      {state.loading && <MysticLoading text="塔罗牌解读中..." />}
      {state.result && (
          <ResultCard
              title="塔罗牌解读结果"
              content={state.result}
              enableTypewriter={true}
              typewriterDelay={50}
          />
      )}
    </div>
  )
}

export default TarotReading

