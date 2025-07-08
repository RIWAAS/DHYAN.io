export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  goals: {
    targetWeight: number;
    dailyCalories: number;
    weeklyWorkouts: number;
  };
  createdAt: Date;
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  serving: string;
  date: Date;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  ingredients?: string;
  dietaryTags?: string[];
  preparationNotes?: string;
  
  // Enhanced wellness tracking
  moodRating?: number; // 1-5 scale
  hungerLevel?: number; // 1-5 scale
  satisfactionLevel?: number; // 1-5 scale
  eatingLocation?: string;
  eatingCompany?: string;
  cravings?: string;
  waterIntake?: number; // in liters
  exerciseBeforeMeal?: boolean;
  supplements?: string;
  allergicReactions?: string;
  mealPhoto?: string; // URL or base64
}

export interface WorkoutEntry {
  id: string;
  name: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'sports';
  duration: number;
  caloriesBurned: number;
  exercises?: Exercise[];
  date: Date;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

export interface DailyStats {
  date: Date;
  caloriesConsumed: number;
  caloriesBurned: number;
  workouts: number;
  weight?: number;
}

export interface WeightEntry {
  id: string;
  weight: number;
  date: Date;
}

export interface JournalEntry {
  id: string;
  date: Date;
  content: string;
  mood?: number;
  energy?: number;
  stress?: number;
  sleep?: number;
  tags?: string[];
}