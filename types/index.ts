export interface Designer {
  id: string;
  name: string;
  avatar: string;
  title: string;
  city: string;
  country: string;
  rating: number;
  completedJobs: number;
  skills: string[];
  bio: string;
  featuredProjectImg: string;
  portfolioItems: {
    id: string;
    title: string;
    image: string;
  }[];
  // AI system integrated metrics
  availability: "Available Now" | "Available This Week" | "Limited Availability" | "Busy" | "Offline";
  recentlyActiveMinutes: number; 
  responseTimeHours: number;    
  activeJobs: number;            
  experienceYears: number;       
  industries: string[];
  designStyles: string[];
  complexityLevel: "Premium & Luxury" | "High Complexity" | "Clean & Modern" | "Medium Complexity";
  talentType?: "individual" | "agency";
  teamSize?: number;
  agencyBrandingLogo?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  budget: number;
  location: string;
  category: string;
  skillsNeeded: string[];
  description: string;
  proposals: number;
  applied?: boolean;
}

export interface Service {
  id: string;
  title: string;
  designerName: string;
  designerAvatar: string;
  price: number;
  deliveryDays: number;
  rating: number;
  image: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: "client" | "designer";
  text: string;
  timestamp: string;
}
