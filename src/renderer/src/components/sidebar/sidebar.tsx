import { Box, Button } from '@chakra-ui/react'
import { FiSettings, FiClock, FiPlus, FiChevronLeft } from 'react-icons/fi'
import { sidebarStyles } from './sidebar-styles'
import SettingUI from './setting/setting-ui'
import ChatHistoryPanel from './chat-history-panel'
import CameraPanel from './camera-panel'
import HistoryDrawer from './history-drawer'
import { useSidebar } from '@/hooks/sidebar/use-sidebar'
import { memo } from 'react'

// Type definitions
interface SidebarProps {
  isCollapsed?: boolean
  onToggle: () => void
}

interface HeaderButtonsProps {
  onSettingsOpen: () => void
  onNewHistory: () => void
}

// Reusable components
const ToggleButton = memo(({ isCollapsed, onToggle }: { 
  isCollapsed: boolean
  onToggle: () => void 
}) => (
  <Box
    {...sidebarStyles.sidebar.toggleButton}
    style={{
      transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)'
    }}
    onClick={onToggle}
  >
    <FiChevronLeft />
  </Box>
))

ToggleButton.displayName = 'ToggleButton'

const HeaderButtons = memo(({ onSettingsOpen, onNewHistory }: HeaderButtonsProps) => (
  <Box display="flex" gap={1}>
    <Button onClick={onSettingsOpen}>
      <FiSettings />
    </Button>

    <HistoryDrawer>
      <Button>
        <FiClock />
      </Button>
    </HistoryDrawer>

    <Button onClick={onNewHistory}>
      <FiPlus />
    </Button>
  </Box>
))

HeaderButtons.displayName = 'HeaderButtons'

const SidebarContent = memo(({ onSettingsOpen, onNewHistory }: HeaderButtonsProps) => (
  <Box {...sidebarStyles.sidebar.content}>
    <Box {...sidebarStyles.sidebar.header}>
      <HeaderButtons 
        onSettingsOpen={onSettingsOpen} 
        onNewHistory={onNewHistory} 
      />
    </Box>
    <ChatHistoryPanel />
    <CameraPanel />
  </Box>
))

SidebarContent.displayName = 'SidebarContent'

// Main component
function Sidebar({ isCollapsed = false, onToggle }: SidebarProps): JSX.Element {
  const {
    settingsOpen,
    onSettingsOpen,
    onSettingsClose,
    createNewHistory
  } = useSidebar()

  return (
    <Box {...sidebarStyles.sidebar.container(isCollapsed)}>
      <ToggleButton isCollapsed={isCollapsed} onToggle={onToggle} />

      {!isCollapsed && !settingsOpen && (
        <SidebarContent 
          onSettingsOpen={onSettingsOpen} 
          onNewHistory={createNewHistory} 
        />
      )}

      {!isCollapsed && settingsOpen && (
        <SettingUI 
          open={settingsOpen} 
          onClose={onSettingsClose} 
          onToggle={onToggle} 
        />
      )}
    </Box>
  )
}

export default Sidebar
