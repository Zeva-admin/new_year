import { Crown, User } from 'lucide-react';
import { useStore } from '../store';

const UserList = () => {
  const { currentRoom, currentUser } = useStore();

  if (!currentRoom) return null;

  return (
    <div className="p-4">
      <h3 className="font-semibold text-dark-100 mb-3 flex items-center">
        <User className="w-4 h-4 mr-2" />
        Participants ({currentRoom.users.length})
      </h3>
      <div className="space-y-2">
        {currentRoom.users.map((user) => (
          <div
            key={user.id}
            className={`flex items-center space-x-3 p-2 rounded-lg ${
              user.id === currentUser?.id
                ? 'bg-primary-600/20 border border-primary-600/30'
                : 'bg-dark-700/50'
            }`}
          >
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-dark-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-dark-100 truncate">
                  {user.username}
                </span>
                {user.isHost && (
                  <Crown className="w-4 h-4 text-yellow-400" />
                )}
                {user.id === currentUser?.id && (
                  <span className="text-xs text-primary-400">(You)</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;