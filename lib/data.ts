import { Designer, Job, Service } from "../types";

export const DESIGNERS: Designer[] = [
  {
    id: "abebe",
    name: "Abebe Eshetu",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    title: "Senior 3D Artist & Cultural Visualizer",
    city: "Addis Ababa",
    country: "Ethiopia",
    rating: 4.9,
    completedJobs: 42,
    skills: ["3D Blender", "Cultural Architecture", "Motion Graphics", "Figma", "Rendering", "Visualization"],
    bio: "Reinterpreting ancient Afro-Semitic patterns and structural aesthetics into hyper-modern three-dimensional physical rendering streams.",
    featuredProjectImg: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    portfolioItems: [
      { id: "a1", title: "Lalibela Modern Render", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80" },
      { id: "a2", title: "Ethiopian Futurist Pavilion", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop&q=80" }
    ],
    availability: "Available Now",
    recentlyActiveMinutes: 5,
    responseTimeHours: 0.1, // 6 minutes 
    activeJobs: 1,
    experienceYears: 8,
    industries: ["Architecture", "Heritage Museums", "Fine Arts & Luxury Branding"],
    designStyles: ["Symmetrical Geometry", "Afrofuturistic Structuring", "Earthy Clay Texturizing"],
    complexityLevel: "Premium & Luxury",
    talentType: "individual"
  },
  {
    id: "fatima",
    name: "Fatima Diop",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    title: "Lead UI/UX & Brand Identity Designer",
    city: "Dakar",
    country: "Senegal",
    rating: 5.0,
    completedJobs: 56,
    skills: ["Figma Design", "Afrofuturism Web Systems", "Design Systems", "Prototyping", "UI/UX", "User Interfaces"],
    bio: "Pioneering minimalist Senegalese geometry layouts that streamline contemporary digital interfaces for international consumer sectors.",
    featuredProjectImg: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80",
    portfolioItems: [
      { id: "f1", title: "Dakar Tech Capital Portal", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80" },
      { id: "f2", title: "Teranga Hospitality App", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&auto=format&fit=crop&q=80" }
    ],
    availability: "Available This Week",
    recentlyActiveMinutes: 15,
    responseTimeHours: 0.25, // 15 minutes
    activeJobs: 2,
    experienceYears: 10,
    industries: ["Fintech UI/UX", "Tech Cloud SaaS Systems", "Hospitality E-Commerce"],
    designStyles: ["Geometric Minimalism", "Clean Interfaces", "Neubrutalist Web Layouts"],
    complexityLevel: "High Complexity",
    talentType: "individual"
  },
  {
    id: "kofi",
    name: "Kofi Boateng",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    title: "Premium Packaging & Brand Narrative Officer",
    city: "Kumasi",
    country: "Ghana",
    rating: 4.8,
    completedJobs: 37,
    skills: ["Luxury Packaging", "Graphic Arts", "Adornment Geometry", "Branding", "Label Design", "Dielines"],
    bio: "Translating West African historical textiles and Kente graphic values into global premium FMCG shelf presence.",
    featuredProjectImg: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&auto=format&fit=crop&q=80",
    portfolioItems: [
      { id: "k1", title: "Asante Cocoa Box Art", image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=400&auto=format&fit=crop&q=80" },
      { id: "k2", title: "Ananse Craft Bottle Wrap", image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=400&auto=format&fit=crop&q=80" }
    ],
    availability: "Limited Availability",
    recentlyActiveMinutes: 120,
    responseTimeHours: 1.2, // 72 minutes
    activeJobs: 4,
    experienceYears: 7,
    industries: ["Luxury FMCG shelf presence", "Premium Beverages & Chocolate Labels", "Organic Cosmetics Packaging"],
    designStyles: ["Kente Tradition Adornment Grid", "Traditional Textile Linework", "Gold Foiling Details"],
    complexityLevel: "Premium & Luxury",
    talentType: "individual"
  },
  {
    id: "zanele",
    name: "Zanele Mbeki",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
    title: "Illustrator & Custom Graphic Muralist",
    city: "Johannesburg",
    country: "South Africa",
    rating: 5.0,
    completedJobs: 42,
    skills: ["Digital Illustration", "Traditional Motifs", "Procreate", "Vector Artwork", "Murals"],
    bio: "Fusing vibrant modern cultural palettes with ancient geometric beadwork symbology designed for international commercial and environmental campaigns.",
    featuredProjectImg: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80",
    portfolioItems: [
      { id: "z1", title: "Vibrant Beadwork Poster Series", image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&auto=format&fit=crop&q=80" },
      { id: "z2", title: "Cultural Pattern Branding Kit", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&auto=format&fit=crop&q=80" }
    ],
    availability: "Available Now",
    recentlyActiveMinutes: 10,
    responseTimeHours: 0.2,
    activeJobs: 1,
    experienceYears: 6,
    industries: ["Vibrant Retail Packaging", "Hospitality Interior Graphics", "Editorial Hand-Drawn Prints"],
    designStyles: ["Hand-Rendered Symmetry", "Bright Beadwork Motifs", "Minimalist Folk Art Flat Layers"],
    complexityLevel: "Clean & Modern",
    talentType: "individual"
  },
  {
    id: "kilimanjaro",
    name: "Kilimanjaro Labs",
    avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&auto=format&fit=crop&q=80",
    title: "High-Performance Pan-African Design Collective",
    city: "Nairobi",
    country: "Kenya",
    rating: 5.0,
    completedJobs: 124,
    skills: ["Figma Design", "Design Systems", "UI/UX", "3D Blender", "User Interfaces", "Prototyping"],
    bio: "We are a premier design and development studio constructing state-of-the-art fintech UI/UX, unified systems, and dynamic digital assets for global enterprises.",
    featuredProjectImg: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&auto=format&fit=crop&q=80",
    portfolioItems: [
      { id: "kili1", title: "Safaris Global E-commerce Platform", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=80" },
      { id: "kili2", title: "East Africa Trans-border Ledger Layout", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80" }
    ],
    availability: "Available Now",
    recentlyActiveMinutes: 2,
    responseTimeHours: 0.05,
    activeJobs: 3,
    experienceYears: 12,
    industries: ["Fintech Mobile UI/UX", "Logistics ERP Blueprints", "Multi-platform Tech Systems"],
    designStyles: ["Symmetrical Geometry", "Geometric Minimalism", "Neubrutalist Web Layouts"],
    complexityLevel: "Premium & Luxury",
    talentType: "agency",
    teamSize: 14,
    agencyBrandingLogo: "KILI_LABS"
  },
  {
    id: "ndebele_collective",
    name: "Ndebele Creative Collective",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
    title: "Pan-African Branding & Cultural Adornment Studio",
    city: "Cape Town",
    country: "South Africa",
    rating: 4.9,
    completedJobs: 85,
    skills: ["Branding", "Digital Illustration", "Traditional Motifs", "Murals", "Textiles & Fashion", "Label Design"],
    bio: "A collaborative force of highly specialized creatives synthesizing South African heritage beadwork symbology and rich folklore vectors into hyper-premium products.",
    featuredProjectImg: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80",
    portfolioItems: [
      { id: "ndeb1", title: "Zululand Premium Gin Botanicals", image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=400&auto=format&fit=crop&q=80" },
      { id: "ndeb2", title: "Vibrant Beadwork Textile Prints", image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&auto=format&fit=crop&q=80" }
    ],
    availability: "Available This Week",
    recentlyActiveMinutes: 20,
    responseTimeHours: 0.3,
    activeJobs: 1,
    experienceYears: 9,
    industries: ["Luxury FMCG", "Premium Beverages & Chocolate Labels", "Hospitality Interior Graphics"],
    designStyles: ["Hand-Rendered Symmetry", "Bright Beadwork Motifs", "Kente Tradition Adornment Grid"],
    complexityLevel: "Premium & Luxury",
    talentType: "agency",
    teamSize: 8,
    agencyBrandingLogo: "NDEB_COLL"
  }
];

export const JOBS: Job[] = [
  {
    id: "j1",
    title: "Afro-Futurism Virtual Exhibit Interface",
    company: "Dakar Fine Art Coalition",
    budget: 4500,
    location: "Remote (Senegal Time)",
    category: "UI/UX Design",
    skillsNeeded: ["Figma Design", "Afrofuturism Web Systems", "Tailwind Theme Layouts"],
    description: "Seeking a senior designer to create an interactive web portal celebrating Senegalese independence through architectural interactive historical galleries.",
    proposals: 14
  },
  {
    id: "j2",
    title: "Specialty Ethiopian Honey Packaging Redesign",
    company: "Abyssinia Premium Nectars",
    budget: 3200,
    location: "Remote",
    category: "Branding & Packaging",
    skillsNeeded: ["Luxury Packaging", "Adornment Geometry", "Vector Illustrating"],
    description: "Design premium glass labels, wooden cork caps, and narrative-centric outer box packing detailing Lalibela's rich honey cultivation lineage.",
    proposals: 8
  },
  {
    id: "j3",
    title: "3D Rendering for Circular Green Habitats",
    company: "Ecowas Housing Commission",
    budget: 6800,
    location: "Abidjan, Ivory Coast",
    category: "3D Art & Modeling",
    skillsNeeded: ["3D Blender", "Cultural Architecture", "Environment Simulation"],
    description: "Synthesize spatial simulations mapping traditional circular earthen geometries configured with solar-capturing roofing paths.",
    proposals: 23
  },
  {
    id: "j4",
    title: "Traditional Motif Vector Illustration Series",
    company: "Nairobi Heritage Luxury Hotel",
    budget: 2800,
    location: "Nairobi, Kenya",
    category: "Digital Illustration",
    skillsNeeded: ["Vector Illustration", "Traditional Motifs", "Adobe Illustrator"],
    description: "Design a consistent series of 12 vector art illustrations inspired by East African traditional folklore and graphic geometry to be showcased in our luxury suite lobbies.",
    proposals: 5
  },
  {
    id: "j5",
    title: "Fintech Summit Kinetic Typography & Logo Motion",
    company: "Lagos Fintech Union",
    budget: 3500,
    location: "Lagos, Nigeria",
    category: "Motion Graphics",
    skillsNeeded: ["Adobe After Effects", "Kinetic Typography", "Brand Reveal Animation"],
    description: "Create an engaging 45-second high energy event intro video with custom kinetic typography overlays and a high fidelity 3D style logo transition overlay sequence.",
    proposals: 11
  },
  {
    id: "j6",
    title: "Pan-African Railway Logistic Identity Design",
    company: "Equator Rail Systems",
    budget: 5000,
    location: "Addis Ababa, Ethiopia",
    category: "Logo Design",
    skillsNeeded: ["Visual Identity Systems", "Logo Guidelines", "Symbol Design"],
    description: "Develop a premium modernist logo family and corporate pattern guidelines expressing unity, momentum, and cross-border commercial connection across East and Central Africa.",
    proposals: 19
  },
  {
    id: "j7",
    title: "Adinkra Symbol Fusion Luxury Textile Prints",
    company: "Kente Accenture Couture",
    budget: 4200,
    location: "Accra, Ghana",
    category: "Textile & Fashion",
    skillsNeeded: ["Textile Pattern Design", "Vector Artwork", "Fashion Rendering"],
    description: "Seek an experienced textile patterns creator to compose seamless graphic arrays fusing ancient Adinkra graphic values into fresh commercial prints for upscale silk luxury scarves.",
    proposals: 7
  },
  {
    id: "j8",
    title: "Modern Ge'ez Display Rebranding Font Family",
    company: "Adis-Admas Editorial House",
    budget: 6000,
    location: "Remote",
    category: "Typography & Fonts",
    skillsNeeded: ["Typography Design", "Font Customisation", "Ge'ez Script"],
    description: "Commission the design of a bilingual display font family honoring traditional Ge'ez calligraphic forms with clean, high-contrast modernist grid stems.",
    proposals: 3
  },
  {
    id: "j9",
    title: "Decentralized Creator Gallery Web Hub",
    company: "Alt-Afrique Contemporary",
    budget: 5500,
    location: "Cape Town, South Africa",
    category: "Web & No-Code Design",
    skillsNeeded: ["Web Design", "Webflow/Framer Development", "Interactive Layouts"],
    description: "Design and implement a highly interactive curated platform for Cape Town and Johannesburg digital sculptors, with custom grid structures and fluid dynamic gallery grids.",
    proposals: 15
  }
];

export const SERVICES: Service[] = [
  {
    id: "s0",
    title: "Premium Graphic Design, Layout, & Dynamic Editorial Systems",
    designerName: "Zanele Ndlovu",
    designerAvatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&auto=format&fit=crop&q=80",
    price: 1100,
    deliveryDays: 5,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80",
    description: "Expertly craft high-impact marketing layouts, vector illustrations, multi-page layout grids, and unified print/digital graphics for global publication."
  },
  {
    id: "s1",
    title: "Full Brand Identity System & High-End Design Keys",
    designerName: "Fatima Diop",
    designerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    price: 1800,
    deliveryDays: 14,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80",
    description: "You receive high-resolution vector logos, fully custom typographies, standard color guidelines, business cards, and digital pitch templates."
  },
  {
    id: "s2",
    title: "Custom 3D Scene Modeling & High-Definition Renders",
    designerName: "Abebe Eshetu",
    designerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    price: 1400,
    deliveryDays: 10,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    description: "I will craft 3 customized spatial models in Blender or Rhino with textures, professional environment setups, and high-fidelity ray tracing offsets."
  },
  {
    id: "s3",
    title: "Cultural Craft Packaging Design & Shelf Assets",
    designerName: "Kofi Boateng",
    designerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    price: 950,
    deliveryDays: 7,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&auto=format&fit=crop&q=80",
    description: "Get pristine print-ready vector dielines, embossed gold foil specifications, and beautiful 3D product previews for commercial distribution."
  }
];
