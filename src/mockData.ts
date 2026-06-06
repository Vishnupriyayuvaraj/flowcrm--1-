import { Workspace, Lead, Contact, Deal, Task, Activity } from './types';

export const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: 'ws-freelance',
    name: 'Personal Sandbox',
    plan: 'Free',
    ownerId: 'user-me',
    members: [
      { id: 'user-me', name: 'Alex Johnson', email: 'alex@flowcrm.app', role: 'Owner', status: 'Active', avatar: 'AJ' }
    ]
  },
  {
    id: 'ws-agency',
    name: 'Vortex Digital Agency',
    plan: 'Pro',
    ownerId: 'user-me',
    members: [
      { id: 'user-me', name: 'Alex Johnson', email: 'alex@flowcrm.app', role: 'Owner', status: 'Active', avatar: 'AJ' },
      { id: 'member-1', name: 'Sarah Miller', email: 'sarah@vortex.agency', role: 'Admin', status: 'Active', avatar: 'SM' },
      { id: 'member-2', name: 'David Carter', email: 'david@vortex.agency', role: 'Manager', status: 'Active', avatar: 'DC' },
      { id: 'member-3', name: 'Emily Chen', email: 'emily@vortex.agency', role: 'Member', status: 'Pending', avatar: 'EC' }
    ]
  },
  {
    id: 'ws-startup',
    name: 'SaaSify Inc.',
    plan: 'Business',
    ownerId: 'user-me',
    members: [
      { id: 'user-me', name: 'Alex Johnson', email: 'alex@flowcrm.app', role: 'Owner', status: 'Active', avatar: 'AJ' },
      { id: 'member-4', name: 'Marcus Sterling', email: 'marcus@saasify.io', role: 'Admin', status: 'Active', avatar: 'MS' },
      { id: 'member-5', name: 'Sophia Patel', email: 'sophia@saasify.io', role: 'Manager', status: 'Active', avatar: 'SP' }
    ]
  }
];

