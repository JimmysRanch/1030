export type PetStatus = "Active" | "Paused" | "New" | "Loyal";

export interface PetProfile {
  id: string;
  name: string;
  species: "Dog" | "Cat" | "Other";
  breed: string;
  color: string;
  owner: string;
  ownerEmail: string;
  plan: string;
  cadence: string;
  lastVisit: string;
  nextVisit: string;
  temperament: string;
  alerts: string[];
  status: PetStatus;
}

export interface CareHighlight {
  pet: string;
  owner: string;
  summary: string;
  timestamp: string;
  tag: "Spa" | "Health" | "Training" | "Grooming";
}

export interface HealthRecord {
  pet: string;
  owner: string;
  vaccines: {
    label: string;
    status: "Complete" | "Due" | "Expired";
    date: string;
    notes?: string;
  }[];
  allergies: string[];
  vet: string;
  lastExam: string;
}

export interface CareAlert {
  pet: string;
  owner: string;
  alert: string;
  severity: "High" | "Medium" | "Low";
  added: string;
  followUp: string;
}

export const petProfiles: PetProfile[] = [
  {
    id: "PET-201",
    name: "Luna",
    species: "Dog",
    breed: "Goldendoodle",
    color: "Apricot",
    owner: "Maya Chen",
    ownerEmail: "maya.chen@example.com",
    plan: "VIP Grooming",
    cadence: "Every 5 weeks",
    lastVisit: "Mar 12, 2025",
    nextVisit: "Apr 16, 2025",
    temperament: "Calm, loves warm towels",
    alerts: ["Sensitive skin", "Prefers hypoallergenic shampoo"],
    status: "Active",
  },
  {
    id: "PET-198",
    name: "Zeus",
    species: "Dog",
    breed: "Husky Mix",
    color: "Black & White",
    owner: "Theo Ramirez",
    ownerEmail: "theo.ramirez@example.com",
    plan: "Seasonal Spa",
    cadence: "Every 8 weeks",
    lastVisit: "Feb 25, 2025",
    nextVisit: "Apr 29, 2025",
    temperament: "High energy; use calming treats",
    alerts: ["Double coat—extra deshedding", "Sensitive paws"],
    status: "Active",
  },
  {
    id: "PET-205",
    name: "Nori",
    species: "Cat",
    breed: "Maine Coon",
    color: "Silver Tabby",
    owner: "Aliyah Reyes",
    ownerEmail: "aliyah.reyes@example.com",
    plan: "Signature Groom",
    cadence: "Every 6 weeks",
    lastVisit: "Mar 04, 2025",
    nextVisit: "Apr 15, 2025",
    temperament: "Talkative, tolerates bathing",
    alerts: ["Prefers quiet room", "Matting behind ears"],
    status: "Loyal",
  },
  {
    id: "PET-214",
    name: "Poppy",
    species: "Dog",
    breed: "Cavalier King Charles",
    color: "Ruby",
    owner: "Kendrick Miles",
    ownerEmail: "kendrick.miles@example.com",
    plan: "Puppy Essentials",
    cadence: "Every 4 weeks",
    lastVisit: "Mar 22, 2025",
    nextVisit: "Apr 19, 2025",
    temperament: "Shy—groom with handler",
    alerts: ["Use lavender calming spray"],
    status: "New",
  },
  {
    id: "PET-176",
    name: "Pepper",
    species: "Dog",
    breed: "Mini Schnauzer",
    color: "Salt & Pepper",
    owner: "Noah Patel",
    ownerEmail: "noah.patel@example.com",
    plan: "Beard & Brows Club",
    cadence: "Every 3 weeks",
    lastVisit: "Mar 07, 2025",
    nextVisit: "Apr 01, 2025",
    temperament: "Alert—use slow approach",
    alerts: ["Check tear staining", "Sensitive ears"],
    status: "Paused",
  },
  {
    id: "PET-221",
    name: "Milo",
    species: "Cat",
    breed: "Ragdoll",
    color: "Seal Point",
    owner: "Ivy Collins",
    ownerEmail: "ivy.collins@example.com",
    plan: "Deluxe Bath",
    cadence: "Every 7 weeks",
    lastVisit: "Feb 18, 2025",
    nextVisit: "Apr 08, 2025",
    temperament: "Relaxed—purrs during blow-dry",
    alerts: ["Allergy: oat-based products"],
    status: "Active",
  },
  {
    id: "PET-208",
    name: "Atlas",
    species: "Dog",
    breed: "Great Pyrenees",
    color: "Cream",
    owner: "Serena Ibarra",
    ownerEmail: "serena.ibarra@example.com",
    plan: "Seasonal Shed Reset",
    cadence: "Every 10 weeks",
    lastVisit: "Jan 31, 2025",
    nextVisit: "Apr 10, 2025",
    temperament: "Gentle giant",
    alerts: ["Requires lift assistance", "Check hot spots"],
    status: "Active",
  },
  {
    id: "PET-219",
    name: "Juniper",
    species: "Dog",
    breed: "Australian Shepherd",
    color: "Blue Merle",
    owner: "Riley Brooks",
    ownerEmail: "riley.brooks@example.com",
    plan: "Agility Touch-Up",
    cadence: "Every 4 weeks",
    lastVisit: "Mar 19, 2025",
    nextVisit: "Apr 17, 2025",
    temperament: "Eager—starts with nail trim",
    alerts: ["Uses coconut oil paw balm"],
    status: "Loyal",
  },
];

