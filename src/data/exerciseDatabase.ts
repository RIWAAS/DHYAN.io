export interface ExerciseTemplate {
  id: string;
  name: string;
  category: 'cardio' | 'strength' | 'flexibility' | 'sports';
  caloriesPerMinute: number;
  description: string;
  muscleGroups?: string[];
}

export const exerciseDatabase: ExerciseTemplate[] = [
  // Cardio
  { id: '1', name: 'Running', category: 'cardio', caloriesPerMinute: 12, description: 'Outdoor or treadmill running' },
  { id: '2', name: 'Cycling', category: 'cardio', caloriesPerMinute: 8, description: 'Stationary or outdoor cycling' },
  { id: '3', name: 'Swimming', category: 'cardio', caloriesPerMinute: 11, description: 'Freestyle swimming' },
  { id: '4', name: 'Jump Rope', category: 'cardio', caloriesPerMinute: 13, description: 'High-intensity jump rope' },
  { id: '5', name: 'Elliptical', category: 'cardio', caloriesPerMinute: 9, description: 'Elliptical machine workout' },
  
  // Strength Training
  { id: '6', name: 'Push-ups', category: 'strength', caloriesPerMinute: 7, description: 'Bodyweight push-ups', muscleGroups: ['Chest', 'Triceps', 'Shoulders'] },
  { id: '7', name: 'Squats', category: 'strength', caloriesPerMinute: 8, description: 'Bodyweight or weighted squats', muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'] },
  { id: '8', name: 'Deadlifts', category: 'strength', caloriesPerMinute: 6, description: 'Barbell or dumbbell deadlifts', muscleGroups: ['Hamstrings', 'Glutes', 'Back'] },
  { id: '9', name: 'Bench Press', category: 'strength', caloriesPerMinute: 6, description: 'Barbell or dumbbell bench press', muscleGroups: ['Chest', 'Triceps', 'Shoulders'] },
  { id: '10', name: 'Pull-ups', category: 'strength', caloriesPerMinute: 8, description: 'Bodyweight pull-ups', muscleGroups: ['Back', 'Biceps'] },
  
  // Flexibility
  { id: '11', name: 'Yoga', category: 'flexibility', caloriesPerMinute: 3, description: 'Hatha or vinyasa yoga' },
  { id: '12', name: 'Stretching', category: 'flexibility', caloriesPerMinute: 2, description: 'Static stretching routine' },
  { id: '13', name: 'Pilates', category: 'flexibility', caloriesPerMinute: 4, description: 'Core-focused pilates workout' },
  
  // Sports
  { id: '14', name: 'Basketball', category: 'sports', caloriesPerMinute: 10, description: 'Recreational basketball' },
  { id: '15', name: 'Tennis', category: 'sports', caloriesPerMinute: 9, description: 'Singles or doubles tennis' },
  { id: '16', name: 'Soccer', category: 'sports', caloriesPerMinute: 11, description: 'Recreational soccer' },
];