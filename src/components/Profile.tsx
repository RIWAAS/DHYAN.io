import React, { useState } from 'react';
import { User as UserIcon, Target, Activity, Save, Edit } from 'lucide-react';
import { User } from '../types';
import { calculateBMR, calculateTDEE, calculateBMI, getBMICategory } from '../utils/calculations';

interface ProfileProps {
  user: User | null;
  onUpdateUser: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>(user || {});

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.age || !formData.weight || !formData.height) {
      return;
    }

    const updatedUser: User = {
      id: user?.id || Date.now().toString(),
      name: formData.name,
      email: formData.email,
      age: formData.age,
      weight: formData.weight,
      height: formData.height,
      activityLevel: formData.activityLevel || 'moderate',
      goals: {
        targetWeight: formData.goals?.targetWeight || formData.weight,
        dailyCalories: formData.goals?.dailyCalories || 2000,
        weeklyWorkouts: formData.goals?.weeklyWorkouts || 5,
      },
      createdAt: user?.createdAt || new Date(),
    };

    onUpdateUser(updatedUser);
    setIsEditing(false);
  };

  const bmr = user ? calculateBMR(user.weight, user.height, user.age, 'male') : 0;
  const tdee = user ? calculateTDEE(bmr, user.activityLevel) : 0;
  const bmi = user ? calculateBMI(user.weight, user.height) : 0;
  const bmiCategory = getBMICategory(bmi);

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise' },
    { value: 'light', label: 'Light', description: 'Light exercise 1-3 days/week' },
    { value: 'moderate', label: 'Moderate', description: 'Moderate exercise 3-5 days/week' },
    { value: 'active', label: 'Active', description: 'Hard exercise 6-7 days/week' },
    { value: 'very-active', label: 'Very Active', description: 'Very hard exercise, physical job' },
  ];

  if (!user && !isEditing) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center py-12">
          <UserIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Complete Your Profile</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Set up your profile to get personalized fitness recommendations
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your personal information and goals</p>
        </div>
        {user && !isEditing && (
          <button
            onClick={() => {
              setFormData(user);
              setIsEditing(true);
            }}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={formData.age || ''}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.1"
                    value={formData.weight || ''}
                    onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.height || ''}
                    onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 0 })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Activity Level
                </label>
                <select
                  value={formData.activityLevel || 'moderate'}
                  onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as any })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                >
                  {activityLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label} - {level.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Goals Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Fitness Goals</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Weight (kg)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  value={formData.goals?.targetWeight || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    goals: { 
                      ...formData.goals, 
                      targetWeight: parseFloat(e.target.value) || 0,
                      dailyCalories: formData.goals?.dailyCalories || 2000,
                      weeklyWorkouts: formData.goals?.weeklyWorkouts || 5
                    } 
                  })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Daily Calories
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.goals?.dailyCalories || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    goals: { 
                      ...formData.goals, 
                      dailyCalories: parseInt(e.target.value) || 0,
                      targetWeight: formData.goals?.targetWeight || 0,
                      weeklyWorkouts: formData.goals?.weeklyWorkouts || 5
                    } 
                  })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Weekly Workouts
                </label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={formData.goals?.weeklyWorkouts || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    goals: { 
                      ...formData.goals, 
                      weeklyWorkouts: parseInt(e.target.value) || 0,
                      targetWeight: formData.goals?.targetWeight || 0,
                      dailyCalories: formData.goals?.dailyCalories || 2000
                    } 
                  })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData(user || {});
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>

        {/* Stats Sidebar */}
        {user && (
          <div className="space-y-6">
            {/* Health Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Health Stats</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">BMI</span>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">{bmi.toFixed(1)}</div>
                    <div className={`text-xs ${
                      bmiCategory === 'Normal' ? 'text-secondary-600' : 
                      bmiCategory === 'Overweight' ? 'text-warning-600' : 'text-error-600'
                    }`}>
                      {bmiCategory}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">BMR</span>
                  <div className="font-semibold text-gray-900 dark:text-white">{Math.round(bmr)} cal</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">TDEE</span>
                  <div className="font-semibold text-gray-900 dark:text-white">{Math.round(tdee)} cal</div>
                </div>
              </div>
            </div>

            {/* Goal Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Goal Progress</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Weight Goal</span>
                    <span className="text-gray-900 dark:text-white">
                      {user.weight} kg / {user.goals.targetWeight} kg
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((user.weight / user.goals.targetWeight) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;