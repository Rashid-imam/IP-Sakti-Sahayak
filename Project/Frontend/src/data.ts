import {
  ShieldCheck, Sprout, Network, ClipboardCheck, Bot, Search, Scale, Waypoints,
  BookOpen, GraduationCap, FileText, Leaf,
} from 'lucide-react';

export const heroImage = 'https://images.pexels.com/photos/5480036/pexels-photo-5480036.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
export const herbImage = 'https://images.pexels.com/photos/7615621/pexels-photo-7615621.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export type Icon = typeof Search;

export type Source = { type: string; title: string; ref: string; year: string; icon: Icon };

export const sources: Source[] = [
  { type: 'Traditional Knowledge', title: 'Ashwagandha: documented uses in Ayurveda', ref: 'TKDL reference · Rasayana formulations', year: '2024', icon: Leaf },
  { type: 'Patent document', title: 'Herbal compositions containing Withania somnifera', ref: 'Indian Patent Office · A61K36/00', year: '2022', icon: FileText },
  { type: 'Regulation', title: 'Biological Diversity Act & ABS Guidelines', ref: 'National Biodiversity Authority', year: '2023', icon: Scale },
];

export const quickActions = [
  { label: 'Patentability', icon: ShieldCheck },
  { label: 'ABS requirements', icon: Sprout },
  { label: 'TK similarity', icon: Network },
  { label: 'Know your formulation', icon: ClipboardCheck },
];

export const features = [
  {
    title: 'IP-SAKTI Sahayak Assistant',
    description:
      'Ask one clear question and receive a guided, source-backed research brief.',
    icon: Bot,
    iconColor: '#FFFFFF',
    iconBg: '#D8892F',
    path: '/ask-sakti-ai',
    featured: true,
  },

  {
    title: 'AI Voicecall Assistant',
    description:
      'Ask your doubt directly to the AI assistant via voice call.',
    icon: Bot,
    iconColor: '#FFFFFF',
    iconBg: '#D8892F',
    path: '/ask-sakti-ai',
    featured: true,
  },

  {
    title: 'Formulation Classification',
    description:
      'Understand possible product categories before you begin IP and regulatory checks.',
    icon: ClipboardCheck,
    iconColor: '#2878B8',
    iconBg: '#DCEEFF',
    path: '/knowProduct',
  },

  {
    title: 'TKDL Similarity Check',
    description:
      'Explore documented traditional knowledge that may be relevant to your work.',
    icon: Network,
    iconColor: '#B06A00',
    iconBg: '#FFF0D2',
    path: '/tkdl',
  },

  {
    title: 'Ayurvedic Patent Search',
    description:
      'Search a focused collection of herbal and formulation patent records.',
    icon: Search,
    iconColor: '#7139A8',
    iconBg: '#EEE2FF',
    path: '/patent-search',
  },

  {
    title: 'Ayurveda Graph',
    description:
      'See how ingredients, formulations, research and patents connect.',
    icon: Waypoints,
    iconColor: '#16838A',
    iconBg: '#D9F5F5',
    path: '/knowledgeGraph',
  },

  {
    title: 'Ayurveda Dictionary',
    description:
      'Build a shared vocabulary across classical and modern terminology.',
    icon: BookOpen,
    iconColor: '#28734F',
    iconBg: '#DFF3E7',
    path: '/dictionary',
  },

  {
    title: 'Legal Knowledge Collections',
    description:
      'Browse curated collections for researchers and AYUSH innovators.',
    icon: GraduationCap,
    iconColor: '#C72F45',
    iconBg: '#FFE1E6',
    path: '/library',
  },
];
