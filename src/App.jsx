import Scene from './components/Scene'
import './App.css'

function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      {/* 1. HTML Crosshair */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '6px',
        height: '6px',
        backgroundColor: '#ffffffb6', // Customize your crosshair color here
        borderRadius: '50%', // Optional: use '50%' for a dot, or remove for a +
        pointerEvents: 'none', // Allows clicks to pass through to the Canvas
        zIndex: 10
      }} />
      <Scene />
    </div>
  )
}

export default App
