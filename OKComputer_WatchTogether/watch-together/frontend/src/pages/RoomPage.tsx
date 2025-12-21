import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Users, Settings, Copy, LogOut, Play, Pause } from 'lucide-react';
import { useStore } from '../store';
import VideoPlayer from '../components/VideoPlayer';
import Chat from '../components/Chat';
import UserList from '../components/UserList';
import { toast } from 'react-hot-toast';

const RoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { currentRoom, currentUser, isConnected, setVideoUrl } = useStore();
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!currentRoom && isConnected) {
      toast.error('Room not found');
      navigate('/');
    }
  }, [currentRoom, isConnected, navigate]);

  const handleCopyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      toast.success('Room ID copied to clipboard');
    }
  };

  const handleLeaveRoom = () => {
    navigate('/');
  };

  const handleSetVideoUrl = () => {
    if (!videoUrlInput.trim()) {
      toast.error('Please enter a video URL');
      return;
    }
    
    setVideoUrl(videoUrlInput.trim());
    setVideoUrlInput('');
    setShowSettings(false);
    toast.success('Video URL updated');
  };

  if (!currentRoom || !currentUser) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-dark-400">Loading room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-dark-100">{currentRoom.name}</h1>
            <div className="flex items-center space-x-2 text-sm text-dark-400">
              <Users className="w-4 h-4" />
              <span>{currentRoom.users.length} users</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopyRoomId}
              className="btn-secondary text-sm"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy ID
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="btn-secondary"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={handleLeaveRoom}
              className="btn-ghost text-red-400 hover:text-red-300"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-screen pt-16">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Video Settings Panel */}
          {showSettings && (
            <div className="bg-dark-800 border-b border-dark-700 p-4">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Video URL
                  </label>
                  <input
                    type="url"
                    value={videoUrlInput}
                    onChange={(e) => setVideoUrlInput(e.target.value)}
                    placeholder="https://example.com/video.mp4 or YouTube URL"
                    className="input"
                  />
                </div>
                <button
                  onClick={handleSetVideoUrl}
                  className="btn-primary"
                >
                  Update Video
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Video Player */}
          <div className="flex-1 bg-dark-950 flex items-center justify-center p-4">
            <VideoPlayer />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-96 bg-dark-800 border-l border-dark-700 flex flex-col">
          {/* User List */}
          <div className="border-b border-dark-700">
            <UserList />
          </div>
          
          {/* Chat */}
          <div className="flex-1 flex flex-col">
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;