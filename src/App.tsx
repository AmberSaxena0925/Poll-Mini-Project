import React, { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { isSupabaseConfigured } from "./lib/supabase";
import { Header } from "./components/Header";
import { AuthForm } from "./components/AuthForm";
import { CreatePoll } from "./components/CreatePoll";
import { PollList } from "./components/PollList";
import { Plus } from "lucide-react";

function App() {
  const { user, loading } = useAuth();
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  // Show configuration message if Supabase is not configured
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mb-4">
              <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Setup Required</h1>
            <p className="text-gray-300 mb-6">
              To use VoteSpace, you need to configure Supabase. Please click the "Connect to Supabase\" button 
              in the top right corner to set up your database connection.
            </p>
            <p className="text-gray-300 mb-6">
            To use VoteSpace, you need to connect to Supabase. Click the "Connect to Supabase" button in the top right to set up your database connection.
          </p>
          <p className="text-sm text-gray-400">
            Once connected, you'll be able to create polls, vote, and see real-time results.
          </p>
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-left">
              <h3 className="text-blue-200 font-semibold mb-2">What you'll need:</h3>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• A Supabase account (free at supabase.com)</li>
                <li>• Your project URL and API key</li>
                <li>• Database tables will be created automatically</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading VoteSpace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <Header 
        onCreatePoll={() => setShowCreatePoll(true)}
        showCreateButton={!!user}
      />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user && !showAuth ? (
          <div className="text-center py-20">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 shadow-xl border border-white/20 max-w-2xl mx-auto">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  Welcome to VoteSpace
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Create polls, gather opinions, and see results in real-time. Join thousands of users making decisions together.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Plus className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Create Polls</h3>
                    <p className="text-sm text-gray-400">Easy poll creation with multiple options</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-white mb-2">Vote Securely</h3>
                    <p className="text-sm text-gray-400">One vote per user, secure authentication</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L3.5 16.49z"/>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-white mb-2">Live Results</h3>
                    <p className="text-sm text-gray-400">Watch votes come in with real-time updates</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowAuth(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 text-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        ) : !user ? (
          <div className="max-w-md mx-auto mt-20">
            <AuthForm onSuccess={() => setShowAuth(false)} />
          </div>
        ) : showCreatePoll ? (
          <div className="max-w-2xl mx-auto">
            <CreatePoll
              onPollCreated={() => setShowCreatePoll(false)}
              onCancel={() => setShowCreatePoll(false)}
            />
          </div>
        ) : (
          <PollList />
        )}
      </main>
    </div>
  );
}

export default App;