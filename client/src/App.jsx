import { useEffect, useState , useRef} from 'react'
import './App.css'
// import VideoPlayer from './VideoComponent'
function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef(null);
  const videoSrc = 'http://localhost:3000/movie.mp4'
  useEffect(() => {
    fetch('http://localhost:3000/time')
      .then(res => res.json())
      .then(data => {
        setCurrentTime(data.time);
      });
  }, []);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = videoSrc;
      videoRef.current.currentTime = currentTime;
      videoRef.current.play();
    }
  }, [currentTime]);

  // handle key click M to unmute or mute the video
  document.addEventListener('keydown', (event) => {
    if (event.key === 'm') {
      videoRef.current.muted = !videoRef.current.muted;
    }
  });
  return (
    <>
      {/* <VideoPlayer currentTime={currentTime}  /> */}
      <video ref={videoRef} autoPlay muted/>
    </>
  )
}

export default App
