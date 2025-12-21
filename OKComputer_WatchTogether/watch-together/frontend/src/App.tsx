import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useStore } from './store';
import HomePage from './pages/HomePage';
import RoomPage from './pages/RoomPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

function App() {
  const { connectSocket, disconnectSocket, currentRoom } = useStore();

  useEffect(() => {
    connectSocket();
    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/room/:roomId" 
            element={currentRoom ? <RoomPage /> : <Navigate to="/" replace />} 
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
          },
        }}
      />
    </>
  );
}

export default App;