export const INITIAL_LEADS: Lead[] = [
  // --- Workspace: Personal Sandbox (ws-freelance) ---
  {
    id: 'lead-1',
    name: 'John Smith',
    email: 'john@smithdesign.co',
    phone: '+1 (555) 234-5678',
    company: 'Smith Design Co.',
    website: 'smithdesign.co',
    industry: 'Creative Design',
    address: '100 Sunset Blvd, Los Angeles, CA',
    status: 'Qualified',
    tags: ['Web Design', 'High Value'],
    value: 4500,
    score: 88,
    summary: 'John Smith is the founder of Smith Design Co. He is looking for a senior React freelancer to rebuild their client portfolio site with high-performance animations.',
    notes: [
      { id: 'n-1', content: 'Met at local tech meetup. Expressed interest in moving off WordPress.', author: 'Alex Johnson', createdAt: '2026-05-10T14:30:00Z' },
      { id: 'n-2', content: 'Sent portfolio links. He loved the interactive case studies.', author: 'Alex Johnson', createdAt: '2026-05-12T10:15:00Z' }
    ],
    activities: [
      { id: 'a-1', type: 'lead_created', description: 'Lead John Smith created from manual entry', timestamp: '2026-05-10T14:00:00Z', user: 'Alex Johnson' },
      { id: 'a-2', type: 'note_added', description: 'Added note about tech meetup introduction', timestamp: '2026-05-10T14:32:00Z', user: 'Alex Johnson' },
      { id: 'a-3', type: 'email_sent', description: 'Sent portfolio custom quote email', timestamp: '2026-05-12T10:15:00Z', user: 'Alex Johnson' }
    ],
    createdAt: '2026-05-10T14:00:00Z',
    workspaceId: 'ws-freelance',
    assignedTo: 'Alex Johnson'
  },
  {
    id: 'lead-2',
    name: 'Clara Oswald',
    email: 'clara@tardisconsulting.com',
    phone: '+1 (555) 876-5432',
    company: 'Tardis Consulting',
    website: 'tardisconsulting.com',
    industry: 'Consulting',
    address: '77 Westminster Rd, London, UK',
    status: 'New',
    tags: ['E-Commerce'],
    value: 2800,
    score: 64,
    summary: 'Clara is seeking an e-commerce integration expert to connect their Shopify storefront with internal analytical reporting tools.',
    notes: [],
    activities: [
      { id: 'a-4', type: 'lead_created', description: 'Inbound lead received via website form', timestamp: '2026-06-01T09:12:00Z', user: 'System' }
    ],
    createdAt: '2026-06-01T09:12:00Z',
    workspaceId: 'ws-freelance',
    assignedTo: 'Alex Johnson'
  },
  {
    id: 'lead-3',
    name: 'Robert Downey',
    email: 'robert@starklabs.com',
    phone: '+1 (555) 900-3000',
    company: 'Stark Labs',
    website: 'starklabs.com',
    industry: 'Engineering',
    address: '10880 Malibu Point, Malibu, CA',
    status: 'Proposal Sent',
    tags: ['SaaS', 'High Priority'],
    value: 9500,
    score: 94,
    summary: 'Robert Stark is looking to prototype an internal dashboard utility for modeling solar clean energy grid logs. Extremely high utility requirements, fast delivery.',
    notes: [
      { id: 'n-3', content: 'Reviewed technical requirements. He wants high security, standard authentication, and local indexing.', author: 'Alex Johnson', createdAt: '2026-05-20T16:00:00Z' },
      { id: 'n-4', content: 'Prepared customized blueprint proposal detailing timeline and tech stack (Vite + Tailind CSS).', author: 'Alex Johnson', createdAt: '2026-05-24T11:00:00Z' }
    ],
    activities: [
      { id: 'a-5', type: 'lead_created', description: 'Lead Robert Downey created from personal referral', timestamp: '2026-05-18T11:00:00Z', user: 'Alex Johnson' },
      { id: 'a-6', type: 'meeting_scheduled', description: 'Initial blueprint consultation scheduled for May 20', timestamp: '2026-05-18T11:05:00Z', user: 'Alex Johnson' },
      { id: 'a-7', type: 'lead_updated', description: 'Status changed to Proposal Sent', timestamp: '2026-05-24T11:02:00Z', user: 'Alex Johnson' }
    ],
    createdAt: '2026-05-18T11:00:00Z',
    workspaceId: 'ws-freelance',
    assignedTo: 'Alex Johnson'
  },

  // --- Workspace: Vortex Digital Agency (ws-agency) ---
  {
    id: 'lead-4',
    name: 'Sarah Connor',
    email: 'sconnor@cyberdyne.net',
    phone: '+1 (555) 835-1000',
    company: 'Cyberdyne Systems',
    website: 'cyberdyne.io',
    industry: 'Robotics',
    address: '400 Technology Way, San Jose, CA',
    status: 'Negotiation',
    tags: ['Enterprise', 'Rebranding'],
    value: 28000,
    score: 91,
    summary: 'Cyberdyne requires a global digital core rebrand, fully animated responsive framework, and complete social marketing kit spanning 6 months.',
    notes: [
      { id: 'n-5', content: 'Spoke with Sarah regarding security. Needs ISO-compliant developer clearances.', author: 'Sarah Miller', createdAt: '2026-04-12T10:00:00Z' },
      { id: 'n-6', content: 'Presented V2 of design package containing custom digital illustrations. She was highly impressed, wants to adjust retainer.', author: 'David Carter', createdAt: '2026-04-20T15:30:00Z' }
    ],
    activities: [
      { id: 'a-8', type: 'lead_created', description: 'Enterprise target created by David Carter', timestamp: '2026-04-05T09:00:00Z', user: 'David Carter' },
      { id: 'a-9', type: 'lead_updated', description: 'Status updated to Negotiation', timestamp: '2026-04-20T16:00:00Z', user: 'David Carter' }
    ],
    createdAt: '2026-04-05T09:00:00Z',
    workspaceId: 'ws-agency',
    assignedTo: 'David Carter'
  },
  {
    id: 'lead-5',
    name: 'Bruce Wayne',
    email: 'bwayne@wayneenterprises.com',
    phone: '+1 (555) 228-6268',
    company: 'Wayne Enterprises',
    website: 'wayneenterprises.com',
    industry: 'Defense & Tech',
    address: '1007 Mountain Drive, Gotham City, NJ',
    status: 'Won',
    tags: ['VIP', 'Mobile App'],
    value: 42000,
    score: 98,
    summary: 'Wayne Enterprises completed the contract for a critical secure communications helper app. Retainer active. Project moving into design validation.',
    notes: [
      { id: 'n-7', content: 'Bruce was brief but clear: high security, silent offline operations, biometric logs simulation.', author: 'Sarah Miller', createdAt: '2026-03-10T17:00:00Z' }
    ],
    activities: [
      { id: 'a-10', type: 'lead_created', description: 'VIP referral recorded', timestamp: '2026-03-01T08:00:00Z', user: 'Sarah Miller' },
      { id: 'a-11', type: 'lead_updated', description: 'Completed contract negotiations. Deal WON!', timestamp: '2026-03-25T11:00:00Z', user: 'Sarah Miller' }
    ],
    createdAt: '2026-03-01T08:00:00Z',
    workspaceId: 'ws-agency',
    assignedTo: 'Sarah Miller'
  },
  {
    id: 'lead-6',
    name: 'Diana Prince',
    email: 'diana@themuseum.org',
    phone: '+1 (555) 456-1122',
    company: 'National Antiquities Museum',
    website: 'themuseum.org',
    industry: 'Non-Profit / Education',
    address: 'Global',
    status: 'Contacted',
    tags: ['Interactive Map'],
    value: 12500,
    score: 72,
    summary: 'Proposal is underway for creating an immersive virtual tour showcase utilizing high-resolution artifacts mapping.',
    notes: [],
    activities: [
      { id: 'a-12', type: 'lead_created', description: 'Created lead', timestamp: '2026-05-28T09:00:00Z', user: 'David Carter' }
    ],
    createdAt: '2026-05-28T09:00:00Z',
    workspaceId: 'ws-agency',
    assignedTo: 'David Carter'
  },

  // --- Workspace: SaaSify Inc (ws-startup) ---
  {
    id: 'lead-7',
    name: 'Peter Parker',
    email: 'peter@dailybugle.com',
    phone: '+1 (555) 492-4910',
    company: 'Daily Bugle',
    website: 'dailybugle.com',
    industry: 'Media & Publishing',
    address: '39th Street, New York, NY',
    status: 'Proposal Sent',
    tags: ['API Integration', 'CMS'],
    value: 15000,
    score: 80,
    summary: 'The Bugle wants to license SaaSifys API for automated content optimization and news syndication dashboard triggers.',
    notes: [],
    activities: [
      { id: 'a-13', type: 'lead_created', description: 'Self-serve trial account registered', timestamp: '2026-05-22T08:00:00Z', user: 'System' }
    ],
    createdAt: '2026-05-22T08:00:00Z',
    workspaceId: 'ws-startup',
    assignedTo: 'Marcus Sterling'
  },
  {
    id: 'lead-8',
    name: 'Barry Allen',
    email: 'barry@star-labs.co',
    phone: '+1 (555) 888-3278',
    company: 'Star Laboratories',
    website: 'starlabs.co',
    industry: 'Scientific Research',
    address: 'Central City, KS',
    status: 'Won',
    tags: ['Enterprise Retainer'],
    value: 60000,
    score: 95,
    summary: 'Star Labs has authorized an enterprise annual license for full SaaSify cluster monitoring, real-time analytics streaming, and custom webhooks setups.',
    notes: [
      { id: 'n-8', content: 'Barry requested ultra-fast setup response. Promised 99.999% sandbox latency.', author: 'Marcus Sterling', createdAt: '2026-05-15T09:00:00Z' }
    ],
    activities: [
      { id: 'a-14', type: 'lead_created', description: 'Fast-tracked inbound enterprise target', timestamp: '2026-05-12T10:00:00Z', user: 'Marcus Sterling' },
      { id: 'a-15', type: 'lead_updated', description: 'Agreement locked in and signed online.', timestamp: '2026-05-18T15:00:00Z', user: 'Marcus Sterling' }
    ],
    createdAt: '2026-05-12T10:00:00Z',
    workspaceId: 'ws-startup',
    assignedTo: 'Marcus Sterling'
  }
];

