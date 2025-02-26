export interface NavItem {
    title: string
    href: string
    disabled?: boolean
  }
  
  export interface Feature {
    title: string
    description: string
    icon: string
  }
  
  export interface Service {
    title: string
    description: string
    icon: string
  }
  
  export interface PricingPlan {
    name: string
    price: number
    description: string
    features: string[]
    popular?: boolean
  }
  
  export interface Advisor {
    name: string
    role: string
    image: string
    social?: {
      twitter?: string
      linkedin?: string
    }
  }
  
  export interface Article {
    title: string
    excerpt: string
    slug: string
    date: string
    author: {
      name: string
      image: string
    }
    image: string
  }
  
  export interface Testimonial {
    content: string
    author: {
      name: string
      role: string
      company: string
      image: string
    }
  }
  
  export interface FaqItem {
    question: string
    answer: string
  }
  
  