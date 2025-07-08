import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, TrendingUp, Target, Award } from 'lucide-react';
import { FoodEntry, WorkoutEntry, WeightEntry } from '../types';
import { format, subDays, startOfDay } from 'date-fns';

interface ProgressProps {
  foodEntries: FoodEntry[];
  workoutEntries: WorkoutEntry[];
  weightEntries: WeightEntry[];
  onAddWeight: (weight: WeightEntry) => void;
}

const Progress: React.FC<ProgressProps> = ({ foodEntries, workoutEntries, weightEntries, onAddWeight }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [newWeight, setNewWeight] = useState('');

  const periods = selectedPeriod === 'week' ? 7 : 30;
  const startDate = subDays(new Date(), periods - 1);

  // Generate chart data
  const chartData = Array.from({ length: periods }, (_, i) => {
    const date = subDays(new Date(), periods - 1 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const dayFoodEntries = foodEntries.filter(entry => 
      format(new Date(entry.date), 'yyyy-MM-dd') === dateStr
    );
    const dayWorkoutEntries = workoutEntries.filter(entry => 
      format(new Date(entry.date), 'yyyy-MM-dd') === dateStr
    );
    const dayWeightEntry = weightEntries.find(entry => 
      format(new Date(entry.date), 'yyyy-MM-dd') === dateStr
    );

    const caloriesConsumed = dayFoodEntries.reduce((sum, entry) => sum + entry.calories, 0);
    const caloriesBurned = dayWorkoutEntries.reduce((sum, entry) => sum + entry.caloriesBurned, 0);

    return {
      date: format(date, selectedPeriod === 'week' ? 'MMM dd' : 'MM/dd'),
      caloriesConsumed,
      caloriesBurned,
      netCalories: caloriesConsumed - caloriesBurned,
      workouts: dayWorkoutEntries.length,
      weight: dayWeightEntry?.weight || null,
    };
  });

  const handleAddWeight = () => {
    if (!newWeight || parseFloat(newWeight) <= 0) return;

    const weightEntry: WeightEntry = {
      id: Date.now().toString(),
      weight: parseFloat(newWeight),
      date: new Date(),
    };

    onAddWeight(weightEntry);
    setShowAddWeight(false);
    setNewWeight('');
  };

  const latestWeight = weightEntries.length > 0 ? weightEntries[weightEntries.length - 1].weight : null;
  const previousWeight = weightEntries.length > 1 ? weightEntries[weightEntries.length - 2].weight : null;
  const weightChange = latestWeight && previousWeight ? latestWeight - previousWeight : null;

  const totalWorkouts = workoutEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= startDate;
  }).length;

  const avgCaloriesConsumed = Math.round(
    chartData.reduce((sum, day) => sum + day.caloriesConsumed, 0) / periods
  );

  const avgCaloriesBurned = Math.round(
    chartData.reduce((sum, day) => sum + day.caloriesBurned, 0) / periods
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Progress</h1>
          <p className="text-gray-500 dark:text-gray-400">Track your fitness journey</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === 'week'
                  ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === 'month'
                  ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Current Weight</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {latestWeight ? `${latestWeight} kg` : 'N/A'}
              </p>
              {weightChange && (
                <p className={`text-sm flex items-center mt-1 ${
                  weightChange > 0 ? 'text-accent-600' : 'text-secondary-600'
                }`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                </p>
              )}
            </div>
            <button
              onClick={() => setShowAddWeight(true)}
              className="p-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
            >
              <Target className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Workouts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalWorkouts}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last {periods} days</p>
            </div>
            <div className="p-2 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg">
              <Award className="h-5 w-5 text-secondary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Calories/Day</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgCaloriesConsumed}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Consumed</p>
            </div>
            <div className="p-2 bg-accent-50 dark:bg-accent-900/20 rounded-lg">
              <Calendar className="h-5 w-5 text-accent-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Burned/Day</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgCaloriesBurned}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Calories</p>
            </div>
            <div className="p-2 bg-error-50 dark:bg-error-900/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-error-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calorie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Calorie Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="caloriesConsumed" 
                stroke="#F97316" 
                strokeWidth={2}
                name="Consumed"
                dot={{ fill: '#F97316', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="caloriesBurned" 
                stroke="#22C55E" 
                strokeWidth={2}
                name="Burned"
                dot={{ fill: '#22C55E', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Workout Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Workout Frequency</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Bar 
                dataKey="workouts" 
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]}
                name="Workouts"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weight Chart */}
      {weightEntries.length > 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weight Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.filter(d => d.weight !== null)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                name="Weight (kg)"
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Add Weight Modal */}
      {showAddWeight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Log Weight</h3>
            </div>
            
            <div className="p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your weight"
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddWeight(false);
                  setNewWeight('');
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddWeight}
                disabled={!newWeight || parseFloat(newWeight) <= 0}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Log Weight
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;