export const INITIAL_CONTACTS: Contact[] = [
  // Sandbox
  { id: 'c-1', name: 'John Smith', email: 'john@smithdesign.co', phone: '+1 (555) 234-5678', company: 'Smith Design Co.', title: 'Creative Principal', industry: 'Creative Design', tags: ['Web Design'], createdAt: '2026-05-10T14:00:00Z', workspaceId: 'ws-freelance' },
  { id: 'c-2', name: 'Clara Oswald', email: 'clara@tardisconsulting.com', phone: '+1 (555) 876-5432', company: 'Tardis Consulting', title: 'Director', industry: 'Consulting', tags: ['E-Commerce'], createdAt: '2026-06-01T09:12:00Z', workspaceId: 'ws-freelance' },
  { id: 'c-3', name: 'Robert Downey', email: 'robert@starklabs.com', phone: '+1 (555) 900-3000', company: 'Stark Labs', title: 'Director of Clean Tech', industry: 'Engineering', tags: ['SaaS'], createdAt: '2026-05-18T11:00:00Z', workspaceId: 'ws-freelance' },
  
  // Agency
  { id: 'c-4', name: 'Sarah Connor', email: 'sconnor@cyberdyne.net', phone: '+1 (555) 835-1000', company: 'Cyberdyne Systems', title: 'Chief Ops Officer', industry: 'Robotics', tags: ['Enterprise'], createdAt: '2026-04-05T09:00:00Z', workspaceId: 'ws-agency' },
  { id: 'c-5', name: 'Bruce Wayne', email: 'bwayne@wayneenterprises.com', phone: '+1 (555) 228-6268', company: 'Wayne Enterprises', title: 'Benefactor / Chief Design Reviewer', industry: 'Defense & Tech', tags: ['VIP'], createdAt: '2026-03-01T08:00:00Z', workspaceId: 'ws-agency' },
  { id: 'c-6', name: 'Diana Prince', email: 'diana@themuseum.org', phone: '+1 (555) 456-1122', company: 'National Antiquities Museum', title: 'Curator', industry: 'Education', tags: ['Non-Profit'], createdAt: '2026-05-28T09:00:00Z', workspaceId: 'ws-agency' },
  
  // Startup
  { id: 'c-7', name: 'Peter Parker', email: 'peter@dailybugle.com', phone: '+1 (555) 492-4910', company: 'Daily Bugle', title: 'Technical Lead', industry: 'Media & Publishing', tags: ['API Integration'], createdAt: '2026-05-22T08:00:00Z', workspaceId: 'ws-startup' },
  { id: 'c-8', name: 'Barry Allen', email: 'barry@star-labs.co', phone: '+1 (555) 888-3278', company: 'Star Laboratories', title: 'System Security Lead', industry: 'Scientific Research', tags: ['Enterprise'], createdAt: '2026-05-12T10:00:00Z', workspaceId: 'ws-startup' }
];

export const INITIAL_DEALS: Deal[] = [
  // Sandbox
  { id: 'd-1', title: 'Portfolio React Rebuild', company: 'Smith Design Co.', value: 4500, stage: 'Qualified', probability: 80, closingDate: '2026-06-30', workspaceId: 'ws-freelance', leadId: 'lead-1', assignedTo: 'Alex Johnson' },
  { id: 'd-2', title: 'Solar Grid Dashboard Prototype', company: 'Stark Labs', value: 9500, stage: 'Proposal', probability: 90, closingDate: '2026-06-25', workspaceId: 'ws-freelance', leadId: 'lead-3', assignedTo: 'Alex Johnson' },
  { id: 'd-3', title: 'Integrate Shopify Analytics API', company: 'Tardis Consulting', value: 2800, stage: 'New', probability: 50, closingDate: '2026-07-15', workspaceId: 'ws-freelance', leadId: 'lead-2', assignedTo: 'Alex Johnson' },

  // Agency
  { id: 'd-4', title: 'Enterprise Global Rebrand', company: 'Cyberdyne Systems', value: 28000, stage: 'Negotiation', probability: 75, closingDate: '2026-08-01', workspaceId: 'ws-agency', leadId: 'lead-4', assignedTo: 'David Carter' },
  { id: 'd-5', title: 'Secure Comms Android App', company: 'Wayne Enterprises', value: 42000, stage: 'Won', probability: 100, closingDate: '2026-04-15', workspaceId: 'ws-agency', leadId: 'lead-5', assignedTo: 'Sarah Miller' },
  { id: 'd-6', title: 'Interactive Map Consultation', company: 'National Antiquities Museum', value: 12500, stage: 'New', probability: 30, closingDate: '2026-09-10', workspaceId: 'ws-agency', leadId: 'lead-6', assignedTo: 'David Carter' },

  // Startup
  { id: 'd-7', title: 'News Syndication API Licensing', company: 'Daily Bugle', value: 15000, stage: 'Proposal', probability: 60, closingDate: '2026-07-20', workspaceId: 'ws-startup', leadId: 'lead-7', assignedTo: 'Marcus Sterling' },
  { id: 'd-8', title: 'SaaSify Cluster Premium SLA', company: 'Star Laboratories', value: 60000, stage: 'Won', probability: 100, closingDate: '2026-05-22', workspaceId: 'ws-startup', leadId: 'lead-8', assignedTo: 'Marcus Sterling' }
];

