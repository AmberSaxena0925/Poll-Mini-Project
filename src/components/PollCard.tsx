import React, { useState, useEffect } from 'react';
import { Clock, Users, CheckCircle, BarChart3 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Poll, PollOption } from '../types/database';

interface PollCardProps {
  poll: Poll;
  onVote?: () => void;
}

export const PollCard: React.FC<PollCardProps> = ({ poll, onVote }) => {
  const [options, setOptions] = useState<PollOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    loadPollData();
  }, [poll.id, user]);

  useEffect(() => {
    if (!poll.id) return;

    // Subscribe to real-time updates for poll options
    const subscription = supabase
      .channel(`poll-${poll.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'poll_options',
        filter: `poll_id=eq.${poll.id}`
      }, () => {
        loadOptions();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [poll.id]);

  const loadPollData = async () => {
    await loadOptions();
    if (user) {
      await checkUserVote();
    }
  };

  const loadOptions = async () => {
    const { data, error } = await supabase
      .from('poll_options')
      .select('*')
      .eq('poll_id', poll.id)
      .order('created_at');

    if (!error && data) {
      setOptions(data);
      setTotalVotes(data.reduce((sum, option) => sum + option.vote_count, 0));
    }
  };

  const checkUserVote = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('votes')
      .select('option_id')
      .eq('poll_id', poll.id)
      .eq('user_id', user.id)
      .single();

    if (!error && data) {
      setHasVoted(true);
      setSelectedOption(data.option_id);
    }
  };

  const handleVote = async (optionId: string) => {
    if (!user || hasVoted || loading) return;

    setLoading(true);
    try {
      // Insert vote
      const { error: voteError } = await supabase
        .from('votes')
        .insert({
          poll_id: poll.id,
          option_id: optionId,
          user_id: user.id,
        });

      if (voteError) throw voteError;

      // Update option vote count
      const { error: updateError } = await supabase.rpc('increment_vote_count', {
        option_id: optionId
      });

      if (updateError) throw updateError;

      setHasVoted(true);
      setSelectedOption(optionId);
      onVote?.();
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPercentage = (votes: number) => {
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  };

  const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date();

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">{poll.title}</h3>
        {poll.description && (
          <p className="text-gray-300 text-sm">{poll.description}</p>
        )}
        
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{totalVotes} votes</span>
          </div>
          {poll.expires_at && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>
                {isExpired ? 'Expired' : `Expires ${new Date(poll.expires_at).toLocaleDateString()}`}
              </span>
            </div>
          )}
          {hasVoted && (
            <div className="flex items-center gap-1 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span>Voted</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {options.map((option) => {
          const percentage = getPercentage(option.vote_count);
          const isSelected = selectedOption === option.id;
          const canVote = user && !hasVoted && !isExpired && poll.is_active;

          return (
            <div key={option.id} className="relative">
              <button
                onClick={() => canVote && handleVote(option.id)}
                disabled={!canVote || loading}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  canVote
                    ? 'border-white/20 hover:border-blue-400 hover:bg-blue-500/10 cursor-pointer'
                    : 'border-white/10 cursor-default'
                } ${isSelected ? 'border-green-400 bg-green-500/10' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{option.option_text}</span>
                  {hasVoted && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-300">{option.vote_count}</span>
                      <span className="text-sm font-semibold text-white">{percentage}%</span>
                    </div>
                  )}
                  {isSelected && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                </div>
                
                {hasVoted && (
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {!user && (
        <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-200 text-sm text-center">
          Please sign in to vote on this poll
        </div>
      )}

      {isExpired && (
        <div className="mt-4 p-3 bg-orange-500/20 border border-orange-500/30 rounded-lg text-orange-200 text-sm text-center flex items-center justify-center gap-2">
          <Clock className="w-4 h-4" />
          This poll has expired
        </div>
      )}
    </div>
  );
};