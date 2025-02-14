"use client"
import KeepAlive from "@/components/KeepAlive"
import { useState } from "react"
import TarotReading from "@/components/TarotReading"
import BaziAnalysis from "@/components/BaziAnalysis"
import FortunePrediction from "@/components/FortunePrediction"
import MonthlyFortune from "@/components/MonthlyFortune"
import MBTIAnalysis from "@/components/MBTIAnalysis"
import DeepPersonalityAnalysis from "@/components/DeepPersonalityAnalysis"
import ZodiacBloodTypeAnalysis from "@/components/ZodiacBloodTypeAnalysis"
import LoveFortune from "@/components/LoveFortune"
import RelationshipAnalysis from "@/components/RelationshipAnalysis"
import CareerFortune from "@/components/CareerFortune"
import HealthFortune from "@/components/HealthFortune"
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Typography, Container, IconButton, useMediaQuery, useTheme } from "@mui/material"
import {
  Psychology,
  Calculate,
  Stars,
  CalendarMonth,
  Person,
  Face,
  Bloodtype,
  Favorite,
  People,
  Work,
  HealthAndSafety,
  Menu as MenuIcon
} from '@mui/icons-material'

const drawerWidth = 256

const menuItems = [
  { id: "1", label: "塔罗牌占卜", icon: <Psychology /> },
  { id: "2", label: "八字运势", icon: <Calculate /> },
  { id: "3", label: "运势预测", icon: <Stars /> },
  { id: "4", label: "月度运势", icon: <CalendarMonth /> },
  { id: "5", label: "MBTI性格分析", icon: <Person /> },
  { id: "6", label: "深度性格剖析", icon: <Face /> },
  { id: "7", label: "星座+血型性格分析", icon: <Bloodtype /> },
  { id: "8", label: "爱情运势预测", icon: <Favorite /> },
  { id: "9", label: "情感关系分析", icon: <People /> },
  { id: "10", label: "事业运势预测", icon: <Work /> },
  { id: "11", label: "健康运势预测", icon: <HealthAndSafety /> },
]

export default function Home() {
  const [selectedKey, setSelectedKey] = useState("1")
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const renderContent = () => {
    switch (selectedKey) {
      case "1":
        return <KeepAlive id="tarot-reading"><TarotReading /></KeepAlive>
      case "2":
        return <KeepAlive id="bazi-analysis"><BaziAnalysis /></KeepAlive>
      case "3":
        return <KeepAlive id="fortune-prediction"><FortunePrediction /></KeepAlive>
      case "4":
        return <KeepAlive id="monthly-fortune"><MonthlyFortune /></KeepAlive>
      case "5":
        return <KeepAlive id="mbti-analysis"><MBTIAnalysis /></KeepAlive>
      case "6":
        return <KeepAlive id="deep-personality"><DeepPersonalityAnalysis /></KeepAlive>
      case "7":
        return <KeepAlive id="zodiac-blood"><ZodiacBloodTypeAnalysis /></KeepAlive>
      case "8":
        return <KeepAlive id="love-fortune"><LoveFortune /></KeepAlive>
      case "9":
        return <KeepAlive id="relationship-analysis"><RelationshipAnalysis /></KeepAlive>
      case "10":
        return <KeepAlive id="career-fortune"><CareerFortune /></KeepAlive>
      case "11":
        return <KeepAlive id="health-fortune"><HealthFortune /></KeepAlive>
      default:
        return <KeepAlive id="tarot-reading"><TarotReading /></KeepAlive>
    }
  }

  const drawer = (
    <>
      <Box sx={{
        height: 64,
        bgcolor: 'primary.main',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(45deg, #673ab7 30%, #9c27b0 90%)',
      }}>
        <Typography variant="h6" color="white">运势与性格分析</Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={selectedKey === item.id}
              onClick={() => {
                setSelectedKey(item.id)
                if (isMobile) {
                  setMobileOpen(false)
                }
              }}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'rgba(103, 58, 183, 0.08)',
                  '&:hover': {
                    bgcolor: 'rgba(103, 58, 183, 0.12)',
                  },
                },
                '&:hover': {
                  bgcolor: 'rgba(103, 58, 183, 0.04)',
                },
                py: 1.5, // 增加垂直内边距，优化移动端触摸体验
              }}
            >
              <Box sx={{ mr: 2, color: selectedKey === item.id ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </Box>
              <ListItemText
                primary={item.label}
                sx={{
                  color: selectedKey === item.id ? 'primary.main' : 'inherit',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {isMobile && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1100, bgcolor: 'primary.main', background: 'linear-gradient(45deg, #673ab7 30%, #9c27b0 90%)' }}>
          <IconButton
            color="inherit"
            aria-label="打开菜单"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              m: 1,
              position: 'fixed',
              left: 10,
              top: 6,
              bgcolor: '#f5f0fa',
              borderRadius: '6px',
              '&:hover': {
                bgcolor: 'rgba(103, 58, 183, 0.12)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', py: 2, color: 'white' }}>
            运势与性格分析
          </Typography>
        </Box>
      )}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // 提升移动端性能
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'background.paper',
            borderRight: '1px solid rgba(103, 58, 183, 0.12)',
            mt: isMobile ? '64px' : 0, // 移动端时为顶部导航栏留出空间
          },
        }}
      >
        {drawer}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          bgcolor: 'background.default',
          mt: isMobile ? '64px' : 0, // 移动端时为顶部导航栏留出空间
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
          {renderContent()}
        </Container>
      </Box>
    </Box>
  )
}