export const INITIAL_TASKS: Task[] = [
  // Sandbox
  { id: 't-1', title: 'Send customized WordPress to React migration proposal', dueDate: '2026-06-10', status: 'Pending', type: 'Proposal', assignedTo: 'Alex Johnson', workspaceId: 'ws-freelance', associatedWith: { type: 'lead', id: 'lead-1', name: 'John Smith' } },
  { id: 't-2', title: 'Introductory Call with Barry Allen regarding cluster specs', dueDate: '2026-06-04', status: 'Completed', type: 'Call', assignedTo: 'Alex Johnson', workspaceId: 'ws-freelance', associatedWith: { type: 'lead', id: 'lead-3', name: 'Robert Downey' } },
  { id: 't-3', title: 'Follow up on Stark Labs dashboard draft', dueDate: '2026-06-08', status: 'Pending', type: 'Follow-up', assignedTo: 'Alex Johnson', workspaceId: 'ws-freelance', associatedWith: { type: 'lead', id: 'lead-3', name: 'Robert Downey' } },

  // Agency
  { id: 't-4', title: 'Discuss cyber-security ISO requirements with CIO', dueDate: '2026-06-15', status: 'In Progress', type: 'Meeting', assignedTo: 'Sarah Miller', workspaceId: 'ws-agency', associatedWith: { type: 'lead', id: 'lead-4', name: 'Sarah Connor' } },
  { id: 't-5', title: 'Prepare Wayne Enterprises design onboarding materials', dueDate: '2026-05-30', status: 'Completed', type: 'Proposal', assignedTo: 'Sarah Miller', workspaceId: 'ws-agency', associatedWith: { type: 'lead', id: 'lead-5', name: 'Bruce Wayne' } },
  { id: 't-6', title: 'Schedule exploration demo to display interactive mock maps', dueDate: '2026-06-14', status: 'Pending', type: 'Call', assignedTo: 'David Carter', workspaceId: 'ws-agency', associatedWith: { type: 'lead', id: 'lead-6', name: 'Diana Prince' } },

  // Startup
  { id: 't-7', title: 'Clarify API request volume expectations with Peter Parker', dueDate: '2026-06-12', status: 'Pending', type: 'Meeting', assignedTo: 'Marcus Sterling', workspaceId: 'ws-startup', associatedWith: { type: 'lead', id: 'lead-7', name: 'Peter Parker' } },
  { id: 't-8', title: 'Deliver onboarding keys & provision cluster nodes', dueDate: '2026-05-24', status: 'Completed', type: 'Follow-up', assignedTo: 'Marcus Sterling', workspaceId: 'ws-startup', associatedWith: { type: 'lead', id: 'lead-8', name: 'Barry Allen' } }
];
