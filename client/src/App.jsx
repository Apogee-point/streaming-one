import { useEffect, useState } from 'react'
import './App.css'
import VideoPlayer from './VideoComponent'
function App() {
  const [currentTime, setCurrentTime] = useState(0);
  useEffect(() => {
    const getTime = async () => {
      const response = await fetch('http://localhost:3000/time')
      const data = await response.json()
      setCurrentTime(data.time)
      console.log(data.time)
    }
    getTime()
  });
  return (
    <>
      <VideoPlayer currentTime={currentTime}  />
    </>
  )
}

export default App
