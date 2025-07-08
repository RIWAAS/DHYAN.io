import React, { useState } from 'react';
import { Plus, Clock, Flame, Dumbbell, Trash2 } from 'lucide-react';
import { WorkoutEntry } from '../types';
import { exerciseDatabase } from '../data/exerciseDatabase';
import { format } from 'date-fns';

interface WorkoutLogProps {
  workoutEntries: WorkoutEntry[];
  onAddWorkout: (workout: WorkoutEntry) => void;
  onDeleteWorkout: (id: string) => void;
}

const WorkoutLog: React.FC<WorkoutLogProps> = ({ workoutEntries, onAddWorkout, onDeleteWorkout }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [duration, setDuration] = useState(30);
  const [workoutType, setWorkoutType] = useState<'cardio' | 'strength' | 'flexibility' | 'sports'>('cardio');

  const handleAddWorkout = () => {
    if (!selectedExercise) return;

    const exercise = exerciseDatabase.find(ex => ex.id === selectedExercise);
    if (!exercise) return;

    const newWorkout: WorkoutEntry = {
      id: Date.now().toString(),
      name: exercise.name,
      type: exercise.category,
      duration,
      caloriesBurned: Math.round(exercise.caloriesPerMinute * duration),
      date: new Date(),
    };

    onAddWorkout(newWorkout);
    setShowAddForm(false);
    setSelectedExercise('');
    setDuration(30);
  };

  const todayWorkouts = workoutEntries.filter(entry => 
    format(new Date(entry.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const totalDuration = todayWorkouts.reduce((sum, entry) => sum + entry.duration, 0);
  const totalCaloriesBurned = todayWorkouts.reduce((sum, entry) => sum + entry.caloriesBurned, 0);

  const filteredExercises = exerciseDatabase.filter(exercise => 
    workoutType === 'cardio' ? true : exercise.category === workoutType
  );

  const getTypeColor = (type: string) => {
    const colors = {
      cardio: 'bg-error-100 text-error-800 dark:bg-error-900/20 dark:text-error-300',
      strength: 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300',
      flexibility: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/20 dark:text-secondary-300',
      sports: 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300',
    };
    return colors[type as keyof typeof colors] || colors.cardio;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workout Log</h1>
          <p className="text-gray-500 dark:text-gray-400">Track your training sessions</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Workout</span>
        </button>
      </div>

      {/* Workout Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{todayWorkouts.length}</div>
              <div className="text-secondary-100">Workouts Today</div>
            </div>
            <Dumbbell className="h-10 w-10 text-secondary-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{totalDuration}</div>
              <div className="text-primary-100">Minutes</div>
            </div>
            <Clock className="h-10 w-10 text-primary-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-accent-500 to-accent-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{totalCaloriesBurned}</div>
              <div className="text-accent-100">Calories Burned</div>
            </div>
            <Flame className="h-10 w-10 text-accent-200" />
          </div>
        </div>
      </div>

      {/* Workout Entries */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Workouts</h2>
        </div>
        <div className="p-6">
          {todayWorkouts.length > 0 ? (
            <div className="space-y-4">
              {todayWorkouts.map((workout) => (
                <div key={workout.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/20 rounded-full flex items-center justify-center">
                      <Dumbbell className="h-6 w-6 text-secondary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{workout.name}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(workout.type)}`}>
                          {workout.type}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {workout.duration} min
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-semibold text-accent-600">{workout.caloriesBurned} cal</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(workout.date), 'HH:mm')}
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteWorkout(workout.id)}
                      className="p-2 text-gray-400 hover:text-error-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Dumbbell className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No workouts logged today</h3>
              <p className="text-gray-500 dark:text-gray-400">Start tracking your fitness journey by logging your first workout</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Workout Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Workout</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Workout Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['cardio', 'strength', 'flexibility', 'sports'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setWorkoutType(type)}
                      className={`p-3 rounded-lg border text-sm font-medium capitalize transition-colors ${
                        workoutType === type
                          ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Exercise
                </label>
                <select
                  value={selectedExercise}
                  onChange={(e) => setSelectedExercise(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select an exercise</option>
                  {filteredExercises.map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.name} ({exercise.caloriesPerMinute} cal/min)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {selectedExercise && (
                <div className="bg-secondary-50 dark:bg-secondary-900/20 rounded-lg p-4">
                  <h5 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">Estimated Calories Burned</h5>
                  <div className="text-2xl font-bold text-secondary-600">
                    {Math.round((exerciseDatabase.find(ex => ex.id === selectedExercise)?.caloriesPerMinute || 0) * duration)} cal
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedExercise('');
                  setDuration(30);
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddWorkout}
                disabled={!selectedExercise}
                className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Workout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutLog;