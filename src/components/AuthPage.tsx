import React, { useState } from 'react';
import {
  Activity,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Dumbbell,
  Target,
  TrendingUp,
} from 'lucide-react';

interface AuthPageProps {
  onSignIn: (userData: { name: string; email: string }) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onSignIn }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSignIn({
        name: formData.name || formData.email.split('@')[0],
        email: formData.email,
      });
    }
  };

  const features = [
    {
      icon: Target,
      title: 'Track Goals',
      description: 'Set and achieve your fitness targets',
    },
    {
      icon: Dumbbell,
      title: 'Log Workouts',
      description: 'Record every exercise and rep',
    },
    {
      icon: TrendingUp,
      title: 'Monitor Progress',
      description: 'Visualize your fitness journey',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* AI Animated Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="https://cdn.pixabay.com/video/2023/04/15/158094-820264526_large.mp4"
            type="video/mp4"
          />
          {/* Fallback video sources */}
          <source
            src="https://www.pexels.com/video/getting-fit-855828/"
            type="video/mp4"
          />
          <source
            src="https://www.pexels.com/video/a-man-lifting-weights-in-a-fitness-gym-3196220/"
            type="video/mp4"
          />
        </video>

        {/* Dynamic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/40 via-transparent to-secondary-900/40"></div>

        {/* Animated Mesh Gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500/20 via-secondary-500/20 to-accent-500/20 animate-pulse-custom"></div>
          <div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-tl from-accent-500/15 via-primary-500/15 to-secondary-500/15 animate-pulse-custom"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        {/* Particle Effect Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute w-2 h-2 bg-white rounded-full animate-ping"
            style={{ top: '20%', left: '10%', animationDelay: '0s' }}
          ></div>
          <div
            className="absolute w-1 h-1 bg-primary-400 rounded-full animate-ping"
            style={{ top: '60%', left: '80%', animationDelay: '2s' }}
          ></div>
          <div
            className="absolute w-1.5 h-1.5 bg-secondary-400 rounded-full animate-ping"
            style={{ top: '80%', left: '20%', animationDelay: '4s' }}
          ></div>
          <div
            className="absolute w-1 h-1 bg-accent-400 rounded-full animate-ping"
            style={{ top: '30%', left: '70%', animationDelay: '6s' }}
          ></div>
          <div
            className="absolute w-2 h-2 bg-white/50 rounded-full animate-ping"
            style={{ top: '50%', left: '30%', animationDelay: '8s' }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-16">
          <div className="max-w-lg">
            {/* Logo with Glow Effect */}
            <div className="flex items-center space-x-3 mb-8">
              <img 
                src="/DHYAN (2).png" 
                alt="DHYAN Logo" 
                className="h-12 w-12 object-contain drop-shadow-2xl filter brightness-110"
              />
              <span className="text-4xl font-bold bg-gradient-to-r from-white via-primary-200 to-secondary-200 bg-clip-text text-transparent drop-shadow-2xl">
                DHYAN
              </span>
            </div>

            {/* Animated Tagline */}
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              Transform Your
              <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent animate-pulse-custom">
                {' '}
                Fitness Journey
              </span>
            </h1>

            <p className="text-xl text-gray-200 mb-12 leading-relaxed drop-shadow-lg">
              Being more "ALIVE" WITH DHYAN
            </p>

            {/* Enhanced Features with Animations */}
            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="flex items-center space-x-4 animate-slide-up group hover:transform hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 group-hover:bg-white/20 transition-all duration-300 shadow-lg">
                      <Icon className="h-6 w-6 text-primary-400 group-hover:text-primary-300 transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg group-hover:text-primary-200 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Motivational Quote */}
            <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <blockquote className="text-lg italic text-gray-200 mb-2">
                "The body achieves what the mind believes."
              </blockquote>
              <cite className="text-sm text-primary-300">— Napoleon Hill</cite>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
              <img 
                src="/DHYAN (2).png" 
                alt="DHYAN Logo" 
                className="h-12 w-12 object-contain drop-shadow-2xl filter brightness-110"
              />
              <span className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                DHYAN
              </span>
            </div>

            {/* Enhanced Auth Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                  {isSignUp ? 'Join DHYAN' : 'Welcome Back'}
                </h2>
                <p className="text-gray-200">
                  {isSignUp
                    ? 'Start your AI-powered fitness transformation today'
                    : 'Continue your intelligent fitness journey'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Full Name
                    </label>
                    <div className="relative group">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-primary-400 transition-colors" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white/15 transition-all backdrop-blur-sm"
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-primary-400 transition-colors" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white/15 transition-all backdrop-blur-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-primary-400 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white/15 transition-all backdrop-blur-sm"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-primary-400 transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white/15 transition-all backdrop-blur-sm"
                        placeholder="Confirm your password"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-200">
                  {isSignUp
                    ? 'Already have an account?'
                    : "Don't have an account?"}
                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setErrors({});
                      setFormData({
                        name: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                      });
                    }}
                    className="ml-2 text-primary-400 hover:text-primary-300 font-semibold transition-colors"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>

              {/* Enhanced Demo Account */}
              <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                <p className="text-sm text-gray-300 text-center mb-2">
                  🚀 Quick Demo Access
                </p>
                <button
                  onClick={() =>
                    onSignIn({ name: 'Demo User', email: 'demo@dhyan.app' })
                  }
                  className="w-full text-sm text-primary-400 hover:text-primary-300 transition-colors font-medium"
                >
                  Continue as Demo User
                </button>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-gray-300 text-sm mt-8">
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary-500/30 rounded-full blur-xl animate-pulse-custom"></div>
      <div
        className="absolute bottom-20 right-10 w-32 h-32 bg-secondary-500/30 rounded-full blur-xl animate-pulse-custom"
        style={{ animationDelay: '1s' }}
      ></div>
      <div
        className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent-500/30 rounded-full blur-xl animate-pulse-custom"
        style={{ animationDelay: '2s' }}
      ></div>
      <div
        className="absolute top-1/3 right-1/3 w-24 h-24 bg-primary-400/20 rounded-full blur-xl animate-pulse-custom"
        style={{ animationDelay: '3s' }}
      ></div>
      <div
        className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-secondary-400/25 rounded-full blur-xl animate-pulse-custom"
        style={{ animationDelay: '4s' }}
      ></div>
    </div>
  );
};

export default AuthPage;
