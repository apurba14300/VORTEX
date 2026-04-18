
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  DIM = 'dim'
}

export interface ProfessionalRole {
  role: string;
  icon: string;
  bg: string;
  color: string;
}

export interface ProjectMilestone {
  id: string;
  label: string;
  status: string;
  dueDate?: string;
}

export interface ProjectReview {
  healthScore: number;
  summary: string;
  findings: {
    severity: string;
    category: string;
    description: string;
  }[];
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  banner: string;
  bio: string;
  role: string;
  skills: string[];
  coins: number;
  reputation: number;
  rank: string;
  isVerified: boolean;
  followers: string[];
  following: string[];
  isPrime: boolean;
  nicknames?: Record<string, string>;
  starredUsers?: string[];
  isPrivate: boolean;
  primeUntil?: string;
  lastNameChangeDate?: string; // Track temporal name restrictions
}

export interface Project {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  techStack: string[];
  image?: string;
  likes: number;
  views: number;
  createdAt: string;
  isPublic: boolean;
  roadmap: ProjectMilestone[];
  files: { name: string; content: string; language: string }[];
  metrics: {
    testCoverage: number;
    techDebt: number;
    deploymentFrequency: number;
  };
  reviews: ProjectReview[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

export interface SubscriptionEvent {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  tierName: string;
  timestamp: string;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  projects: Project[];
  messages: Message[];
  theme: Theme;
  subscriptionEvents: SubscriptionEvent[];
}
