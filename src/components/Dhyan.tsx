import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Brain,
  Heart,
  Zap,
  Moon,
  Sun,
  Wind,
  Waves,
  Music,
  Timer,
  BookOpen,
  Smile,
  Frown,
  Meh,
  Calendar,
  TrendingUp,
  Headphones,
  Radio,
  Speaker
} from 'lucide-react';
import { User } from '../types';

interface DhyanProps {
  user: User | null;
}

interface MoodEntry {
  id: string;
  date: Date;
  mood: number; // 1-5 scale
  energy: number; // 1-5 scale
  stress: number; // 1-5 scale
  notes: string;
  sessionType?: string;
  sessionDuration?: number;
}

interface MeditationSession {
  id: string;
  name: string;
  duration: number;
  type: 'breathing' | 'mindfulness' | 'body-scan' | 'loving-kindness' | 'visualization';
  description: string;
  audioUrl?: string;
  instructions: string[];
  ambientMusic?: string;
  musicDescription?: string;
}

interface AmbientTrack {
  id: string;
  name: string;
  description: string;
  category: 'nature' | 'cosmic' | 'sacred' | 'healing' | 'mystical';
  duration: number;
  frequency?: string;
  benefits: string[];
  icon: string;
  color: string;
  audioUrl?: string;
}

const Dhyan: React.FC<DhyanProps> = ({ user }) => {
  const [activeView, setActiveView] = useState<'meditation' | 'music' | 'journal' | 'ambient'>('meditation');
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [selectedAmbientTrack, setSelectedAmbientTrack] = useState<AmbientTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [customDuration, setCustomDuration] = useState(10);
  
  // Journal states
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [currentMood, setCurrentMood] = useState(3);
  const [currentEnergy, setCurrentEnergy] = useState(3);
  const [currentStress, setCurrentStress] = useState(3);
  const [journalNotes, setJournalNotes] = useState('');
  const [showJournalForm, setShowJournalForm] = useState(false);

  // Musical Instruments
  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [compositions, setCompositions] = useState<any[]>([]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const ambientAudioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced Meditation sessions with ambient music
  const meditationSessions: MeditationSession[] = [
    {
      id: 'cosmic-awakening',
      name: '🌌 Cosmic Awakening',
      duration: 900, // 15 minutes
      type: 'visualization',
      description: 'Journey through the cosmos and awaken your infinite potential',
      ambientMusic: 'cosmic-frequencies',
      musicDescription: 'Deep space frequencies with celestial harmonics',
      instructions: [
        'Close your eyes and feel yourself floating in infinite space',
        'Visualize stars and galaxies swirling around you',
        'Feel the cosmic energy flowing through every cell',
        'Connect with the universal consciousness',
        'Embrace your role in the cosmic dance of existence'
      ]
    },
    {
      id: 'sacred-fire',
      name: '🔥 Sacred Fire Meditation',
      duration: 720, // 12 minutes
      type: 'breathing',
      description: 'Ignite your inner flame and transform through sacred fire',
      ambientMusic: 'tibetan-bowls',
      musicDescription: 'Sacred Tibetan singing bowls with fire crackling',
      instructions: [
        'Visualize a sacred fire burning in your heart center',
        'With each breath, fan the flames of transformation',
        'Feel old patterns and limitations burning away',
        'Allow the sacred fire to purify your entire being',
        'Emerge renewed and empowered'
      ]
    },
    {
      id: 'crystal-healing',
      name: '💎 Crystal Healing Journey',
      duration: 1080, // 18 minutes
      type: 'body-scan',
      description: 'Align your chakras with the power of crystal frequencies',
      ambientMusic: 'crystal-bowls',
      musicDescription: 'Pure crystal singing bowls tuned to chakra frequencies',
      instructions: [
        'Imagine yourself in a crystal cave filled with healing light',
        'Feel each crystal resonating with different parts of your body',
        'Allow the crystal frequencies to align your energy centers',
        'Visualize rainbow light flowing through your chakras',
        'Absorb the healing vibrations into every cell'
      ]
    },
    {
      id: 'forest-spirit',
      name: '🌲 Forest Spirit Connection',
      duration: 600, // 10 minutes
      type: 'mindfulness',
      description: 'Connect with the ancient wisdom of the forest spirits',
      ambientMusic: 'forest-sounds',
      musicDescription: 'Mystical forest sounds with ethereal flute melodies',
      instructions: [
        'Find yourself in an ancient, mystical forest',
        'Feel the presence of wise forest spirits around you',
        'Listen to their ancient wisdom whispered in the wind',
        'Connect with the life force of every tree and plant',
        'Receive their blessing and protection'
      ]
    },
    {
      id: 'ocean-depths',
      name: '🌊 Ocean Depths Meditation',
      duration: 840, // 14 minutes
      type: 'breathing',
      description: 'Dive deep into the healing waters of consciousness',
      ambientMusic: 'ocean-waves',
      musicDescription: 'Deep ocean sounds with whale songs and gentle waves',
      instructions: [
        'Imagine yourself diving into the deepest ocean',
        'Feel the water supporting and healing you',
        'Descend into the depths of your consciousness',
        'Discover hidden treasures of wisdom within',
        'Surface renewed and cleansed'
      ]
    },
    {
      id: 'lunar-goddess',
      name: '🌙 Lunar Goddess Ritual',
      duration: 960, // 16 minutes
      type: 'loving-kindness',
      description: 'Embrace the divine feminine energy of the moon goddess',
      ambientMusic: 'moonlight-serenade',
      musicDescription: 'Ethereal harp melodies with soft lunar frequencies',
      instructions: [
        'Bathe in the silver light of the full moon',
        'Feel the goddess energy awakening within you',
        'Send love and healing to all beings',
        'Embrace your intuitive and nurturing nature',
        'Receive the moon goddess blessing'
      ]
    },
    {
      id: 'solar-power',
      name: '☀️ Solar Power Activation',
      duration: 480, // 8 minutes
      type: 'breathing',
      description: 'Activate your inner sun and radiate golden light',
      ambientMusic: 'solar-frequencies',
      musicDescription: 'Uplifting solar frequencies with golden light harmonics',
      instructions: [
        'Visualize a brilliant sun in your solar plexus',
        'Feel golden light radiating from your core',
        'Breathe in solar energy with each inhalation',
        'Expand your light to fill your entire being',
        'Shine your light out into the world'
      ]
    },
    {
      id: 'dragon-wisdom',
      name: '🐉 Dragon Wisdom Quest',
      duration: 1200, // 20 minutes
      type: 'visualization',
      description: 'Journey with ancient dragons to unlock hidden wisdom',
      ambientMusic: 'mystical-dragons',
      musicDescription: 'Epic orchestral sounds with dragon roars and mystical chimes',
      instructions: [
        'Call upon your dragon guide to appear',
        'Climb onto their back and soar through dimensions',
        'Visit ancient temples of wisdom',
        'Receive teachings from dragon elders',
        'Return with newfound power and knowledge'
      ]
    },
    {
      id: 'stargate-portal',
      name: '⭐ Stargate Portal Meditation',
      duration: 780, // 13 minutes
      type: 'visualization',
      description: 'Travel through cosmic portals to higher dimensions',
      ambientMusic: 'stargate-frequencies',
      musicDescription: 'Interdimensional frequencies with portal activation sounds',
      instructions: [
        'Visualize a shimmering stargate opening before you',
        'Step through into higher dimensional realms',
        'Meet your galactic guides and teachers',
        'Download cosmic codes and activations',
        'Return through the portal transformed'
      ]
    },
    {
      id: 'phoenix-rebirth',
      name: '🔥 Phoenix Rebirth Ceremony',
      duration: 900, // 15 minutes
      type: 'breathing',
      description: 'Rise from the ashes renewed and empowered',
      ambientMusic: 'phoenix-fire',
      musicDescription: 'Transformational fire sounds with rising phoenix melodies',
      instructions: [
        'Feel yourself as a phoenix ready for rebirth',
        'Allow the sacred fire to consume what no longer serves',
        'Surrender completely to the transformation',
        'Feel yourself rising from the ashes renewed',
        'Spread your magnificent wings and soar'
      ]
    },
    {
      id: 'unicorn-healing',
      name: '🦄 Unicorn Healing Garden',
      duration: 660, // 11 minutes
      type: 'body-scan',
      description: 'Receive healing in the magical unicorn sanctuary',
      ambientMusic: 'unicorn-magic',
      musicDescription: 'Magical harp and chimes with healing unicorn frequencies',
      instructions: [
        'Enter a magical garden where unicorns roam freely',
        'Allow a gentle unicorn to approach you',
        'Feel their horn touching your heart center',
        'Receive pure healing light throughout your body',
        'Thank the unicorn for their gift of healing'
      ]
    },
    {
      id: 'atlantis-temple',
      name: '🏛️ Atlantis Temple Initiation',
      duration: 1080, // 18 minutes
      type: 'mindfulness',
      description: 'Receive ancient Atlantean wisdom and healing',
      ambientMusic: 'atlantis-crystals',
      musicDescription: 'Underwater crystal harmonics with ancient Atlantean tones',
      instructions: [
        'Descend into the crystal temples of Atlantis',
        'Meet the high priests and priestesses',
        'Receive initiation into ancient mysteries',
        'Activate dormant DNA codes within you',
        'Carry this wisdom back to the surface world'
      ]
    }
  ];

  // Ambient Music Tracks
  const ambientTracks: AmbientTrack[] = [
    {
      id: 'cosmic-frequencies',
      name: 'Cosmic Frequencies',
      description: 'Deep space ambient sounds with celestial harmonics',
      category: 'cosmic',
      duration: 3600, // 1 hour
      frequency: '432 Hz',
      benefits: ['Cosmic connection', 'Expanded awareness', 'Universal love'],
      icon: '🌌',
      color: 'from-purple-600 to-indigo-600',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    },
    {
      id: 'tibetan-bowls',
      name: 'Sacred Tibetan Bowls',
      description: 'Traditional Tibetan singing bowls with fire crackling',
      category: 'sacred',
      duration: 2700, // 45 minutes
      frequency: '528 Hz',
      benefits: ['Deep relaxation', 'Chakra alignment', 'Spiritual awakening'],
      icon: '🎵',
      color: 'from-orange-600 to-red-600',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    },
    {
      id: 'crystal-bowls',
      name: 'Crystal Singing Bowls',
      description: 'Pure crystal bowls tuned to chakra frequencies',
      category: 'healing',
      duration: 3000, // 50 minutes
      frequency: '741 Hz',
      benefits: ['Chakra healing', 'Energy clearing', 'DNA activation'],
      icon: '💎',
      color: 'from-cyan-600 to-blue-600',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    },
    {
      id: 'forest-sounds',
      name: 'Mystical Forest',
      description: 'Enchanted forest sounds with ethereal flute melodies',
      category: 'nature',
      duration: 2400, // 40 minutes
      frequency: 'Natural',
      benefits: ['Grounding', 'Nature connection', 'Peace'],
      icon: '🌲',
      color: 'from-green-600 to-emerald-600',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    },
    {
      id: 'ocean-waves',
      name: 'Deep Ocean Meditation',
      description: 'Ocean depths with whale songs and healing frequencies',
      category: 'nature',
      duration: 3300, // 55 minutes
      frequency: '396 Hz',
      benefits: ['Emotional healing', 'Flow state', 'Cleansing'],
      icon: '🌊',
      color: 'from-blue-600 to-teal-600',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    },
    {
      id: 'moonlight-serenade',
      name: 'Moonlight Serenade',
      description: 'Ethereal harp melodies with lunar frequencies',
      category: 'mystical',
      duration: 2880, // 48 minutes
      frequency: '852 Hz',
      benefits: ['Intuition', 'Divine feminine', 'Dreams'],
      icon: '🌙',
      color: 'from-purple-600 to-pink-600',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    },
    {
      id: 'solar-frequencies',
      name: 'Solar Activation',
      description: 'Uplifting solar frequencies with golden harmonics',
      category: 'healing',
      duration: 1800, // 30 minutes
      frequency: '963 Hz',
      benefits: ['Vitality', 'Confidence', 'Life force'],
      icon: '☀️',
      color: 'from-yellow-600 to-orange-600',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    },
    {
      id: 'mystical-dragons',
      name: 'Dragon Realm',
      description: 'Epic orchestral with dragon energies and mystical chimes',
      category: 'mystical',
      duration: 3600, // 1 hour
      frequency: '40 Hz',
      benefits: ['Power', 'Wisdom', 'Transformation'],
      icon: '🐉',
      color: 'from-red-600 to-purple-600',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    },
    {
      id: 'stargate-frequencies',
      name: 'Stargate Portal',
      description: 'Interdimensional frequencies with portal activation',
      category: 'cosmic',
      duration: 2700, // 45 minutes
      frequency: '1111 Hz',
      benefits: ['Ascension', 'Portal activation', 'Higher dimensions'],
      icon: '⭐',
      color: 'from-indigo-600 to-purple-600',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    },
    {
      id: 'phoenix-fire',
      name: 'Phoenix Transformation',
      description: 'Transformational fire sounds with rising melodies',
      category: 'healing',
      duration: 2400, // 40 minutes
      frequency: '285 Hz',
      benefits: ['Rebirth', 'Transformation', 'Renewal'],
      icon: '🔥',
      color: 'from-orange-600 to-red-600',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    },
    {
      id: 'unicorn-magic',
      name: 'Unicorn Healing',
      description: 'Magical harp and chimes with healing frequencies',
      category: 'healing',
      duration: 2100, // 35 minutes
      frequency: '639 Hz',
      benefits: ['Pure healing', 'Magic', 'Innocence'],
      icon: '🦄',
      color: 'from-pink-600 to-purple-600',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    },
    {
      id: 'atlantis-crystals',
      name: 'Atlantean Crystals',
      description: 'Underwater crystal harmonics with ancient tones',
      category: 'sacred',
      duration: 3300, // 55 minutes
      frequency: '417 Hz',
      benefits: ['Ancient wisdom', 'DNA activation', 'Atlantean connection'],
      icon: '🏛️',
      color: 'from-teal-600 to-blue-600',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    }
  ];

  // Musical instruments with sound generation
  const instruments = [
    {
      id: 'piano',
      name: 'Piano',
      icon: '🎹',
      keys: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
      baseFreq: 261.63 // Middle C
    },
    {
      id: 'guitar',
      name: 'Guitar',
      icon: '🎸',
      keys: ['E', 'A', 'D', 'G', 'B', 'E'],
      baseFreq: 82.41 // Low E
    },
    {
      id: 'flute',
      name: 'Flute',
      icon: '🪈',
      keys: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'],
      baseFreq: 523.25 // High C
    },
    {
      id: 'drums',
      name: 'Drums',
      icon: '🥁',
      keys: ['Kick', 'Snare', 'Hi-Hat', 'Crash', 'Tom1', 'Tom2'],
      baseFreq: 60 // Base drum frequency
    }
  ];

  // Audio context for sound generation
  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize audio context
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  // Generate musical note
  const playNote = (frequency: number, duration: number = 0.5) => {
    if (!audioContext.current) return;

    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.current.currentTime);
    oscillator.type = selectedInstrument === 'piano' ? 'sine' : 
                     selectedInstrument === 'guitar' ? 'sawtooth' :
                     selectedInstrument === 'flute' ? 'triangle' : 'square';

    gainNode.gain.setValueAtTime(0.3, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration);

    oscillator.start(audioContext.current.currentTime);
    oscillator.stop(audioContext.current.currentTime + duration);
  };

  // Calculate note frequency
  const getNoteFrequency = (note: string, octave: number = 4) => {
    const noteFrequencies: { [key: string]: number } = {
      'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
      'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
      'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
    };
    return noteFrequencies[note] * Math.pow(2, octave - 4);
  };

  // Meditation timer
  useEffect(() => {
    if (isPlaying && selectedSession) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= selectedSession.duration) {
            setIsPlaying(false);
            return selectedSession.duration;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, selectedSession]);

  const startMeditation = () => {
    if (!selectedSession) return;
    setIsPlaying(true);
    setCurrentTime(0);
    
    // Auto-start ambient music if available
    if (selectedSession.ambientMusic) {
      const track = ambientTracks.find(t => t.id === selectedSession.ambientMusic);
      if (track) {
        setSelectedAmbientTrack(track);
        setIsMusicPlaying(true);
      }
    }
  };

  const pauseMeditation = () => {
    setIsPlaying(false);
  };

  const resetMeditation = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const toggleAmbientMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Journal functions
  const addMoodEntry = () => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date(),
      mood: currentMood,
      energy: currentEnergy,
      stress: currentStress,
      notes: journalNotes,
      sessionType: selectedSession?.name,
      sessionDuration: selectedSession ? Math.floor(currentTime / 60) : undefined
    };

    setMoodEntries([...moodEntries, newEntry]);
    setJournalNotes('');
    setShowJournalForm(false);
  };

  const getMoodIcon = (mood: number) => {
    if (mood <= 2) return <Frown className="h-5 w-5 text-red-500" />;
    if (mood <= 3) return <Meh className="h-5 w-5 text-yellow-500" />;
    return <Smile className="h-5 w-5 text-green-500" />;
  };

  const getSessionTypeColor = (type: string) => {
    const colors = {
      breathing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      mindfulness: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'body-scan': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      'loving-kindness': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
      visualization: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300'
    };
    return colors[type as keyof typeof colors] || colors.mindfulness;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      nature: 'from-green-500 to-emerald-500',
      cosmic: 'from-purple-500 to-indigo-500',
      sacred: 'from-orange-500 to-red-500',
      healing: 'from-blue-500 to-cyan-500',
      mystical: 'from-pink-500 to-purple-500'
    };
    return colors[category as keyof typeof colors] || colors.healing;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl shadow-2xl">
            <Brain className="h-8 w-8 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
            DHYAN
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          ✨ Mystical Meditation • 🎵 Sacred Music • 📖 Soul Journal ✨
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center">
        <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-1 flex space-x-1 border border-white/20 dark:border-gray-700">
          {[
            { id: 'meditation', label: 'Meditation', icon: Brain },
            { id: 'ambient', label: 'Ambient Music', icon: Headphones },
            { id: 'music', label: 'Instruments', icon: Music },
            { id: 'journal', label: 'Soul Journal', icon: BookOpen }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${
                  activeView === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/25'
                    : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white/20 dark:hover:bg-gray-700/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Meditation View */}
      {activeView === 'meditation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Session Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                <span>🧙‍♀️ Choose Your Mystical Journey</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meditationSessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className={`group p-6 rounded-2xl border-2 transition-all text-left transform hover:scale-105 hover:shadow-2xl ${
                      selectedSession?.id === session.id
                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 shadow-lg shadow-purple-500/25'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm'
                    }`}
                  >
                    <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium mb-3 ${getSessionTypeColor(session.type)}`}>
                      {session.type.replace('-', ' ')}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {session.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                      {session.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Timer className="h-4 w-4 mr-1" />
                        {Math.floor(session.duration / 60)} minutes
                      </div>
                      {session.ambientMusic && (
                        <div className="flex items-center text-sm text-purple-600 dark:text-purple-400">
                          <Headphones className="h-4 w-4 mr-1" />
                          <span>Music</span>
                        </div>
                      )}
                    </div>
                    {session.musicDescription && (
                      <div className="mt-2 text-xs text-purple-600 dark:text-purple-400 italic">
                        🎵 {session.musicDescription}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Meditation Player */}
          <div className="space-y-6">
            {selectedSession && (
              <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">
                  {selectedSession.name}
                </h3>
                
                {/* Timer Display */}
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                    {formatTime(selectedSession.duration - currentTime)}
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 h-3 rounded-full transition-all duration-1000 shadow-lg"
                      style={{ width: `${(currentTime / selectedSession.duration) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center space-x-4 mb-6">
                  <button
                    onClick={resetMeditation}
                    className="p-3 bg-white/20 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 rounded-full hover:bg-white/30 dark:hover:bg-gray-600/50 transition-all transform hover:scale-110 backdrop-blur-sm"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={isPlaying ? pauseMeditation : startMeditation}
                    className="p-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full hover:from-purple-600 hover:to-indigo-600 transition-all transform hover:scale-110 shadow-lg shadow-purple-500/25"
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6 ml-1" />
                    )}
                  </button>

                  {selectedSession.ambientMusic && (
                    <button
                      onClick={toggleAmbientMusic}
                      className={`p-3 rounded-full transition-all transform hover:scale-110 backdrop-blur-sm ${
                        isMusicPlaying
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
                          : 'bg-white/20 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-gray-600/50'
                      }`}
                    >
                      <Headphones className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Ambient Music Info */}
                {selectedSession.ambientMusic && selectedAmbientTrack && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <Headphones className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-purple-900 dark:text-purple-100">
                        {selectedAmbientTrack.name}
                      </span>
                    </div>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      {selectedAmbientTrack.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-purple-600 dark:text-purple-400">
                        {selectedAmbientTrack.frequency}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Volume2 className="h-3 w-3 text-purple-600" />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={musicVolume}
                          onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                          className="w-16 h-1 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Instructions */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                    <span>🧘‍♀️ Sacred Instructions:</span>
                  </h4>
                  <ul className="space-y-2">
                    {selectedSession.instructions.map((instruction, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                        <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="leading-relaxed">{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Quick Journal */}
            <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <span>📖 Post-Session Reflection</span>
              </h3>
              <button
                onClick={() => setShowJournalForm(true)}
                className="w-full p-4 border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-xl text-purple-600 dark:text-purple-400 hover:border-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-all transform hover:scale-105 bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm"
              >
                ✨ Add sacred mood entry ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ambient Music View */}
      {activeView === 'ambient' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              🎵 Sacred Ambient Music Library 🎵
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Immerse yourself in healing frequencies and mystical soundscapes
            </p>
          </div>

          {/* Ambient Tracks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ambientTracks.map((track) => (
              <div
                key={track.id}
                className={`group relative overflow-hidden rounded-2xl p-6 transition-all transform hover:scale-105 hover:shadow-2xl cursor-pointer border-2 ${
                  selectedAmbientTrack?.id === track.id
                    ? 'border-purple-500 shadow-lg shadow-purple-500/25'
                    : 'border-transparent hover:border-purple-300'
                }`}
                onClick={() => setSelectedAmbientTrack(track)}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${track.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{track.icon}</span>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm ${
                      track.category === 'nature' ? 'text-green-700' :
                      track.category === 'cosmic' ? 'text-purple-700' :
                      track.category === 'sacred' ? 'text-orange-700' :
                      track.category === 'healing' ? 'text-blue-700' :
                      'text-pink-700'
                    }`}>
                      {track.category}
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {track.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                    {track.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                      <span className="font-medium">{Math.floor(track.duration / 60)} min</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Frequency:</span>
                      <span className="font-medium text-purple-600 dark:text-purple-400">{track.frequency}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Benefits:</span>
                    <div className="flex flex-wrap gap-1">
                      {track.benefits.map((benefit, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white/30 dark:bg-gray-700/50 rounded-full text-xs text-gray-700 dark:text-gray-300 backdrop-blur-sm"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Music Player */}
          {selectedAmbientTrack && (
            <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                    <span>{selectedAmbientTrack.icon}</span>
                    <span>{selectedAmbientTrack.name}</span>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {selectedAmbientTrack.description}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${getCategoryColor(selectedAmbientTrack.category)} text-white`}>
                  {selectedAmbientTrack.frequency}
                </div>
              </div>

              {/* Music Controls */}
              <div className="flex items-center justify-center space-x-6 mb-6">
                <button
                  onClick={() => setIsMusicPlaying(!isMusicPlaying)}
                  className={`p-4 rounded-full transition-all transform hover:scale-110 shadow-lg ${
                    isMusicPlaying
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-500/25'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/25'
                  }`}
                >
                  {isMusicPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6 ml-1" />
                  )}
                </button>

                <div className="flex items-center space-x-3">
                  <Volume2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={musicVolume}
                    onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                    className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Benefits Display */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedAmbientTrack.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/20 dark:bg-gray-700/30 rounded-xl text-center backdrop-blur-sm border border-white/10 dark:border-gray-600"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {benefit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Music View (Instruments) */}
      {activeView === 'music' && (
        <div className="space-y-6">
          {/* Instrument Selection */}
          <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <span>🎼 Sacred Virtual Instruments</span>
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {instruments.map((instrument) => (
                <button
                  key={instrument.id}
                  onClick={() => setSelectedInstrument(instrument.id)}
                  className={`p-6 rounded-2xl border-2 transition-all text-center transform hover:scale-105 hover:shadow-2xl ${
                    selectedInstrument === instrument.id
                      ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 shadow-lg shadow-purple-500/25'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm'
                  }`}
                >
                  <div className="text-4xl mb-2">{instrument.icon}</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {instrument.name}
                  </div>
                </button>
              ))}
            </div>

            {/* Instrument Interface */}
            {selectedInstrument && (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <span>🎹 {instruments.find(i => i.id === selectedInstrument)?.name} Keys</span>
                </h3>
                
                <div className="grid grid-cols-6 md:grid-cols-12 gap-2 mb-6">
                  {instruments.find(i => i.id === selectedInstrument)?.keys.map((key, index) => (
                    <button
                      key={index}
                      onMouseDown={() => {
                        const instrument = instruments.find(i => i.id === selectedInstrument);
                        if (instrument) {
                          if (selectedInstrument === 'drums') {
                            // Different frequencies for drum sounds
                            const drumFreqs = [60, 200, 800, 1000, 300, 400];
                            playNote(drumFreqs[index] || 60, 0.3);
                          } else {
                            const freq = getNoteFrequency(key, 4 + Math.floor(index / 12));
                            playNote(freq);
                          }
                        }
                      }}
                      className={`p-4 rounded-xl font-medium transition-all transform active:scale-95 hover:shadow-lg ${
                        key.includes('#') 
                          ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white hover:from-gray-700 hover:to-gray-800 shadow-lg' 
                          : 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-500 hover:from-purple-50 hover:to-indigo-50 dark:hover:from-purple-900/20 dark:hover:to-indigo-900/20 shadow-md'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>

                {/* Recording Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg ${
                      isRecording
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-red-500/25'
                        : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-purple-500/25'
                    }`}
                  >
                    {isRecording ? '⏹️ Stop Recording' : '🎙️ Start Recording'}
                  </button>
                  
                  <button
                    onClick={() => {
                      // Save composition logic would go here
                      alert('🎵 Sacred composition saved to the akashic records! ✨');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg shadow-green-500/25"
                  >
                    💾 Save Sacred Composition
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Journal View */}
      {activeView === 'journal' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mood Entries */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <span>📖 Sacred Soul Journal</span>
                </h2>
                <button
                  onClick={() => setShowJournalForm(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25"
                >
                  ✨ New Sacred Entry
                </button>
              </div>

              <div className="space-y-4">
                {moodEntries.length > 0 ? (
                  moodEntries.slice().reverse().map((entry) => (
                    <div key={entry.id} className="p-6 bg-white/20 dark:bg-gray-700/30 rounded-2xl backdrop-blur-sm border border-white/10 dark:border-gray-600 hover:shadow-lg transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getMoodIcon(entry.mood)}
                          <span className="font-medium text-gray-900 dark:text-white">
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                        </div>
                        {entry.sessionType && (
                          <span className="text-xs bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full">
                            {entry.sessionType}
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Mood:</span>
                          <div className="flex mt-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div
                                key={i}
                                className={`w-3 h-3 rounded-full mr-1 ${
                                  i <= entry.mood ? 'bg-green-400' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Energy:</span>
                          <div className="flex mt-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div
                                key={i}
                                className={`w-3 h-3 rounded-full mr-1 ${
                                  i <= entry.energy ? 'bg-yellow-400' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Stress:</span>
                          <div className="flex mt-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div
                                key={i}
                                className={`w-3 h-3 rounded-full mr-1 ${
                                  i <= entry.stress ? 'bg-red-400' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {entry.notes && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed italic">
                          "{entry.notes}"
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      ✨ Your Sacred Journal Awaits ✨
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Begin documenting your mystical journey and spiritual growth
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mood Stats */}
          <div className="space-y-6">
            <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <span>📊 Sacred Insights</span>
              </h3>
              
              {moodEntries.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Average Mood</span>
                    <div className="flex items-center space-x-1">
                      {getMoodIcon(Math.round(moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length))}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {(moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length).toFixed(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Sacred Sessions</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {moodEntries.filter(entry => entry.sessionType).length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">This Week</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {moodEntries.filter(entry => {
                        const entryDate = new Date(entry.date);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return entryDate >= weekAgo;
                      }).length} entries
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                  ✨ Begin your journey to unlock sacred insights ✨
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Journal Form Modal */}
      {showJournalForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl max-w-md w-full border border-white/20 dark:border-gray-700 shadow-2xl">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <span>✨ How is your soul feeling? ✨</span>
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Mood Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mood (1-5) 😊
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setCurrentMood(rating)}
                      className={`w-12 h-12 rounded-full transition-all transform hover:scale-110 ${
                        rating <= currentMood
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Energy (1-5) ⚡
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setCurrentEnergy(rating)}
                      className={`w-12 h-12 rounded-full transition-all transform hover:scale-110 ${
                        rating <= currentEnergy
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/25'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stress Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stress (1-5) 😰
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setCurrentStress(rating)}
                      className={`w-12 h-12 rounded-full transition-all transform hover:scale-110 ${
                        rating <= currentStress
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sacred Notes (optional) 📝
                </label>
                <textarea
                  value={journalNotes}
                  onChange={(e) => setJournalNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700/50 dark:text-white backdrop-blur-sm"
                  rows={3}
                  placeholder="Share your mystical insights, revelations, or reflections from your sacred practice..."
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowJournalForm(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addMoodEntry}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25"
              >
                ✨ Save Sacred Entry ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dhyan;