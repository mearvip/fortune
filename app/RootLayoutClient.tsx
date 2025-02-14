"use client"

import { Inter } from "next/font/google"
import type React from "react"
import LoadingProvider from "./components/LoadingProvider"
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from './theme'
import { Box, Container } from '@mui/material'

const inter = Inter({ subsets: ["latin"] })

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={inter.className}>
        <LoadingProvider>
          <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
            <Box sx={{ minHeight: '100vh', py: 0 }}>
              {children}
            </Box>
          </Container>
        </LoadingProvider>
      </div>
    </ThemeProvider>
  )
}
