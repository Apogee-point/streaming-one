/* eslint-disable react/prop-types */
import  { useEffect, useRef } from 'react';

const VideoPlayer = ({currentTime}) => {
    const videoRef = useRef(null);
    const videoSrc = 'http://localhost:3000/movie.mp4'
    
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.src = videoSrc;
            videoRef.current.currentTime = currentTime;
            console.log('videoRef.current.currentTime', videoRef.current.currentTime);
            videoRef.current.play();
        }
    }, [currentTime]);

    const stopVideo = () =>{
        // if video is playing, stop it
        if (!videoRef.current.paused) {
            videoRef.current.pause();
        }
        else{
            // resume video
            videoRef.current.play();
        }
    }

    return (
        <div>
            <button id="setTime" onClick={() => videoRef.current.currentTime = 10}>Set Time</button>
            <video ref={videoRef} controls autoPlay />
            {/* <button id="playVideo" onClick={playVideo}>Play Video</button> */}
            <button id="stopVideo" onClick={stopVideo}>Stop Video</button>
        </div>
    );
};

export default VideoPlayer;
