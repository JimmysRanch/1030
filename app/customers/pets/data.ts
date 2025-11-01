export type PetStatus = "Active" | "Paused" | "New" | "Loyal";

export type AttachmentType = "photo" | "video" | "audio" | "document";

export interface PetJournalAttachment {
  type: AttachmentType;
  label: string;
}

export interface PetJournalEntry {
  id: string;
  date: string;
  service: string;
  stylist: string;
  note: string;
  mood: string;
  attachments: PetJournalAttachment[];
}

export interface PetTimelineEvent {
  id: string;
  date: string;
  title: string;
  summary: string;
  tags: string[];
}

export interface PetGalleryItem {
  id: string;
  thumbnail: string;
  caption: string;
  capturedAt: string;
  shareTargets: string[];
}

export interface VaccineRecord {
  label: string;
  status: "Complete" | "Due" | "Expired";
  date: string;
  notes?: string;
}

export interface PetDetail {
  id: string;
  name: string;
  species: "Dog" | "Cat" | "Other";
  breed: string;
  color: string;
  plan: string;
  cadence: string;
  status: PetStatus;
  temperament: string;
  lastVisit: string;
  nextVisit: string;
  favoriteNotes: string[];
  rebookSummary: string;
  lastAppointment: string;
  smartNotes: {
    pinned: string;
    entries: PetJournalEntry[];
  };
  timeline: PetTimelineEvent[];
  gallery: PetGalleryItem[];
  vaccines: VaccineRecord[];
}

export interface ClientMessage {
  id: string;
  author: "client" | "staff";
  channel: "SMS" | "Email" | "Portal";
  body: string;
  timestamp: string;
}

export interface StaffNote {
  id: string;
  author: string;
  createdAt: string;
  content: string;
  category: string;
  pinned?: boolean;
}

export interface ClientProfile {
  id: string;
  slug: string;
  name: string;
  email: string;
  phone: string;
  membershipSince: string;
  favoriteGroomer: string;
  address: string;
  stats: {
    totalVisits: number;
    averageSpend: string;
    lifetimeValue: string;
    visitFrequency: string;
  };
  quickActions: string[];
  socialChannels: string[];
  messageHistory: ClientMessage[];
  privateNotes: StaffNote[];
  pets: PetDetail[];
}

