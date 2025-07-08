import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import FoodLog from './components/FoodLog';
import WorkoutLog from './components/WorkoutLog';
import Progress from './components/Progress';
import Profile from './components/Profile';
import Dhyan from './components/Dhyan';
import AuthPage from './components/AuthPage';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDarkMode } from './hooks/useDarkMode';
import { User, FoodEntry, WorkoutEntry, WeightEntry } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDark, toggleDarkMode] = useDarkMode();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [user, setUser] = useLocalStorage<User | null>('dhyan-user', null);
  const [foodEntries, setFoodEntries] = useLocalStorage<FoodEntry[]>('dhyan-food-entries', []);
  const [workoutEntries, setWorkoutEntries] = useLocalStorage<WorkoutEntry[]>('dhyan-workout-entries', []);
  const [weightEntries, setWeightEntries] = useLocalStorage<WeightEntry[]>('dhyan-weight-entries', []);

  // Check if user is already authenticated on app load
  React.useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    }
  }, [user]);

  const handleSignIn = (userData: { name: string; email: string }) => {
    // Create a basic user profile if one doesn't exist
    if (!user) {
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        age: 25,
        weight: 70,
        height: 170,
        activityLevel: 'moderate',
        goals: {
          targetWeight: 65,
          dailyCalories: 2000,
          weeklyWorkouts: 5,
        },
        createdAt: new Date(),
      };
      setUser(newUser);
    }
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  const handleAddFood = (food: FoodEntry) => {
    setFoodEntries([...foodEntries, food]);
  };

  const handleDeleteFood = (id: string) => {
    setFoodEntries(foodEntries.filter(entry => entry.id !== id));
  };

  const handleAddWorkout = (workout: WorkoutEntry) => {
    setWorkoutEntries([...workoutEntries, workout]);
  };

  const handleDeleteWorkout = (id: string) => {
    setWorkoutEntries(workoutEntries.filter(entry => entry.id !== id));
  };

  const handleAddWeight = (weight: WeightEntry) => {
    setWeightEntries([...weightEntries, weight]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage onSignIn={handleSignIn} />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            user={user}
            foodEntries={foodEntries}
            workoutEntries={workoutEntries}
          />
        );
      case 'food':
        return (
          <FoodLog
            foodEntries={foodEntries}
            onAddFood={handleAddFood}
            onDeleteFood={handleDeleteFood}
          />
        );
      case 'workout':
        return (
          <WorkoutLog
            workoutEntries={workoutEntries}
            onAddWorkout={handleAddWorkout}
            onDeleteWorkout={handleDeleteWorkout}
          />
        );
      case 'progress':
        return (
          <Progress
            foodEntries={foodEntries}
            workoutEntries={workoutEntries}
            weightEntries={weightEntries}
            onAddWeight={handleAddWeight}
          />
        );
      case 'profile':
        return (
          <Profile
            user={user}
            onUpdateUser={handleUpdateUser}
          />
        );
      case 'dhyan':
        return (
          <Dhyan
            user={user}
          />
        );
      default:
        return <Dashboard user={user} foodEntries={foodEntries} workoutEntries={workoutEntries} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isDark={isDark}
        onToggleDarkMode={toggleDarkMode}
        onSignOut={handleSignOut}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveTab()}
      </main>
    </div>
  );
}

export default App;