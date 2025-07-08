import React, { useState } from 'react';
import { Plus, Search, Flame, Clock, Trash2, Utensils, Brain, Zap, Target } from 'lucide-react';
import { FoodEntry } from '../types';
import { foodDatabase } from '../data/foodDatabase';
import { format } from 'date-fns';

interface FoodLogProps {
  foodEntries: FoodEntry[];
  onAddFood: (food: FoodEntry) => void;
  onDeleteFood: (id: string) => void;
}

const FoodLog: React.FC<FoodLogProps> = ({ foodEntries, onAddFood, onDeleteFood }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [serving, setServing] = useState('1');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');

  // AI-driven insights based on current time and meal patterns
  const getCurrentMealSuggestion = () => {
    const hour = new Date().getHours();
    if (hour < 10) return 'breakfast';
    if (hour < 14) return 'lunch';
    if (hour < 18) return 'dinner';
    return 'snack';
  };

  const getAIInsights = () => {
    const todayEntries = foodEntries.filter(entry => 
      format(new Date(entry.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    );
    
    const totalCalories = todayEntries.reduce((sum, entry) => sum + entry.calories, 0);
    const totalProtein = todayEntries.reduce((sum, entry) => sum + entry.protein, 0);
    const mealCounts = {
      breakfast: todayEntries.filter(e => e.mealType === 'breakfast').length,
      lunch: todayEntries.filter(e => e.mealType === 'lunch').length,
      dinner: todayEntries.filter(e => e.mealType === 'dinner').length,
      snack: todayEntries.filter(e => e.mealType === 'snack').length,
    };

    const insights = [];
    
    if (totalCalories < 800) {
      insights.push({
        type: 'energy',
        icon: Zap,
        message: 'Your calorie intake is low today. Consider adding nutrient-dense foods.',
        color: 'text-warning-600 bg-warning-50 dark:bg-warning-900/20'
      });
    }
    
    if (totalProtein < 30) {
      insights.push({
        type: 'protein',
        icon: Target,
        message: 'Boost your protein intake with lean meats, eggs, or legumes.',
        color: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
      });
    }
    
    if (mealCounts.breakfast === 0 && new Date().getHours() > 9) {
      insights.push({
        type: 'breakfast',
        icon: Utensils,
        message: "Don't skip breakfast! It kickstarts your metabolism.",
        color: 'text-secondary-600 bg-secondary-50 dark:bg-secondary-900/20'
      });
    }

    return insights;
  };

  const getSmartFoodSuggestions = () => {
    const currentMeal = getCurrentMealSuggestion();
    const todayEntries = foodEntries.filter(entry => 
      format(new Date(entry.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    );
    
    const totalCalories = todayEntries.reduce((sum, entry) => sum + entry.calories, 0);
    
    // Smart suggestions based on meal time and current intake
    let suggestions = [];
    
    if (currentMeal === 'breakfast') {
      suggestions = foodDatabase.filter(food => 
        ['Protein', 'Fruits', 'Carbs'].includes(food.category)
      ).slice(0, 6);
    } else if (currentMeal === 'lunch') {
      suggestions = foodDatabase.filter(food => 
        ['Protein', 'Vegetables', 'Carbs'].includes(food.category)
      ).slice(0, 6);
    } else if (currentMeal === 'dinner') {
      suggestions = foodDatabase.filter(food => 
        ['Protein', 'Vegetables'].includes(food.category)
      ).slice(0, 6);
    } else {
      suggestions = foodDatabase.filter(food => 
        ['Fruits', 'Nuts'].includes(food.category)
      ).slice(0, 6);
    }
    
    return suggestions;
  };

  const filteredFoods = searchTerm
    ? foodDatabase.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : getSmartFoodSuggestions();

  const handleAddFood = () => {
    if (!selectedFood) return;

    const servingMultiplier = parseFloat(serving) || 1;
    const newFood: FoodEntry = {
      id: Date.now().toString(),
      name: selectedFood.name,
      calories: Math.round(selectedFood.calories * servingMultiplier),
      protein: Math.round(selectedFood.protein * servingMultiplier * 10) / 10,
      carbs: Math.round(selectedFood.carbs * servingMultiplier * 10) / 10,
      fat: Math.round(selectedFood.fat * servingMultiplier * 10) / 10,
      fiber: Math.round(selectedFood.fiber * servingMultiplier * 10) / 10,
      serving: `${serving} ${selectedFood.serving}`,
      date: new Date(),
      mealType,
    };

    onAddFood(newFood);
    setShowAddForm(false);
    setSelectedFood(null);
    setServing('1');
    setSearchTerm('');
  };

  const todayFoodEntries = foodEntries.filter(entry => 
    format(new Date(entry.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const totalCalories = todayFoodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalProtein = todayFoodEntries.reduce((sum, entry) => sum + entry.protein, 0);
  const totalCarbs = todayFoodEntries.reduce((sum, entry) => sum + entry.carbs, 0);
  const totalFat = todayFoodEntries.reduce((sum, entry) => sum + entry.fat, 0);

  const getMealTypeColor = (type: string) => {
    const colors = {
      breakfast: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      lunch: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      dinner: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      snack: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
    };
    return colors[type as keyof typeof colors] || colors.snack;
  };

  const aiInsights = getAIInsights();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Food Log</h1>
          <p className="text-gray-500 dark:text-gray-400">Track your nutrition with AI insights</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setMealType(getCurrentMealSuggestion() as any);
          }}
          className="flex items-center space-x-2 bg-accent-600 text-white px-4 py-2 rounded-lg hover:bg-accent-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Food</span>
        </button>
      </div>

      {/* AI Insights */}
      {aiInsights.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900 dark:text-purple-100">AI Nutrition Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {aiInsights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${insight.color}`}>
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium">{insight.message}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Nutrition Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-accent-500 to-accent-600 text-white rounded-xl p-4">
          <div className="text-2xl font-bold">{totalCalories}</div>
          <div className="text-accent-100 text-sm">Calories</div>
        </div>
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-xl p-4">
          <div className="text-2xl font-bold">{totalProtein.toFixed(1)}g</div>
          <div className="text-primary-100 text-sm">Protein</div>
        </div>
        <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 text-white rounded-xl p-4">
          <div className="text-2xl font-bold">{totalCarbs.toFixed(1)}g</div>
          <div className="text-secondary-100 text-sm">Carbs</div>
        </div>
        <div className="bg-gradient-to-br from-warning-500 to-warning-600 text-white rounded-xl p-4">
          <div className="text-2xl font-bold">{totalFat.toFixed(1)}g</div>
          <div className="text-warning-100 text-sm">Fat</div>
        </div>
      </div>

      {/* Food Entries */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Meals</h2>
        </div>
        <div className="p-6">
          {todayFoodEntries.length > 0 ? (
            <div className="space-y-4">
              {todayFoodEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/20 rounded-full flex items-center justify-center">
                      <Utensils className="h-6 w-6 text-accent-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{entry.name}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMealTypeColor(entry.mealType || 'snack')}`}>
                          {entry.mealType}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {entry.serving}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-semibold text-accent-600">{entry.calories} cal</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        P: {entry.protein}g • C: {entry.carbs}g • F: {entry.fat}g
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteFood(entry.id)}
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
              <Utensils className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No meals logged today</h3>
              <p className="text-gray-500 dark:text-gray-400">Start tracking your nutrition by adding your first meal</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Food Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Food</h3>
                <div className="flex items-center space-x-2 text-sm text-purple-600 dark:text-purple-400">
                  <Brain className="h-4 w-4" />
                  <span>AI Powered</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Meal Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Meal Type
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setMealType(type)}
                      className={`p-3 rounded-lg border text-sm font-medium capitalize transition-colors ${
                        mealType === type
                          ? 'border-accent-500 bg-accent-50 text-accent-700 dark:bg-accent-900/20 dark:text-accent-300'
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Food
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Search for food items..."
                  />
                </div>
              </div>

              {/* Smart Suggestions */}
              {!searchTerm && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Brain className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                      Smart Suggestions for {mealType}
                    </span>
                  </div>
                </div>
              )}

              {/* Food Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {filteredFoods.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => setSelectedFood(food)}
                    className={`p-4 rounded-lg border text-left transition-all hover:shadow-md ${
                      selectedFood?.id === food.id
                        ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-accent-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{food.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {food.calories} cal • {food.serving}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                    </div>
                  </button>
                ))}
              </div>

              {/* Serving Size */}
              {selectedFood && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Serving Size
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={serving}
                      onChange={(e) => setServing(e.target.value)}
                      className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 dark:bg-gray-700 dark:text-white"
                    />
                    <span className="text-gray-500 dark:text-gray-400">× {selectedFood.serving}</span>
                  </div>
                  
                  {/* Nutrition Preview */}
                  <div className="mt-4 p-4 bg-accent-50 dark:bg-accent-900/20 rounded-lg">
                    <h5 className="font-medium text-accent-900 dark:text-accent-100 mb-2">Nutrition Preview</h5>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-semibold text-accent-600">{Math.round(selectedFood.calories * parseFloat(serving || '1'))}</div>
                        <div className="text-gray-500 dark:text-gray-400">Calories</div>
                      </div>
                      <div>
                        <div className="font-semibold text-primary-600">{(selectedFood.protein * parseFloat(serving || '1')).toFixed(1)}g</div>
                        <div className="text-gray-500 dark:text-gray-400">Protein</div>
                      </div>
                      <div>
                        <div className="font-semibold text-secondary-600">{(selectedFood.carbs * parseFloat(serving || '1')).toFixed(1)}g</div>
                        <div className="text-gray-500 dark:text-gray-400">Carbs</div>
                      </div>
                      <div>
                        <div className="font-semibold text-warning-600">{(selectedFood.fat * parseFloat(serving || '1')).toFixed(1)}g</div>
                        <div className="text-gray-500 dark:text-gray-400">Fat</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedFood(null);
                  setServing('1');
                  setSearchTerm('');
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFood}
                disabled={!selectedFood}
                className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Food
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodLog;