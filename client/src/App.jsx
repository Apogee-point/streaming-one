import { useEffect, useState , useRef} from 'react'
import './App.css'
import io from 'socket.io-client';
const socket = io('http://localhost:3000');

function App() {

  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef(null);
  const videoSrc = 'http://localhost:3000/movie.mp4'

  useEffect(() => {
    socket.on('currentTime', (time) => {
      console.log('currentTime', time);
      setCurrentTime(time);
    });

    socket.on('pause', () => {
      console.log('pause');
      videoRef.current.pause();
    })

    socket.on('play', () => {
      console.log('play');
      videoRef.current.play();
    })

    return () => {
      socket.off('currentTime');
      socket.off('pause');
      socket.off('play');
    };
  }, []);

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

  document.addEventListener('keydown', (event) => {
    if (event.key === 'm') {
      videoRef.current.muted = !videoRef.current.muted;
    }
  });

  const pauseVideo = () => {
    videoRef.current.pause();
    socket.emit('pause');
  }

  const playVideo = () => {
    videoRef.current.play();
    socket.emit('play');
  }

  // useEffect(() => {
  //   const handleKeyDown = (event) => {
  //     if (event.key === 'm') {
  //       videoRef.current.muted = !videoRef.current.muted;
  //     }
  //   };

  //   document.addEventListener('keydown', handleKeyDown);
  //   return () => {
  //     document.removeEventListener('keydown', handleKeyDown);
  //   };
  // }, []);
  return (
    <>
      <video ref={videoRef} autoPlay muted/>
      <button onClick={pauseVideo}>Pause</button>
      <button onClick={playVideo}>Play</button>
    </>
  )
}

export default App
