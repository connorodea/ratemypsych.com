export interface Psychiatrist {
  id: string
  name: string
  credentials: string
  specialty: string[]
  location: {
    city: string
    state: string
    address: string
  }
  rating: number
  reviewCount: number
  acceptingPatients: boolean
  insuranceAccepted: string[]
  imageUrl: string
  bio: string
  education: string[]
  languages: string[]
}

export interface Review {
  id: string
  psychiatristId: string
  authorName: string
  rating: number
  date: string
  title: string
  content: string
  helpful: number
  verified: boolean
  tags: string[]
}

export const psychiatrists: Psychiatrist[] = [
  {
    id: "dr-sarah-chen",
    name: "Dr. Sarah Chen",
    credentials: "MD, Board Certified Psychiatrist",
    specialty: ["Anxiety Disorders", "Depression", "ADHD"],
    location: {
      city: "New York",
      state: "NY",
      address: "425 Park Avenue, Suite 1200",
    },
    rating: 4.8,
    reviewCount: 127,
    acceptingPatients: true,
    insuranceAccepted: ["Aetna", "Blue Cross Blue Shield", "Cigna", "United Healthcare"],
    imageUrl: "/psychiatrists/dr-chen.jpg",
    bio: "Dr. Sarah Chen is a board-certified psychiatrist with over 15 years of experience treating adults with anxiety, depression, and ADHD. She takes a collaborative approach to treatment, combining medication management with psychotherapy when appropriate.",
    education: ["Harvard Medical School, MD", "Yale University, Psychiatry Residency"],
    languages: ["English", "Mandarin"],
  },
  {
    id: "dr-michael-rodriguez",
    name: "Dr. Michael Rodriguez",
    credentials: "MD, PhD",
    specialty: ["Bipolar Disorder", "Schizophrenia", "Mood Disorders"],
    location: {
      city: "Los Angeles",
      state: "CA",
      address: "8929 Wilshire Blvd, Suite 400",
    },
    rating: 4.6,
    reviewCount: 89,
    acceptingPatients: true,
    insuranceAccepted: ["Kaiser Permanente", "Blue Shield of California", "Cigna"],
    imageUrl: "/psychiatrists/dr-rodriguez.jpg",
    bio: "Dr. Rodriguez specializes in the treatment of complex mood disorders and psychotic conditions. His research background in neuroscience informs his evidence-based approach to psychiatric care.",
    education: ["UCLA School of Medicine, MD/PhD", "Stanford University, Psychiatry Fellowship"],
    languages: ["English", "Spanish"],
  },
  {
    id: "dr-emily-johnson",
    name: "Dr. Emily Johnson",
    credentials: "MD",
    specialty: ["Child & Adolescent Psychiatry", "ADHD", "Autism Spectrum"],
    location: {
      city: "Chicago",
      state: "IL",
      address: "680 N Lake Shore Dr, Suite 1400",
    },
    rating: 4.9,
    reviewCount: 203,
    acceptingPatients: false,
    insuranceAccepted: ["Blue Cross Blue Shield", "Aetna", "Humana"],
    imageUrl: "/psychiatrists/dr-johnson.jpg",
    bio: "Dr. Johnson is a child and adolescent psychiatrist dedicated to helping young people and their families navigate mental health challenges. She creates a warm, supportive environment for her patients.",
    education: ["Johns Hopkins School of Medicine, MD", "Boston Children's Hospital, Child Psychiatry Fellowship"],
    languages: ["English"],
  },
  {
    id: "dr-james-patel",
    name: "Dr. James Patel",
    credentials: "MD, MPH",
    specialty: ["Addiction Psychiatry", "PTSD", "Trauma"],
    location: {
      city: "Houston",
      state: "TX",
      address: "2727 Allen Parkway, Suite 800",
    },
    rating: 4.7,
    reviewCount: 156,
    acceptingPatients: true,
    insuranceAccepted: ["Aetna", "United Healthcare", "Molina Healthcare", "Tricare"],
    imageUrl: "/psychiatrists/dr-patel.jpg",
    bio: "Dr. Patel specializes in treating patients with substance use disorders and trauma-related conditions. He takes a compassionate, non-judgmental approach to care and is experienced in working with veterans.",
    education: ["Baylor College of Medicine, MD", "Harvard T.H. Chan School of Public Health, MPH"],
    languages: ["English", "Hindi", "Gujarati"],
  },
  {
    id: "dr-amanda-williams",
    name: "Dr. Amanda Williams",
    credentials: "DO, Board Certified",
    specialty: ["Geriatric Psychiatry", "Dementia", "Late-Life Depression"],
    location: {
      city: "Phoenix",
      state: "AZ",
      address: "3003 N Central Ave, Suite 1500",
    },
    rating: 4.5,
    reviewCount: 78,
    acceptingPatients: true,
    insuranceAccepted: ["Medicare", "Blue Cross Blue Shield", "Cigna", "Humana"],
    imageUrl: "/psychiatrists/dr-williams.jpg",
    bio: "Dr. Williams focuses on the mental health needs of older adults, including depression, anxiety, and cognitive disorders. She works closely with families to provide comprehensive care for her patients.",
    education: ["Arizona College of Osteopathic Medicine, DO", "University of Arizona, Geriatric Psychiatry Fellowship"],
    languages: ["English"],
  },
  {
    id: "dr-david-kim",
    name: "Dr. David Kim",
    credentials: "MD",
    specialty: ["OCD", "Anxiety Disorders", "Eating Disorders"],
    location: {
      city: "Seattle",
      state: "WA",
      address: "1959 NE Pacific St, Suite 600",
    },
    rating: 4.8,
    reviewCount: 112,
    acceptingPatients: true,
    insuranceAccepted: ["Premera Blue Cross", "Regence", "Aetna", "Cigna"],
    imageUrl: "/psychiatrists/dr-kim.jpg",
    bio: "Dr. Kim is an expert in the treatment of OCD and anxiety disorders, utilizing both medication and evidence-based therapeutic approaches. He is known for his patient, thorough approach to care.",
    education: ["University of Washington School of Medicine, MD", "Massachusetts General Hospital, OCD Institute Fellowship"],
    languages: ["English", "Korean"],
  },
]

