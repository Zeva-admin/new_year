import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Play, Plus, ArrowRight, Film } from 'lucide-react';
import { useStore } from '../store';
import { toast } from 'react-hot-toast';

const HomePage = () => {
  const navigate = useNavigate();
  const { createRoom, joinRoom, isConnected, isLoading } = useStore();
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [formData, setFormData] = useState({
    username: '',
    roomName: '',
    videoUrl: '',
    roomId: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      toast.error('Please enter your username');
      return;
    }
    
    if (!formData.roomName.trim()) {
      toast.error('Please enter room name');
      return;
    }

    if (!isConnected) {
      toast.error('Not connected to server');
      return;
    }

    createRoom({
      username: formData.username.trim(),
      roomName: formData.roomName.trim(),
      videoUrl: formData.videoUrl.trim() || undefined
    });
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      toast.error('Please enter your username');
      return;
    }
    
    if (!formData.roomId.trim()) {
      toast.error('Please enter room ID');
      return;
    }

    if (!isConnected) {
      toast.error('Not connected to server');
      return;
    }

    joinRoom({
      username: formData.username.trim(),
      roomId: formData.roomId.trim()
    });
  };

  const features = [
    {
      icon: <Users className="w-6 h-6 text-primary-400" />,
      title: 'Watch Together',
      description: 'Synchronized video playback for everyone in the room'
    },
    {
      icon: <Play className="w-6 h-6 text-primary-400" />,
      title: 'Any Video Source',
      description: 'Support for YouTube, Vimeo, and direct video URLs'
    },
    {
      icon: <Film className="w-6 h-6 text-primary-400" />,
      title: 'Real-time Sync',
      description: 'Instant synchronization of play, pause, and seek actions'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Film className="w-12 h-12 text-primary-500 mr-3" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              WatchTogether
            </h1>
          </div>
          <p className="text-dark-400 text-lg max-w-2xl mx-auto">
            Watch movies and videos with friends in perfect synchronization, no matter where you are
          </p>
          
          {/* Connection Status */}
          <div className="flex items-center justify-center mt-4">
            <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
              isConnected 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                isConnected ? 'bg-green-400' : 'bg-red-400'
              } ${isConnected ? 'animate-pulse' : ''}`} />
              {isConnected ? 'Connected' : 'Connecting...'}
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Features Section */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-dark-100 mb-6">Why WatchTogether?</h2>
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-dark-800 rounded-lg flex items-center justify-center border border-dark-700">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-dark-100 mb-2">{feature.title}</h3>
                    <p className="text-dark-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Section */}
          <div className="card">
            <div className="card-header">
              <div className="flex space-x-1 bg-dark-900 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('create')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'create'
                      ? 'bg-primary-600 text-white'
                      : 'text-dark-400 hover:text-dark-200'
                  }`}
                >
                  Create Room
                </button>
                <button
                  onClick={() => setActiveTab('join')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'join'
                      ? 'bg-primary-600 text-white'
                      : 'text-dark-400 hover:text-dark-200'
                  }`}
                >
                  Join Room
                </button>
              </div>
            </div>

            <div className="card-content">
              {activeTab === 'create' ? (
                <form onSubmit={handleCreateRoom} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Your Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="Enter your username"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Room Name
                    </label>
                    <input
                      type="text"
                      name="roomName"
                      value={formData.roomName}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="My Movie Night"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Video URL (Optional)
                    </label>
                    <input
                      type="url"
                      name="videoUrl"
                      value={formData.videoUrl}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="https://example.com/video.mp4"
                    />
                    <p className="text-xs text-dark-500 mt-1">
                      You can add this later in the room
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !isConnected}
                    className="btn-primary w-full"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Room
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleJoinRoom} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Your Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="Enter your username"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Room ID
                    </label>
                    <input
                      type="text"
                      name="roomId"
                      value={formData.roomId}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="Enter room ID"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !isConnected}
                    className="btn-primary w-full"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Joining...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Join Room
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;