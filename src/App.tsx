import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import Layout from './components/Layout'
import Landing from './scenes/Landing'
import SplitScreen from './scenes/SplitScreen'
import PlatformFlip from './scenes/PlatformFlip'
import Flywheel from './scenes/Flywheel'
import FeedTeaser from './scenes/FeedTeaser'

const sceneOrder = ['/', '/split', '/platform', '/flywheel', '/feed']

function App() {
  const location = useLocation()
  const navigate = useNavigate()

  // Keyboard navigation: left/right arrows + 1/2/3/4 jump
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement) return
      const idx = sceneOrder.indexOf(location.pathname)
      if (e.key === 'ArrowRight' && idx < sceneOrder.length - 1) {
        navigate(sceneOrder[idx + 1])
      }
      if (e.key === 'ArrowLeft' && idx > 0) {
        navigate(sceneOrder[idx - 1])
      }
      if (e.key === '0') navigate('/')
      if (e.key === '1') navigate('/split')
      if (e.key === '2') navigate('/platform')
      if (e.key === '3') navigate('/flywheel')
      if (e.key === '4') navigate('/feed')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [location.pathname, navigate])

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/split" element={<SplitScreen />} />
            <Route path="/platform" element={<PlatformFlip />} />
            <Route path="/flywheel" element={<Flywheel />} />
            <Route path="/feed" element={<FeedTeaser />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </Layout>
  )
}

export default App
