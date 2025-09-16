import React from 'react';
import { Vote, Plus, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  onCreatePoll?: () => void;
  showCreateButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onCreatePoll, showCreateButton = true }) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Vote className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">VoteSpace</h1>
              <p className="text-xs text-gray-300 hidden sm:block">Real-time voting platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user && showCreateButton && onCreatePoll && (
              <button
                onClick={onCreatePoll}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:block">Create Poll</span>
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg">
                  <User className="w-4 h-4 text-gray-300" />
                  <span className="text-sm text-white hidden sm:block">
                    {user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="text-sm text-gray-300">
                Sign in to create and vote on polls
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};