export const accountProfile = {
  owner: "Jordan Dean",
  role: "Owner & Operator",
  email: "jordan@scruffybutts21.com",
  phone: "(206) 555-0184",
  timezone: "Pacific Time (US & Canada)",
  languages: ["English", "Spanish"],
  createdAt: "2023-04-18",
  lastPasswordChange: "2025-09-12",
};

export const loginSecurity = {
  loginMethods: [
    {
      method: "Email + password",
      status: "Enforced for all team logins",
      lastUpdated: "2025-09-12",
    },
    {
      method: "Passkey (Face ID / Touch ID)",
      status: "Enabled for owners and managers",
      lastUpdated: "2025-08-03",
    },
    {
      method: "Time-based one-time password",
      status: "Required for Jordan Dean",
      lastUpdated: "2025-05-27",
    },
    {
      method: "SMS backup codes",
      status: "Disabled — replaced by authenticator app",
      lastUpdated: "2025-03-11",
    },
  ],
  securityPolicies: [
    {
      label: "Password rules",
      value: "Minimum 14 characters with a mix of upper, lower, number, and symbol.",
    },
    {
      label: "Session timeout",
      value: "Automatic sign-out after 45 minutes of inactivity.",
    },
    {
      label: "Device approvals",
      value: "New devices require passkey confirmation and manager approval.",
    },
  ],
  sessions: [
    {
      device: "MacBook Pro 14\"",
      system: "macOS 15.1",
      location: "Seattle, WA",
      ip: "73.11.244.18",
      lastActive: "Oct 28, 2025 • 8:41 PM PT",
      trusted: true,
    },
    {
      device: "iPhone 15 Pro",
      system: "iOS 18.0",
      location: "Tacoma, WA",
      ip: "73.11.244.18",
      lastActive: "Oct 29, 2025 • 7:12 AM PT",
      trusted: true,
    },
    {
      device: "Front desk iMac",
      system: "macOS 14.6",
      location: "Shop floor kiosk",
      ip: "10.20.14.42",
      lastActive: "Oct 25, 2025 • 5:06 PM PT",
      trusted: false,
    },
  ],
};

export const businessProfile = {
  legalName: "Scruffy Butts 21 LLC",
  doingBusinessAs: "Scruffy Butts Grooming Studio",
  brandTagline: "Precision grooming for Seattle's scruffiest pups.",
  phone: "(206) 555-0157",
  email: "hello@scruffybutts21.com",
  website: "https://scruffybutts21.com",
  location: {
    addressLine1: "4216 Greenwood Ave N",
    addressLine2: "Suite 200",
    city: "Seattle",
    state: "WA",
    postalCode: "98103",
  },
  hours: [
    { days: "Mon – Thu", open: "8:00 AM", close: "7:00 PM" },
    { days: "Fri", open: "8:00 AM", close: "6:00 PM" },
    { days: "Sat", open: "9:00 AM", close: "4:00 PM" },
  ],
  emergencyContact: {
    name: "Casey Nguyen",
    role: "Assistant Manager",
    phone: "(206) 555-0199",
  },
  policies: [
    {
      label: "Late arrivals",
      detail: "Appointments are held for 10 minutes before notifying the waitlist.",
    },
    {
      label: "Vaccination",
      detail: "Rabies and Bordetella certificates must be updated every 12 months.",
    },
    {
      label: "Cancellation",
      detail: "48-hour notice required; same-day cancellations incur a $45 fee.",
    },
  ],
};

export const serviceCatalog = [
  {
    category: "Bath & Brush",
    description: "Quick spruce-ups for regular clients.",
    services: [
      { name: "Basic Bath", duration: "45 min", price: "$48" },
      { name: "Deshedding Treatment", duration: "60 min", price: "$72" },
      { name: "Puppy Intro Bath", duration: "35 min", price: "$42" },
    ],
  },
  {
    category: "Full Groom",
    description: "Breed-specific cuts with coat styling.",
    services: [
      { name: "Small Breed Groom", duration: "90 min", price: "$96" },
      { name: "Doodle Sculpt", duration: "120 min", price: "$146" },
      { name: "Double Coat Reset", duration: "135 min", price: "$168" },
    ],
  },
  {
    category: "Add-ons",
    description: "Finishing touches and à la carte extras.",
    services: [
      { name: "Paw Balm Treatment", duration: "10 min", price: "$12" },
      { name: "Teeth Brushing", duration: "8 min", price: "$10" },
      { name: "Blueberry Facial", duration: "12 min", price: "$15" },
    ],
  },
];

export const notificationSettings = [
  {
    group: "Appointments",
    description: "Confirmations, reminders, and schedule changes for clients.",
    channels: {
      email: true,
      sms: true,
      push: false,
    },
    rules: "Reminders send 24 hours and 2 hours prior to visit.",
  },
  {
    group: "Waitlist",
    description: "Alerts when a slot opens so the team can respond quickly.",
    channels: {
      email: true,
      sms: false,
      push: true,
    },
    rules: "Escalate to push if no response within 10 minutes.",
  },
  {
    group: "Staff schedule",
    description: "Shift changes, approvals, and clock-in alerts.",
    channels: {
      email: true,
      sms: true,
      push: true,
    },
    rules: "Managers receive push immediately; groomers receive SMS during business hours.",
  },
  {
    group: "Finance",
    description: "Daily sales summary and payout confirmations.",
    channels: {
      email: true,
      sms: false,
      push: false,
    },
    rules: "Sales digest delivered at 9:05 PM PT each night.",
  },
  {
    group: "Client feedback",
    description: "Reviews, survey responses, and follow-ups that need attention.",
    channels: {
      email: true,
      sms: false,
      push: true,
    },
    rules: "Route 1-star reviews directly to Jordan with push priority.",
  },
];

export const integrations = [
  {
    name: "Square Terminal",
    description: "Syncs in-person payments and closes tickets at checkout.",
    status: "Live",
    connectedOn: "2024-02-18",
  },
  {
    name: "QuickBooks Online",
    description: "Posts daily journal entries to the Scruffy Butts ledger.",
    status: "Live",
    connectedOn: "2023-11-02",
  },
  {
    name: "Mailchimp",
    description: "Adds new grooming clients to the \"Welcome Wag\" automation.",
    status: "Syncing",
    connectedOn: "2025-04-29",
  },
  {
    name: "Zapier",
    description: "Triggers Slack alerts for VIP arrivals and overdue pickups.",
    status: "Paused",
    connectedOn: "2023-08-14",
  },
];

export const billing = {
  plan: {
    name: "Studio Plus",
    price: "$189 / month",
    seats: "10 team seats",
    features: [
      "Unlimited appointments and waitlist",
      "Integrated POS with inventory controls",
      "Advanced payroll exports",
      "Priority weekend support",
    ],
    renewalDate: "Nov 01, 2025",
  },
  paymentMethod: {
    brand: "Visa",
    last4: "1884",
    exp: "08 / 2027",
    billingEmail: "billing@scruffybutts21.com",
  },
  usage: {
    appointments: { used: 428, limit: 1200, label: "monthly slots" },
    smsCredits: { used: 918, limit: 1500, label: "credits" },
    storage: { used: 38, limit: 250, unit: "GB" },
  },
  invoices: [
    { id: "INV-4527", date: "Oct 01, 2025", amount: "$189.00", status: "Paid" },
    { id: "INV-4486", date: "Sep 01, 2025", amount: "$189.00", status: "Paid" },
    { id: "INV-4445", date: "Aug 01, 2025", amount: "$189.00", status: "Paid" },
  ],
};