export const careHighlights: CareHighlight[] = [
  {
    pet: "Luna",
    owner: "Maya Chen",
    summary: "Switched to chamomile rinse—coat soothed immediately.",
    timestamp: "Documented 3h ago",
    tag: "Spa",
  },
  {
    pet: "Zeus",
    owner: "Theo Ramirez",
    summary: "Extended blowout for deshedding; add 15m buffer next visit.",
    timestamp: "Updated yesterday",
    tag: "Grooming",
  },
  {
    pet: "Nori",
    owner: "Aliyah Reyes",
    summary: "Matting behind ears reduced with daily combing routine.",
    timestamp: "Shared 2d ago",
    tag: "Training",
  },
  {
    pet: "Atlas",
    owner: "Serena Ibarra",
    summary: "Vet cleared seasonal hot spots; apply aloe spray post-dry.",
    timestamp: "Logged 4d ago",
    tag: "Health",
  },
];

export const healthRecords: HealthRecord[] = [
  {
    pet: "Luna",
    owner: "Maya Chen",
    vaccines: [
      { label: "Rabies", status: "Complete", date: "Jan 05, 2025" },
      { label: "Bordetella", status: "Complete", date: "Feb 14, 2025" },
      { label: "Influenza", status: "Due", date: "Apr 20, 2025", notes: "Send reminder 14 days before" },
    ],
    allergies: ["Hypoallergenic only", "Avoid oatmeal"],
    vet: "Willow Glen Animal Clinic",
    lastExam: "Nov 2024",
  },
  {
    pet: "Zeus",
    owner: "Theo Ramirez",
    vaccines: [
      { label: "Rabies", status: "Complete", date: "Jul 19, 2024" },
      { label: "Bordetella", status: "Expired", date: "Mar 01, 2024", notes: "Overdue—follow up immediately" },
      { label: "Leptospirosis", status: "Due", date: "May 02, 2025" },
    ],
    allergies: ["Sensitive paw pads"],
    vet: "Summit Ridge Veterinary",
    lastExam: "Aug 2024",
  },
  {
    pet: "Nori",
    owner: "Aliyah Reyes",
    vaccines: [
      { label: "Rabies", status: "Complete", date: "Oct 12, 2024" },
      { label: "FVRCP", status: "Complete", date: "Sep 03, 2024" },
    ],
    allergies: ["Fragrance-free products"],
    vet: "SoMa Cat Collective",
    lastExam: "Jan 2025",
  },
  {
    pet: "Poppy",
    owner: "Kendrick Miles",
    vaccines: [
      { label: "Rabies", status: "Complete", date: "Feb 08, 2025" },
      { label: "Bordetella", status: "Due", date: "Apr 30, 2025", notes: "Coordinate with next visit" },
    ],
    allergies: ["Lavender calming spray only"],
    vet: "Harborview Veterinary",
    lastExam: "Feb 2025",
  },
];

export const careAlerts: CareAlert[] = [
  {
    pet: "Pepper",
    owner: "Noah Patel",
    alert: "Monitor ears for irritation—client reported scratching post-visit.",
    severity: "High",
    added: "Flagged Mar 29, 2025",
    followUp: "Call owner before Apr 1 appointment",
  },
  {
    pet: "Atlas",
    owner: "Serena Ibarra",
    alert: "Lift with two stylists; arthritis flare-up noted last session.",
    severity: "High",
    added: "Updated Mar 25, 2025",
    followUp: "Confirm support staff on schedule",
  },
  {
    pet: "Juniper",
    owner: "Riley Brooks",
    alert: "Add agility paw balm after nail trim to prevent cracking.",
    severity: "Medium",
    added: "Logged Mar 21, 2025",
    followUp: "Apply before release",
  },
  {
    pet: "Milo",
    owner: "Ivy Collins",
    alert: "Allergy to oat-based shampoos—double-check product shelf.",
    severity: "Medium",
    added: "Noted Mar 18, 2025",
    followUp: "Tag preferred products in inventory",
  },
];
