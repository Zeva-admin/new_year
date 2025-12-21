import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { Play, Pause, Maximize, Volume2, VolumeX } from 'lucide-react';

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { currentRoom, currentUser, syncVideo } = useStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (currentUser && currentRoom) {
      setIsHost(currentUser.id === currentRoom.hostId || currentUser.isHost);
    }
  }, [currentUser, currentRoom]);

  useEffect(() => {
    if (currentRoom && videoRef.current) {
      setIsPlaying(currentRoom.isPlaying);
      setCurrentTime(currentRoom.currentTime);
      
      if (currentRoom.isPlaying) {
        videoRef.current.currentTime = currentRoom.currentTime;
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.currentTime = currentRoom.currentTime;
        videoRef.current.pause();
      }
    }
  }, [currentRoom]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      if (isHost) {
        syncVideo({ currentTime: video.currentTime, isPlaying: true });
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (isHost) {
        syncVideo({ currentTime: video.currentTime, isPlaying: false });
      }
    };

    const handleSeeked = () => {
      if (isHost) {
        syncVideo({ currentTime: video.currentTime, isPlaying: video.paused ? false : true });
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('seeked', handleSeeked);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, [isHost, syncVideo]);

  const togglePlayPause = () => {
    if (!videoRef.current || !isHost) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current || !isHost) return;
    
    const time = parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    videoRef.current.volume = vol;
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    
    if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
      setVolume(1);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
      setVolume(0);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleMouseLeave = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  if (!currentRoom?.videoUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-dark-400">
        <div className="text-center">
          <div className="w-24 h-24 bg-dark-800 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Play className="w-12 h-12 text-dark-600" />
          </div>
          <h3 className="text-xl font-semibold text-dark-200 mb-2">No Video Selected</h3>
          <p className="text-dark-400 mb-4">
            {isHost ? 'Click on settings to add a video URL' : 'Waiting for host to add a video'}
          </p>
          {isHost && (
            <p className="text-sm text-dark-500">
              Supported formats: MP4, WebM, YouTube URLs
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-full bg-dark-950 rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={currentRoom.videoUrl}
        className="w-full h-full object-contain"
        onClick={togglePlayPause}
      />

      {/* Controls */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Progress Bar */}
        <div className="mb-3">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            disabled={!isHost}
            className="w-full h-1 bg-dark-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, #374151 ${(currentTime / duration) * 100}%, #374151 100%)`
            }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={togglePlayPause}
              disabled={!isHost}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white disabled:opacity-50 transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-dark-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="text-sm text-white font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {!isHost && (
            <div className="text-sm text-white/70">
              Only the host can control playback
            </div>
          )}

          <div className="flex items-center space-x-3">
            <button className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Host Indicator */}
      {isHost && (
        <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          Host
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;