export const reviews: Review[] = [
  {
    id: "review-1",
    psychiatristId: "dr-sarah-chen",
    authorName: "Anonymous",
    rating: 5,
    date: "2025-01-15",
    title: "Life-changing experience",
    content: "Dr. Chen truly listened to my concerns and took the time to explain everything. After years of struggling with anxiety, I finally feel like I have a treatment plan that works. She's compassionate, knowledgeable, and genuinely cares about her patients.",
    helpful: 24,
    verified: true,
    tags: ["Listens well", "Thorough", "Explains clearly"],
  },
  {
    id: "review-2",
    psychiatristId: "dr-sarah-chen",
    authorName: "Anonymous",
    rating: 5,
    date: "2025-01-08",
    title: "Excellent psychiatrist",
    content: "I've been seeing Dr. Chen for six months now for depression and ADHD. She's helped me find the right medication combination that has made a huge difference in my quality of life. Highly recommend.",
    helpful: 18,
    verified: true,
    tags: ["Medication management", "Responsive"],
  },
  {
    id: "review-3",
    psychiatristId: "dr-sarah-chen",
    authorName: "Anonymous",
    rating: 4,
    date: "2024-12-20",
    title: "Great doctor, hard to schedule",
    content: "Dr. Chen is an excellent psychiatrist and I've had great results under her care. The only downside is that appointments can be hard to get - she's very popular. But it's worth the wait.",
    helpful: 12,
    verified: true,
    tags: ["Knowledgeable", "Busy practice"],
  },
  {
    id: "review-4",
    psychiatristId: "dr-michael-rodriguez",
    authorName: "Anonymous",
    rating: 5,
    date: "2025-01-10",
    title: "Finally found the right help",
    content: "After being misdiagnosed for years, Dr. Rodriguez correctly identified my bipolar disorder and put me on a treatment plan that has stabilized my life. His expertise in mood disorders is evident.",
    helpful: 31,
    verified: true,
    tags: ["Accurate diagnosis", "Expert"],
  },
  {
    id: "review-5",
    psychiatristId: "dr-emily-johnson",
    authorName: "Anonymous",
    rating: 5,
    date: "2025-01-12",
    title: "Amazing with children",
    content: "Dr. Johnson has been wonderful with our son who has ADHD. She takes time to talk to him directly and makes him feel comfortable. We've seen tremendous improvement since starting treatment.",
    helpful: 42,
    verified: true,
    tags: ["Great with kids", "Patient", "Caring"],
  },
  {
    id: "review-6",
    psychiatristId: "dr-james-patel",
    authorName: "Anonymous",
    rating: 5,
    date: "2025-01-05",
    title: "Understanding and supportive",
    content: "As a veteran with PTSD, I was nervous about seeking help. Dr. Patel made me feel safe and understood from the first appointment. His experience with trauma is clear. I'm grateful for his care.",
    helpful: 56,
    verified: true,
    tags: ["Trauma-informed", "Compassionate", "Veteran-friendly"],
  },
]

export const specialties = [
  "Anxiety Disorders",
  "Depression",
  "ADHD",
  "Bipolar Disorder",
  "Schizophrenia",
  "PTSD",
  "OCD",
  "Addiction",
  "Eating Disorders",
  "Child & Adolescent",
  "Geriatric",
  "Trauma",
]

export const states = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
]
