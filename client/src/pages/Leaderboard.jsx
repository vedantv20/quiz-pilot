import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Medal, Award, Filter, Clock, Target, TrendingUp, Users } from 'lucide-react';
import { leaderboardApi } from '../api/leaderboard';
import { subjectsApi } from '../api/subjects';
import { useAuthStore } from '../store/authStore';
import LeaderboardTable from '../components/LeaderboardTable';
import StatCard from '../components/StatCard';
import BadgeChip from '../components/BadgeChip';

const Leaderboard = () => {
  const { user } = useAuthStore();
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch subjects for filter
  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectsApi.getAll
  });

  // Fetch leaderboard data
  const { data: leaderboard = [], isLoading } = useQuery({
    queryKey: ['leaderboard', selectedSubject, selectedPeriod],
    queryFn: () => {
      const params = {};
      if (selectedSubject !== 'all') params.subject = selectedSubject;
      if (selectedPeriod !== 'all') params.period = selectedPeriod;
      return leaderboardApi.getLeaderboard(params);
    }
  });

  // Find current user's position
  const userId = user?.id || user?._id;
  const userPosition = leaderboard.findIndex((entry) => entry._id === userId) + 1;

  // Get top 3 for podium display
  const topThree = leaderboard.slice(0, 3);

  const handleSubjectFilter = (subjectId) => {
    setSelectedSubject(subjectId);
  };

  const handlePeriodFilter = (period) => {
    setSelectedPeriod(period);
  };

  return (
    <div className="page-shell">
      <div className="page-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              Leaderboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Compete with fellow students and track your progress
            </p>
          </div>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subject Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Filter by Subject
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleSubjectFilter('all')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedSubject === 'all'
                        ? 'bg-purple-600 text-white'
                        : 'bg-muted text-foreground hover:bg-purple-100 dark:hover:bg-purple-900'
                    }`}
                  >
                    All Subjects
                  </button>
                  {subjects.map((subject) => (
                    <button
                      key={subject._id}
                      onClick={() => handleSubjectFilter(subject._id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                        selectedSubject === subject._id
                          ? 'bg-purple-600 text-white'
                          : 'bg-muted text-foreground hover:bg-purple-100 dark:hover:bg-purple-900'
                      }`}
                    >
                      <span>{subject.icon}</span>
                      {subject.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Period Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Time Period
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handlePeriodFilter('all')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedPeriod === 'all'
                        ? 'bg-purple-600 text-white'
                        : 'bg-muted text-foreground hover:bg-purple-100 dark:hover:bg-purple-900'
                    }`}
                  >
                    All Time
                  </button>
                  <button
                    onClick={() => handlePeriodFilter('weekly')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedPeriod === 'weekly'
                        ? 'bg-purple-600 text-white'
                        : 'bg-muted text-foreground hover:bg-purple-100 dark:hover:bg-purple-900'
                    }`}
                  >
                    This Week
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-6 h-6 text-blue-600" />}
            title="Total Students"
            value={leaderboard.length}
            className="bg-blue-50 dark:bg-blue-900/20"
          />
          <StatCard
            icon={<Target className="w-6 h-6 text-green-600" />}
            title="Your Rank"
            value={userPosition > 0 ? `#${userPosition}` : 'N/A'}
            className="bg-green-50 dark:bg-green-900/20"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
            title="Top Score"
            value={leaderboard[0]?.totalScore || 0}
            className="bg-purple-50 dark:bg-purple-900/20"
          />
          <StatCard
            icon={<Clock className="w-6 h-6 text-orange-600" />}
            title="Period"
            value={selectedPeriod === 'all' ? 'All Time' : 'This Week'}
            className="bg-orange-50 dark:bg-orange-900/20"
          />
        </div>

        {/* Podium for Top 3 */}
        {topThree.length >= 3 && (
          <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
              🏆 Top Performers
            </h2>
            <div className="flex justify-center items-end gap-4 max-w-md mx-auto">
              {/* 2nd Place */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                    {topThree[1]?.name?.charAt(0).toUpperCase()}
                  </div>
                  <Medal className="absolute -top-2 -right-2 w-6 h-6 text-gray-400" />
                </div>
                <div className="bg-gray-200 dark:bg-gray-600 px-3 py-2 rounded-lg">
                  <div className="text-sm font-medium text-foreground truncate max-w-20">
                    {topThree[1]?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {topThree[1]?.totalScore} pts
                  </div>
                </div>
              </div>

              {/* 1st Place */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">
                    {topThree[0]?.name?.charAt(0).toUpperCase()}
                  </div>
                  <Trophy className="absolute -top-3 -right-3 w-8 h-8 text-yellow-500" />
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-900/30 px-3 py-2 rounded-lg">
                  <div className="text-sm font-medium text-foreground truncate max-w-20">
                    {topThree[0]?.name}
                  </div>
                  <div className="text-xs text-yellow-700 dark:text-yellow-400">
                    {topThree[0]?.totalScore} pts
                  </div>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                    {topThree[2]?.name?.charAt(0).toUpperCase()}
                  </div>
                  <Award className="absolute -top-2 -right-2 w-6 h-6 text-amber-600" />
                </div>
                <div className="bg-amber-100 dark:bg-amber-900/30 px-3 py-2 rounded-lg">
                  <div className="text-sm font-medium text-foreground truncate max-w-20">
                    {topThree[2]?.name}
                  </div>
                  <div className="text-xs text-amber-700 dark:text-amber-400">
                    {topThree[2]?.totalScore} pts
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Your Position Highlight */}
        {userPosition > 0 && userPosition > 10 && (
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mb-6 border border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-foreground">Your Position</div>
                  <div className="text-sm text-muted-foreground">
                    Rank #{userPosition} - {leaderboard[userPosition - 1]?.totalScore || 0} points
                  </div>
                </div>
              </div>
              <BadgeChip
                text={`#${userPosition}`}
                variant="purple"
              />
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">
              Rankings
              {selectedSubject !== 'all' && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  • {subjects.find(s => s._id === selectedSubject)?.name}
                </span>
              )}
              {selectedPeriod !== 'all' && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  • {selectedPeriod === 'weekly' ? 'This Week' : selectedPeriod}
                </span>
              )}
            </h2>
          </div>

          {isLoading ? (
            <div className="p-8">
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4">
                    <div className="w-8 h-8 bg-muted rounded animate-pulse" />
                    <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
                    <div className="flex-1">
                      <div className="w-32 h-4 bg-muted rounded animate-pulse mb-2" />
                      <div className="w-24 h-3 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="w-16 h-4 bg-muted rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ) : leaderboard.length > 0 ? (
            <LeaderboardTable 
              data={leaderboard} 
              currentUserId={user?.id}
            />
          ) : (
            <div className="p-12 text-center">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No rankings yet
              </h3>
              <p className="text-muted-foreground">
                Be the first to take a quiz and appear on the leaderboard!
              </p>
            </div>
          )}
        </div>

        {/* Achievement Info */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
          <div className="flex items-start gap-4">
            <Trophy className="w-8 h-8 text-purple-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                How Rankings Work
              </h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Rankings are based on your total score across all quizzes</p>
                <p>• Higher difficulty quizzes contribute more to your score</p>
                <p>• Maintain your streak to earn bonus points</p>
                <p>• Earn badges to boost your profile visibility</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;


