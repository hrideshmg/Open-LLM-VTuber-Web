// import { StrictMode } from 'react';
import { Box, Flex, ChakraProvider, defaultSystem } from '@chakra-ui/react'
import Canvas from './components/canvas/canvas'
import Sidebar from './components/sidebar/sidebar'
import Footer from './components/footer/footer'
import { AiStateProvider } from './context/ai-state-context'
import { L2DProvider } from './context/l2d-context'
import { SubtitleProvider } from './context/subtitle-context'
import { BgUrlProvider } from './context/bgurl-context'
import { layoutStyles } from './layout'
import WebSocketHandler from './services/websocket-handler'
import { ResponseProvider } from './context/response-context'
import { useState, useEffect } from 'react'
import { CameraProvider } from './context/camera-context'
import { ChatHistoryProvider } from './context/chat-history-context'
import { ConfigProvider } from './context/config-context'
import { Toaster } from './components/ui/toaster'
import { VADProvider } from './context/vad-context'
import { Live2D } from './components/canvas/live2d'
import TitleBar from './components/title-bar'

const App: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true)
  const [isFooterCollapsed, setIsFooterCollapsed] = useState(false)
  const [mode, setMode] = useState('window')
  const isElectron = window.api !== undefined
  if (isElectron) {
    useEffect(() => {
      window.electron.ipcRenderer.on('mode-changed', (_event, newMode) => {
        setMode(newMode)
      })
    }, [])
  }

  return (
    <ChakraProvider value={defaultSystem}>
      <CameraProvider>
        <ResponseProvider>
          <AiStateProvider>
            <L2DProvider>
              <SubtitleProvider>
                <VADProvider>
                  <BgUrlProvider>
                    <ConfigProvider>
                      <ChatHistoryProvider>
                        <WebSocketHandler>
                          <Toaster />
                          {mode === 'window' ? (
                            <>
                              {isElectron && <TitleBar />}
                              <Flex {...layoutStyles.appContainer}>
                                <Box
                                  {...layoutStyles.sidebar}
                                  {...(!showSidebar && { width: '24px' })}
                                >
                                  <Sidebar
                                    isCollapsed={!showSidebar}
                                    onToggle={() => setShowSidebar(!showSidebar)}
                                  />
                                </Box>
                                <Box {...layoutStyles.mainContent}>
                                  {/* <Box {...layoutStyles.canvas}> */}
                                    <Canvas/>
                                  {/* </Box> */}
                                  <Box
                                    {...layoutStyles.footer}
                                    {...(isFooterCollapsed && layoutStyles.collapsedFooter)}
                                  >
                                    <Footer
                                      isCollapsed={isFooterCollapsed}
                                      onToggle={() => setIsFooterCollapsed(!isFooterCollapsed)}
                                    />
                                  </Box>
                                </Box>
                              </Flex>
                            </>
                          ) : (
                            <Live2D isPet={mode === 'pet'} />
                          )}
                        </WebSocketHandler>
                      </ChatHistoryProvider>
                    </ConfigProvider>
                  </BgUrlProvider>
                </VADProvider>
              </SubtitleProvider>
            </L2DProvider>
          </AiStateProvider>
        </ResponseProvider>
      </CameraProvider>
    </ChakraProvider>
  )
}

export default App