export const clientProfiles: ClientProfile[] = [
  {
    id: "CLIENT-1203",
    slug: "maya-chen",
    name: "Maya Chen",
    email: "maya.chen@example.com",
    phone: "(650) 555-0198",
    membershipSince: "August 2019",
    favoriteGroomer: "Ava Serrano",
    address: "Mountain View, California",
    stats: {
      totalVisits: 48,
      averageSpend: "$132",
      lifetimeValue: "$6,336",
      visitFrequency: "Every 5 weeks",
    },
    quickActions: [
      "Add Pet",
      "Book Appointment",
      "Send Message",
      "View History",
      "Share Update",
    ],
    socialChannels: ["Instagram", "Facebook", "Client Portal"],
    messageHistory: [
      {
        id: "maya-msg-002",
        author: "client",
        channel: "SMS",
        body: "Thanks! She's been so calm after the last appointment.",
        timestamp: "Apr 3, 2025 • 2:25 PM",
      },
      {
        id: "maya-msg-001",
        author: "staff",
        channel: "SMS",
        body: "Luna's chamomile rinse is ready for pickup with your next visit.",
        timestamp: "Apr 3, 2025 • 2:18 PM",
      },
      {
        id: "maya-msg-003",
        author: "staff",
        channel: "Email",
        body: "Reminder: Luna is due for her Influenza vaccine on Apr 20.",
        timestamp: "Mar 28, 2025 • 9:04 AM",
      },
    ],
    privateNotes: [
      {
        id: "maya-note-001",
        author: "Ava Serrano",
        createdAt: "Mar 14, 2025",
        content:
          "Always finish with chamomile calming mist. Client loves receiving a recap photo for Instagram stories.",
        category: "Grooming",
        pinned: true,
      },
      {
        id: "maya-note-002",
        author: "Jordan Park",
        createdAt: "Feb 02, 2025",
        content:
          "Luna relaxes faster if we start with the paw balm massage before brushing.",
        category: "Behavior",
      },
      {
        id: "maya-note-003",
        author: "Front Desk",
        createdAt: "Dec 18, 2024",
        content:
          "Prefers text confirmations over email. Confirmed card on file for automatic checkout.",
        category: "Preferences",
      },
    ],
    pets: [
      {
        id: "PET-201",
        name: "Luna",
        species: "Dog",
        breed: "Goldendoodle",
        color: "Apricot",
        plan: "VIP Grooming",
        cadence: "Every 5 weeks",
        status: "Active",
        temperament: "Calm, loves warm towels",
        lastVisit: "Mar 12, 2025",
        nextVisit: "Apr 16, 2025",
        favoriteNotes: [
          "Sensitive skin",
          "Hypoallergenic shampoo",
          "Hand dry around ears",
        ],
        rebookSummary:
          "Full luxury groom with paw balm, blueberry facial, and chamomile rinse.",
        lastAppointment: "Mar 12, 2025 • Ava Serrano",
        smartNotes: {
          pinned:
            "Always use hypoallergenic shampoo and lukewarm water only—calms her skin instantly.",
          entries: [
            {
              id: "luna-journal-001",
              date: "Mar 12, 2025",
              service: "VIP Grooming",
              stylist: "Ava Serrano",
              mood: "Relaxed",
              note:
                "Coat brushed out easily after pre-appointment combing routine. Applied chamomile rinse and paw balm.",
              attachments: [
                { type: "photo", label: "Before & After" },
                { type: "audio", label: "Calming reminder" },
              ],
            },
            {
              id: "luna-journal-002",
              date: "Feb 05, 2025",
              service: "VIP Grooming",
              stylist: "Jordan Park",
              mood: "Content",
              note:
                "Introduced coconut paw balm—client loved the scent and asked to continue.",
              attachments: [
                { type: "photo", label: "Styled ears" },
                { type: "video", label: "Dryer setup" },
              ],
            },
          ],
        },
        timeline: [
          {
            id: "luna-timeline-001",
            date: "Apr 16, 2025",
            title: "Auto rebook confirmed",
            summary:
              "Appointment duplicated from Mar 12 visit with all preferred add-ons pre-selected for the team.",
            tags: ["Auto Rebook", "VIP Plan"],
          },
          {
            id: "luna-timeline-002",
            date: "Mar 12, 2025",
            title: "Chamomile rinse success",
            summary:
              "New rinse formula reduced redness—flagged for future visits and added to client favorites.",
            tags: ["Care Win"],
          },
        ],
        gallery: [
          {
            id: "luna-gallery-001",
            thumbnail:
              "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80",
            caption: "Fresh trim with chamomile finish",
            capturedAt: "Mar 12, 2025",
            shareTargets: ["Instagram", "Client Portal"],
          },
          {
            id: "luna-gallery-002",
            thumbnail:
              "https://images.unsplash.com/photo-1558944351-c37e1ac5b1f5?auto=format&fit=crop&w=600&q=80",
            caption: "Before & after paw balm treatment",
            capturedAt: "Feb 05, 2025",
            shareTargets: ["Facebook", "Client Portal"],
          },
        ],
        vaccines: [
          { label: "Rabies", status: "Complete", date: "Jan 05, 2025" },
          { label: "Bordetella", status: "Complete", date: "Feb 14, 2025" },
          {
            label: "Influenza",
            status: "Due",
            date: "Apr 20, 2025",
            notes: "Send reminder 14 days before due date",
          },
        ],
      },
    ],
  },
  {
    id: "CLIENT-1278",
    slug: "aliyah-reyes",
    name: "Aliyah Reyes",
    email: "aliyah.reyes@example.com",
    phone: "(415) 555-0136",
    membershipSince: "May 2021",
    favoriteGroomer: "Noemi Flores",
    address: "San Francisco, California",
    stats: {
      totalVisits: 22,
      averageSpend: "$108",
      lifetimeValue: "$2,376",
      visitFrequency: "Every 6 weeks",
    },
    quickActions: [
      "Add Pet",
      "Book Appointment",
      "Send Message",
      "Add Staff Note",
      "Share Update",
    ],
    socialChannels: ["Instagram", "TikTok"],
    messageHistory: [
      {
        id: "aliyah-msg-002",
        author: "staff",
        channel: "Portal",
        body: "Absolutely! Adding a reminder to our prep checklist for next visit.",
        timestamp: "Mar 30, 2025 • 11:30 AM",
      },
      {
        id: "aliyah-msg-001",
        author: "client",
        channel: "Portal",
        body: "Can we keep Nori's mane extra fluffy for her birthday shoot?",
        timestamp: "Mar 30, 2025 • 11:22 AM",
      },
      {
        id: "aliyah-msg-003",
        author: "staff",
        channel: "Email",
        body: "Nori's matting behind the ears has improved—keep up the daily comb routine!",
        timestamp: "Mar 18, 2025 • 6:45 PM",
      },
    ],
    privateNotes: [
      {
        id: "aliyah-note-001",
        author: "Noemi Flores",
        createdAt: "Mar 18, 2025",
        content:
          "Always schedule a quieter room—Nori is noise sensitive. Client appreciates a post-visit video recap.",
        category: "Environment",
        pinned: true,
      },
      {
        id: "aliyah-note-002",
        author: "Front Desk",
        createdAt: "Jan 12, 2025",
        content: "Prefers mid-morning appointments after daycare drop-off.",
        category: "Scheduling",
      },
    ],
    pets: [
      {
        id: "PET-205",
        name: "Nori",
        species: "Cat",
        breed: "Maine Coon",
        color: "Silver Tabby",
        plan: "Signature Groom",
        cadence: "Every 6 weeks",
        status: "Loyal",
        temperament: "Talkative, tolerates bathing",
        lastVisit: "Mar 04, 2025",
        nextVisit: "Apr 15, 2025",
        favoriteNotes: [
          "Prefers quiet room",
          "Matting behind ears",
          "Use wide-tooth comb",
        ],
        rebookSummary:
          "Signature groom with extra focus behind the ears and fluff finish for photo session.",
        lastAppointment: "Mar 04, 2025 • Noemi Flores",
        smartNotes: {
          pinned:
            "Pin and fluff mane with diffuser on low—client loves the volume for photos.",
          entries: [
            {
              id: "nori-journal-001",
              date: "Mar 04, 2025",
              service: "Signature Groom",
              stylist: "Noemi Flores",
              mood: "Chirpy",
              note:
                "Matting reduced after client followed daily comb schedule. Applied fragrance-free finishing spray.",
              attachments: [
                { type: "photo", label: "Birthday fluff" },
                { type: "video", label: "Comb technique" },
              ],
            },
            {
              id: "nori-journal-002",
              date: "Jan 23, 2025",
              service: "Signature Groom",
              stylist: "Noemi Flores",
              mood: "Curious",
              note:
                "Introduced calming playlist—kept the grooming table time under 45 minutes with zero stress cues.",
              attachments: [
                { type: "audio", label: "Playlist clip" },
              ],
            },
          ],
        },
        timeline: [
          {
            id: "nori-timeline-001",
            date: "Apr 15, 2025",
            title: "Pre-birthday styling queued",
            summary:
              "Auto-loaded notes from March visit with extra fluff reminder highlighted for the team.",
            tags: ["Auto Rebook", "Photo Session"],
          },
          {
            id: "nori-timeline-002",
            date: "Mar 04, 2025",
            title: "Quiet room protocol",
            summary:
              "Booked private suite with white-noise machine—behavioral notes flagged for all stylists.",
            tags: ["Behavior", "Care Win"],
          },
        ],
        gallery: [
          {
            id: "nori-gallery-001",
            thumbnail:
              "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=600&q=80",
            caption: "Birthday blowout preview",
            capturedAt: "Mar 04, 2025",
            shareTargets: ["Instagram", "TikTok"],
          },
          {
            id: "nori-gallery-002",
            thumbnail:
              "https://images.unsplash.com/photo-1507149833265-60c372daea22?auto=format&fit=crop&w=600&q=80",
            caption: "Fluffed tail feature",
            capturedAt: "Jan 23, 2025",
            shareTargets: ["Client Portal"],
          },
        ],
        vaccines: [
          { label: "Rabies", status: "Complete", date: "Oct 12, 2024" },
          { label: "FVRCP", status: "Complete", date: "Sep 03, 2024" },
          {
            label: "Feline Leukemia",
            status: "Due",
            date: "Jun 18, 2025",
            notes: "Confirm with vet if booster required",
          },
        ],
      },
    ],
  },
  {
    id: "CLIENT-1341",
    slug: "kendrick-miles",
    name: "Kendrick Miles",
    email: "kendrick.miles@example.com",
    phone: "(408) 555-0140",
    membershipSince: "January 2024",
    favoriteGroomer: "Theo Alvarez",
    address: "San Jose, California",
    stats: {
      totalVisits: 11,
      averageSpend: "$94",
      lifetimeValue: "$1,034",
      visitFrequency: "Every 4 weeks",
    },
    quickActions: [
      "Add Pet",
      "Book Appointment",
      "Send Message",
      "View History",
      "Share Update",
    ],
    socialChannels: ["Instagram", "Facebook"],
    messageHistory: [
      {
        id: "kendrick-msg-003",
        author: "staff",
        channel: "Portal",
        body: "We pinned lavender calming spray to Poppy's favorites for quick reference.",
        timestamp: "Mar 23, 2025 • 9:12 AM",
      },
      {
        id: "kendrick-msg-002",
        author: "client",
        channel: "SMS",
        body: "Thank you! She smelled amazing and slept through the night.",
        timestamp: "Mar 22, 2025 • 6:02 PM",
      },
      {
        id: "kendrick-msg-001",
        author: "staff",
        channel: "SMS",
        body: "Poppy's first spa day went great—sharing her favorite notes now!",
        timestamp: "Mar 22, 2025 • 4:40 PM",
      },
    ],
    privateNotes: [
      {
        id: "kendrick-note-001",
        author: "Theo Alvarez",
        createdAt: "Mar 22, 2025",
        content:
          "Use lavender calming spray when Poppy arrives. Allow owner to stay for first five minutes.",
        category: "Behavior",
        pinned: true,
      },
      {
        id: "kendrick-note-002",
        author: "Front Desk",
        createdAt: "Feb 18, 2025",
        content: "Prefers quick text updates over email. Rebook before client leaves.",
        category: "Communication",
      },
    ],
    pets: [
      {
        id: "PET-214",
        name: "Poppy",
        species: "Dog",
        breed: "Cavalier King Charles",
        color: "Ruby",
        plan: "Puppy Essentials",
        cadence: "Every 4 weeks",
        status: "New",
        temperament: "Shy—groom with handler",
        lastVisit: "Mar 22, 2025",
        nextVisit: "Apr 19, 2025",
        favoriteNotes: [
          "Use lavender calming spray",
          "Owner stays for first 5 minutes",
          "Hand dry around face",
        ],
        rebookSummary:
          "Puppy essentials with gentle introduction to clippers and extra cuddle break.",
        lastAppointment: "Mar 22, 2025 • Theo Alvarez",
        smartNotes: {
          pinned:
            "Groom with handler nearby for first five minutes; give treat before nail trim begins.",
          entries: [
            {
              id: "poppy-journal-001",
              date: "Mar 22, 2025",
              service: "Puppy Essentials",
              stylist: "Theo Alvarez",
              mood: "Shy",
              note:
                "Responded well to lavender spray. Added cuddle break between bath and dryer.",
              attachments: [
                { type: "photo", label: "First trim" },
                { type: "video", label: "Gentle dryer clip" },
              ],
            },
            {
              id: "poppy-journal-002",
              date: "Feb 24, 2025",
              service: "Puppy Orientation",
              stylist: "Theo Alvarez",
              mood: "Curious",
              note:
                "Practice visit with no tools—just desensitization. Recorded a voice memo for future stylists.",
              attachments: [
                { type: "audio", label: "Orientation recap" },
              ],
            },
          ],
        },
        timeline: [
          {
            id: "poppy-timeline-001",
            date: "Apr 19, 2025",
            title: "Rebook with calming protocol",
            summary:
              "Auto-loaded orientation notes so client doesn't need to repeat preferences.",
            tags: ["Auto Rebook", "Puppy Plan"],
          },
          {
            id: "poppy-timeline-002",
            date: "Mar 22, 2025",
            title: "First full groom completed",
            summary:
              "Documented treat schedule and cuddle break timing for the whole team.",
            tags: ["Milestone", "Behavior"],
          },
        ],
        gallery: [
          {
            id: "poppy-gallery-001",
            thumbnail:
              "https://images.unsplash.com/photo-1619983081593-ec39d7d9960c?auto=format&fit=crop&w=600&q=80",
            caption: "First trim celebration",
            capturedAt: "Mar 22, 2025",
            shareTargets: ["Instagram Stories", "Facebook"],
          },
          {
            id: "poppy-gallery-002",
            thumbnail:
              "https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=600&q=80",
            caption: "Post-groom cuddle",
            capturedAt: "Feb 24, 2025",
            shareTargets: ["Client Portal"],
          },
        ],
        vaccines: [
          { label: "Rabies", status: "Complete", date: "Feb 08, 2025" },
          {
            label: "Bordetella",
            status: "Due",
            date: "Apr 30, 2025",
            notes: "Coordinate with next visit",
          },
        ],
      },
    ],
  },
  {
    id: "CLIENT-1410",
    slug: "serena-ibarra",
    name: "Serena Ibarra",
    email: "serena.ibarra@example.com",
    phone: "(925) 555-0174",
    membershipSince: "October 2018",
    favoriteGroomer: "Marco Singh",
    address: "Walnut Creek, California",
    stats: {
      totalVisits: 62,
      averageSpend: "$148",
      lifetimeValue: "$9,176",
      visitFrequency: "Every 10 weeks",
    },
    quickActions: [
      "Add Pet",
      "Book Appointment",
      "Send Message",
      "Add Staff Note",
      "Share Update",
    ],
    socialChannels: ["Instagram", "Pinterest", "Client Portal"],
    messageHistory: [
      {
        id: "serena-msg-002",
        author: "client",
        channel: "Email",
        body: "Thank you for the update. Appreciate the extra care with his hips.",
        timestamp: "Mar 25, 2025 • 9:01 AM",
      },
      {
        id: "serena-msg-001",
        author: "staff",
        channel: "Email",
        body: "Atlas' arthritis flag is on file—two stylists scheduled for lift assist.",
        timestamp: "Mar 25, 2025 • 7:52 AM",
      },
      {
        id: "serena-msg-003",
        author: "staff",
        channel: "SMS",
        body: "We uploaded today's before-and-after shots to your portal for easy sharing!",
        timestamp: "Jan 31, 2025 • 5:40 PM",
      },
    ],
    privateNotes: [
      {
        id: "serena-note-001",
        author: "Marco Singh",
        createdAt: "Jan 31, 2025",
        content:
          "Atlas needs two stylists to lift onto table. Focus on hot spots near hips; follow up with aloe spray.",
        category: "Health",
        pinned: true,
      },
      {
        id: "serena-note-002",
        author: "Front Desk",
        createdAt: "Nov 20, 2024",
        content: "Send social-ready photos after each visit—client shares on Pinterest.",
        category: "Social",
      },
    ],
    pets: [
      {
        id: "PET-208",
        name: "Atlas",
        species: "Dog",
        breed: "Great Pyrenees",
        color: "Cream",
        plan: "Seasonal Shed Reset",
        cadence: "Every 10 weeks",
        status: "Active",
        temperament: "Gentle giant",
        lastVisit: "Jan 31, 2025",
        nextVisit: "Apr 10, 2025",
        favoriteNotes: [
          "Requires lift assistance",
          "Check hot spots",
          "Apply aloe spray",
        ],
        rebookSummary:
          "Seasonal shed reset with double coat deshed and aloe hot-spot treatment.",
        lastAppointment: "Jan 31, 2025 • Marco Singh",
        smartNotes: {
          pinned:
            "Two stylists for table transfer; focus dryer on low heat near hips to avoid flare-ups.",
          entries: [
            {
              id: "atlas-journal-001",
              date: "Jan 31, 2025",
              service: "Seasonal Shed Reset",
              stylist: "Marco Singh",
              mood: "Sleepy",
              note:
                "Applied aloe spray post-dry and massaged hip joints for circulation. Documented lift technique for new staff.",
              attachments: [
                { type: "video", label: "Lift assist" },
                { type: "photo", label: "Deshed result" },
              ],
            },
            {
              id: "atlas-journal-002",
              date: "Nov 18, 2024",
              service: "Seasonal Shed Reset",
              stylist: "Marco Singh",
              mood: "Content",
              note:
                "Hot spots reduced after introducing aloe spray. Client requested printable progress timeline.",
              attachments: [
                { type: "document", label: "Vet clearance" },
              ],
            },
          ],
        },
        timeline: [
          {
            id: "atlas-timeline-001",
            date: "Apr 10, 2025",
            title: "Lift assist confirmed",
            summary:
              "Scheduler blocked two stylists and flagged aloe treatment reminder for post-dry routine.",
            tags: ["Health", "Team Note"],
          },
          {
            id: "atlas-timeline-002",
            date: "Jan 31, 2025",
            title: "Aloe protocol updated",
            summary:
              "Follow-up alert created for staff to check hip hot spots with vet photos attached.",
            tags: ["Care Win", "Health"],
          },
        ],
        gallery: [
          {
            id: "atlas-gallery-001",
            thumbnail:
              "https://images.unsplash.com/photo-1507149833265-60c372daea22?auto=format&fit=crop&w=600&q=80",
            caption: "Deshed coat reveal",
            capturedAt: "Jan 31, 2025",
            shareTargets: ["Pinterest", "Instagram"],
          },
          {
            id: "atlas-gallery-002",
            thumbnail:
              "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=600&q=80",
            caption: "Post-groom lounge",
            capturedAt: "Nov 18, 2024",
            shareTargets: ["Client Portal"],
          },
        ],
        vaccines: [
          { label: "Rabies", status: "Complete", date: "Jul 19, 2024" },
          {
            label: "Bordetella",
            status: "Expired",
            date: "Mar 01, 2024",
            notes: "Overdue—follow up immediately",
          },
          { label: "Leptospirosis", status: "Due", date: "May 02, 2025" },
        ],
      },
    ],
  },
];

export function getClientProfile(slug: string) {
  return clientProfiles.find(client => client.slug === slug);
}
