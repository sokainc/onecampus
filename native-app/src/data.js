/* ─────────── CLOUDINARY (free image hosting for feed photos, unsigned upload) ─────────── */
const CLOUDINARY_CLOUD_NAME = 'dclt0qybu';        // from the Cloudinary dashboard
const CLOUDINARY_UPLOAD_PRESET = 'one campus';    // unsigned upload preset

/* ─────────── PUSH NOTIFICATIONS (client-side, no server needed) ───────────
   The sender's phone reads the recipient's Expo push token and asks Expo to
   deliver the notification — so it works even when the recipient's app is closed.
   Upgrade path: move this to a Firebase Cloud Function once on the Blaze plan. */
const EAS_PROJECT_ID = '9c104cf3-538a-4a62-993d-018c35693c9a';
const EXPO_PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send';

/* ─────────── DATA ─────────── */
const PURDUE_CLUBS = [
  { name: 'Purdue Hackers', tag: 'TECH', desc: 'Build, ship, repeat. Weekly hackathons & workshops at WALC.', members: 847, location: 'WALC 1055', colors: ['#FF1744', '#FF4081'] },
  { name: 'NSBE Purdue', tag: 'ENGINEERING', desc: 'National Society of Black Engineers — empower & excel.', members: 312, location: 'ARMS 1010', colors: ['#7C3AED', '#A855F7'] },
  { name: 'SWE Purdue', tag: 'ENGINEERING', desc: 'Society of Women Engineers — breaking barriers daily.', members: 421, location: 'PMU Rm 226', colors: ['#0EA5E9', '#38BDF8'] },
  { name: 'Boilermaker Invest Club', tag: 'BUSINESS', desc: 'Manage a real $50k student-run investment portfolio.', members: 156, location: 'Rawls 1071', colors: ['#10B981', '#34D399'] },
  { name: 'Purdue Robotics Team', tag: 'TECH', desc: 'Design & build competition robots. VEX & FRC.', members: 234, location: 'ME Building 164', colors: ['#F59E0B', '#FCD34D'] },
  { name: 'Pre-Med Society', tag: 'SCIENCE', desc: 'MCAT prep, shadowing hours, and med school networking.', members: 567, location: 'LILLY B01', colors: ['#EF4444', '#F87171'] },
  { name: 'Purdue Club Soccer', tag: 'SPORTS', desc: 'Competitive & rec soccer — tryouts every fall.', members: 380, location: 'TREC Fields', colors: ['#0EA5E9', '#38BDF8'] },
  { name: 'Boiler Barbell', tag: 'SPORTS', desc: 'Powerlifting crew at the CoRec. All levels welcome.', members: 264, location: 'CoRec Weight Room', colors: ['#FF1744', '#FF4081'] },
  { name: 'Purdue Theatre Co.', tag: 'ARTS', desc: 'Student-run productions every semester.', members: 142, location: 'PAO Hall', colors: ['#7C3AED', '#A855F7'] },
  { name: 'Hello Walk Singers', tag: 'ARTS', desc: 'A cappella group performing across campus & beyond.', members: 96, location: 'Elliott Hall', colors: ['#F59E0B', '#FCD34D'] },
];

const CAMPUSES = {
  purdue: { name: 'Purdue', emoji: '🚂', free: true, clubs: PURDUE_CLUBS },
  iu: { name: 'IU Bloomington', emoji: '🔴', clubs: [
    { name: 'IU Computing Club', tag: 'TECH', desc: 'Hoosier hackers — workshops & tech talks at Luddy Hall.', members: 612, location: 'Luddy Hall 1106', colors: ['#FF1744', '#FF4081'] },
    { name: 'Kelley Consulting Club', tag: 'BUSINESS', desc: 'Real consulting projects for real clients.', members: 289, location: 'Hodge Hall 2055', colors: ['#10B981', '#34D399'] },
    { name: 'IU Dance Marathon', tag: 'ARTS', desc: 'The largest student org at IU — 36 hours for Riley Kids.', members: 1043, location: 'IMU Alumni Hall', colors: ['#7C3AED', '#A855F7'] },
    { name: 'Little 500 Cycling', tag: 'SPORTS', desc: 'Train for the legendary Little 500 bike race.', members: 198, location: 'Bill Armstrong Stadium', colors: ['#EF4444', '#F87171'] },
  ]},
  nd: { name: 'Notre Dame', emoji: '☘️', clubs: [
    { name: 'ND Robotics', tag: 'TECH', desc: 'Irish engineering — build robots for national competitions.', members: 156, location: 'Stinson-Remick Hall', colors: ['#7C3AED', '#A855F7'] },
    { name: 'SIBC', tag: 'BUSINESS', desc: 'Student International Business Council — largest club at ND.', members: 890, location: 'Mendoza College', colors: ['#10B981', '#34D399'] },
    { name: 'Bengal Bouts', tag: 'SPORTS', desc: 'Legendary charity boxing tournament since 1931.', members: 320, location: 'Joyce Center', colors: ['#FF1744', '#FF4081'] },
  ]},
  butler: { name: 'Butler', emoji: '🐶', clubs: [
    { name: 'Butler Esports', tag: 'TECH', desc: 'Varsity-level gaming in a dedicated esports arena.', members: 210, location: 'Esports Park', colors: ['#F59E0B', '#FCD34D'] },
    { name: 'Bulldogs Investment Group', tag: 'BUSINESS', desc: 'Manage a live student investment fund.', members: 98, location: 'Lacy School', colors: ['#10B981', '#34D399'] },
  ]},
  ballstate: { name: 'Ball State', emoji: '🐦', clubs: [
    { name: 'BSU Game Dev Club', tag: 'TECH', desc: 'Design & ship indie games every semester.', members: 145, location: 'Robert Bell 109', colors: ['#FF1744', '#FF4081'] },
    { name: 'Cardinal Filmworks', tag: 'ARTS', desc: 'Student films from script to screening.', members: 88, location: 'Letterman Building', colors: ['#0EA5E9', '#38BDF8'] },
  ]},
  rose: { name: 'Rose-Hulman', emoji: '🌹', clubs: [
    { name: 'Rose Robotics', tag: 'TECH', desc: 'Top-ranked engineering school\'s battle bot team.', members: 110, location: 'Branam Innovation Ctr', colors: ['#7C3AED', '#A855F7'] },
    { name: 'Rose Drone Club', tag: 'TECH', desc: 'Build & race FPV drones with fellow engineers.', members: 67, location: 'Kremer Innovation Ctr', colors: ['#F59E0B', '#FCD34D'] },
  ]},
  iupui: { name: 'IUPUI', emoji: '🏙️', clubs: [
    { name: 'Jags Hack Club', tag: 'TECH', desc: 'Downtown Indy hackathons & startup nights.', members: 230, location: 'Informatics Bldg', colors: ['#FF1744', '#FF4081'] },
    { name: 'IUPUI Pre-Med Assoc.', tag: 'SCIENCE', desc: 'Next to IU School of Medicine — shadowing galore.', members: 410, location: 'Science Building', colors: ['#EF4444', '#F87171'] },
  ]},
};

const INITIAL_EVENTS = [
  { name: 'Hack Purdue Kickoff', time: '7:00', ampm: 'PM', location: 'WALC 1055', badge: 'live', color: '#FF1744', day: 0 },
  { name: 'Engineering Career Fair', time: '10:00', ampm: 'AM', location: 'PMU Ballrooms', badge: 'today', color: '#7C3AED', day: 0 },
  { name: 'NSBE General Meeting', time: '6:00', ampm: 'PM', location: 'ARMS 1010', badge: 'soon', color: '#0EA5E9', day: 2 },
  { name: 'Astronomy Night', time: '9:00', ampm: 'PM', location: 'Lilly Hall Rooftop', badge: 'soon', color: '#10B981', day: 3 },
  { name: 'SWE Workshop: Resume', time: '4:00', ampm: 'PM', location: 'Rawls 1071', badge: 'soon', color: '#F59E0B', day: 4 },
  { name: 'Boilermaker 5K Fun Run', time: '8:00', ampm: 'AM', location: 'CoRec Track', badge: 'soon', color: '#EF4444', day: 5 },
];

const FRIENDS = [
  { name: 'Maya', initial: 'M', color: '#7C3AED', major: 'CS Sophomore', online: true, at: 'PMU' },
  { name: 'Jordan', initial: 'J', color: '#EF4444', major: 'ME Junior', online: true, at: 'WALC' },
  { name: 'Sam', initial: 'S', color: '#10B981', major: 'Business Senior', online: false, at: 'Rawls' },
  { name: 'Priya', initial: 'P', color: '#EC4899', major: 'Pre-Med Freshman', online: true, at: 'ARMS' },
  { name: 'Tyler', initial: 'T', color: '#0EA5E9', major: 'EE Junior', online: true, at: 'CoRec' },
  { name: 'Zoe', initial: 'Z', color: '#F59E0B', major: 'Psychology Soph.', online: false, at: 'Stewart Ctr' },
];

const BUILDINGS = [
  { name: 'WALC', full: 'Wilmeth Active Learning Center', emoji: '📚', lat: 40.4265, lng: -86.9176 },
  { name: 'PMU', full: 'Purdue Memorial Union', emoji: '🏛️', lat: 40.4253, lng: -86.9096 },
  { name: 'CoRec', full: 'France A. Córdova Rec Center', emoji: '🏋️', lat: 40.4215, lng: -86.9238 },
  { name: 'ARMS', full: 'Armstrong Hall', emoji: '🚀', lat: 40.4278, lng: -86.9165 },
  { name: 'Rawls', full: 'Rawls Hall', emoji: '📈', lat: 40.4242, lng: -86.9210 },
  { name: 'Stewart Ctr', full: 'Stewart Center', emoji: '🎭', lat: 40.4251, lng: -86.9162 },
];
const YOU = { lat: 40.4286, lng: -86.9138 }; // demo: Engineering Fountain

const POSTS = [
  { id: 'p1', person: 'Maya L.', initial: 'M', color: '#7C3AED', time: '5m ago', club: 'Purdue Hackers', text: 'Just finished building my first full-stack app at tonight\'s Hack Purdue session. Anyone want to collab this weekend?', emoji: '', likes: 24, comments: 7 },
  { id: 'p2', person: 'Jordan R.', initial: 'J', color: '#EF4444', time: '18m ago', club: 'NSBE Purdue', text: 'Engineering Career Fair tomorrow at PMU Ballrooms — 30 copies of my resume ready. See you there!', emoji: '', likes: 41, comments: 12 },
  { id: 'p3', person: 'Priya M.', initial: 'P', color: '#EC4899', time: '45m ago', club: 'Pre-Med Society', text: 'Study group forming for BIOL 201 midterm. WALC 2nd floor, 6pm Friday. Comment to join.', emoji: '', likes: 18, comments: 22 },
  { id: 'p4', person: 'Tyler B.', initial: 'T', color: '#0EA5E9', time: '1h ago', club: null, text: 'CoRec just got new rowing machines. New PR today. Anyone training for the Boilermaker 5K?', emoji: '', likes: 33, comments: 5 },
  { id: 'p5', person: 'Sam K.', initial: 'S', color: '#10B981', time: '2h ago', club: 'Boilermaker Invest Club', text: 'BIG closed our Q2 portfolio review — up 12% this semester. Recruitment opens Monday.', emoji: '', likes: 57, comments: 19 },
];

const ADS = [
  { id: 'ad1', brand: "Domino's", cat: 'Food Delivery', logo: 'pizza', color: '#E63946', headline: '30-min delivery to your dorm', copy: 'Large pizza to your room for $7.99. Code BOILER at checkout.', cta: 'Order Now' },
  { id: 'ad2', brand: 'Chegg', cat: 'Textbooks', logo: 'book', color: '#F4792B', headline: 'Rent textbooks from $9.99', copy: 'Stop overpaying at the bookstore. 24/7 homework help included.', cta: 'Save on Books' },
  { id: 'ad3', brand: 'Spotify', cat: 'Student Discount', logo: 'musical-notes', color: '#1DB954', headline: 'Premium — 3 months free', copy: 'Verified students get 3 months free, then $5.99/mo.', cta: 'Get Free Trial' },
];

const BADGES = [
  { icon: 'flame', name: 'On Fire', desc: '7-day streak', pts: '+500' },
  { icon: 'rocket', name: 'Early Adopter', desc: 'Joined Week 1', pts: '+250' },
  { icon: 'people', name: 'Connector', desc: '10 friends made', pts: '+300' },
  { icon: 'calendar', name: 'Event Goer', desc: '5 events attended', pts: '+400' },
  { icon: 'business', name: 'Club Hopper', desc: 'Joined 3 clubs', pts: '+350' },
  { icon: 'star', name: 'Top Contributor', desc: 'Weekly #1 rank', pts: '+600' },
];

const REWARDS = [
  { id: 'coffee', icon: 'cafe', name: 'Free Drink at Greyhouse', desc: 'Any drink at Greyhouse Coffee', cost: 1000, sponsor: 'Sponsored by Greyhouse' },
  { id: 'charity', icon: 'heart', name: 'Donate $1 to a Cause', desc: 'One Campus donates to a student-voted cause', cost: 1000, sponsor: 'Community impact' },
  { id: 'dominos', icon: 'pizza', name: "$5 off Domino's", desc: 'Code applied at checkout', cost: 2000, sponsor: "Sponsored by Domino's" },
  { id: 'chickfila', icon: 'fast-food', name: 'Free Chick-fil-A Entrée', desc: 'Any entrée at the PMU Chick-fil-A', cost: 3000, sponsor: 'Sponsored by Chick-fil-A' },
];

const CAUSES = [
  { emoji: 'medkit', name: "Riley Children's Hospital" },
  { emoji: 'fast-food', name: 'Lafayette Food Bank' },
  { emoji: 'happy', name: 'Student Mental Health Fund' },
  { emoji: 'paw', name: 'Local Animal Shelter' },
];

const STARTER_CHATS = {
  Maya: [{ who: 'them', text: 'Hey! Are you coming to Hack Purdue tonight?' }, { who: 'me', text: 'Yeah planning on it! What time?' }, { who: 'them', text: '7pm at WALC 1055. We need a frontend dev btw' }],
  Jordan: [{ who: 'them', text: 'You ready for the career fair tomorrow?' }],
  Sam: [{ who: 'them', text: 'Invest club recruitment opens Monday' }],
  Priya: [{ who: 'them', text: 'BIOL 201 study group — WALC 2nd floor, 6pm Friday!' }],
  Tyler: [{ who: 'them', text: 'New rowing machines at CoRec are insane. Run the 5K with me Saturday?' }],
  Zoe: [{ who: 'them', text: 'Astronomy night Thursday!! Jupiter is visible rn' }],
};

const AUTO_REPLIES = ['Sounds good!', 'Haha for sure', 'Okay see you there!', 'Perfect', 'Yesss let\'s do it', 'Bet. See you on campus!'];
// Master category list — single source of truth for the Discover filter, onboarding,
// the club-signup picker, club icons & the club-detail page. Add a row here to add a category everywhere.
const CATEGORIES = [
  { label: 'Tech', tag: 'TECH', icon: 'laptop' },
  { label: 'Engineering', tag: 'ENGINEERING', icon: 'construct' },
  { label: 'Business', tag: 'BUSINESS', icon: 'trending-up' },
  { label: 'Professional', tag: 'PROFESSIONAL', icon: 'briefcase' },
  { label: 'Science', tag: 'SCIENCE', icon: 'flask' },
  { label: 'Arts', tag: 'ARTS', icon: 'color-palette' },
  { label: 'Sports', tag: 'SPORTS', icon: 'trophy' },
  { label: 'Music', tag: 'MUSIC', icon: 'musical-notes' },
  { label: 'Dance', tag: 'DANCE', icon: 'body' },
  { label: 'Gaming', tag: 'GAMING', icon: 'game-controller' },
  { label: 'Greek Life', tag: 'GREEK', icon: 'people-circle' },
  { label: 'Service', tag: 'SERVICE', icon: 'heart' },
  { label: 'Cultural', tag: 'CULTURAL', icon: 'globe' },
  { label: 'Faith', tag: 'FAITH', icon: 'sparkles' },
  { label: 'Academic', tag: 'ACADEMIC', icon: 'school' },
  { label: 'Media', tag: 'MEDIA', icon: 'videocam' },
  { label: 'Health', tag: 'HEALTH', icon: 'fitness' },
  { label: 'Outdoors', tag: 'OUTDOORS', icon: 'trail-sign' },
  { label: 'Politics', tag: 'POLITICS', icon: 'megaphone' },
  { label: 'Environment', tag: 'ENVIRONMENT', icon: 'leaf' },
  { label: 'Food', tag: 'FOOD', icon: 'restaurant' },
  { label: 'Pre-Law', tag: 'PRELAW', icon: 'hammer' },
  { label: 'Pre-Med', tag: 'PREMED', icon: 'medkit' },
  { label: 'Entrepreneur', tag: 'STARTUP', icon: 'rocket' },
  { label: 'Languages', tag: 'LANGUAGES', icon: 'language' },
  { label: 'LGBTQ+', tag: 'LGBTQ', icon: 'heart-circle' },
  // ── Sports & fitness ──
  { label: 'Basketball', tag: 'BASKETBALL', icon: 'basketball' },
  { label: 'Soccer', tag: 'SOCCER', icon: 'football' },
  { label: 'Football', tag: 'FOOTBALL', icon: 'american-football' },
  { label: 'Baseball', tag: 'BASEBALL', icon: 'baseball' },
  { label: 'Tennis', tag: 'TENNIS', icon: 'tennisball' },
  { label: 'Golf', tag: 'GOLF', icon: 'golf' },
  { label: 'Running', tag: 'RUNNING', icon: 'walk' },
  { label: 'Cycling', tag: 'CYCLING', icon: 'bicycle' },
  { label: 'Swimming', tag: 'SWIMMING', icon: 'water' },
  { label: 'Esports', tag: 'ESPORTS', icon: 'medal' },
  { label: 'Martial Arts', tag: 'MARTIALARTS', icon: 'shield' },
  { label: 'Yoga', tag: 'YOGA', icon: 'body' },
  // ── Majors & career ──
  { label: 'Math', tag: 'MATH', icon: 'calculator' },
  { label: 'Psychology', tag: 'PSYCH', icon: 'bulb' },
  { label: 'Nursing', tag: 'NURSING', icon: 'medical' },
  { label: 'Pre-Dental', tag: 'PREDENT', icon: 'medical' },
  { label: 'Pre-Vet', tag: 'PREVET', icon: 'paw' },
  { label: 'Education', tag: 'EDUCATION', icon: 'easel' },
  { label: 'Finance', tag: 'FINANCE', icon: 'cash' },
  { label: 'Accounting', tag: 'ACCOUNTING', icon: 'wallet' },
  { label: 'Marketing', tag: 'MARKETING', icon: 'storefront' },
  { label: 'Design', tag: 'DESIGN', icon: 'brush' },
  { label: 'Architecture', tag: 'ARCHITECTURE', icon: 'business' },
  { label: 'Communications', tag: 'COMMS', icon: 'chatbubbles' },
  { label: 'Journalism', tag: 'JOURNALISM', icon: 'newspaper' },
  { label: 'Robotics', tag: 'ROBOTICS', icon: 'hardware-chip' },
  { label: 'Coding', tag: 'CODING', icon: 'code-slash' },
  { label: 'Data & AI', tag: 'DATA', icon: 'analytics' },
  { label: 'Cybersecurity', tag: 'CYBER', icon: 'shield' },
  { label: 'Aviation', tag: 'AVIATION', icon: 'airplane' },
  { label: 'Agriculture', tag: 'AGRICULTURE', icon: 'nutrition' },
  { label: 'Real Estate', tag: 'REALESTATE', icon: 'home' },
  // ── Hobbies & interests ──
  { label: 'Photography', tag: 'PHOTO', icon: 'camera' },
  { label: 'Film', tag: 'FILM', icon: 'film' },
  { label: 'Theater', tag: 'THEATER', icon: 'glasses' },
  { label: 'Comedy', tag: 'COMEDY', icon: 'happy' },
  { label: 'Writing', tag: 'WRITING', icon: 'create' },
  { label: 'Book Club', tag: 'BOOKS', icon: 'book' },
  { label: 'Anime', tag: 'ANIME', icon: 'tv' },
  { label: 'Comics', tag: 'COMICS', icon: 'reader' },
  { label: 'Board Games', tag: 'BOARDGAMES', icon: 'dice' },
  { label: 'Chess', tag: 'CHESS', icon: 'extension-puzzle' },
  { label: 'Crafts', tag: 'CRAFTS', icon: 'cut' },
  { label: 'Fashion', tag: 'FASHION', icon: 'shirt' },
  { label: 'Beauty', tag: 'BEAUTY', icon: 'rose' },
  { label: 'Cooking', tag: 'COOKING', icon: 'fast-food' },
  { label: 'Baking', tag: 'BAKING', icon: 'ice-cream' },
  { label: 'Coffee', tag: 'COFFEE', icon: 'cafe' },
  { label: 'Travel', tag: 'TRAVEL', icon: 'map' },
  { label: 'Cars', tag: 'AUTO', icon: 'car' },
  { label: 'Astronomy', tag: 'ASTRONOMY', icon: 'planet' },
  { label: 'Fishing', tag: 'FISHING', icon: 'fish' },
  { label: 'Podcast', tag: 'PODCAST', icon: 'mic' },
  { label: 'Radio', tag: 'RADIO', icon: 'radio' },
  // ── Identity & community ──
  { label: 'Women in STEM', tag: 'WOMENSTEM', icon: 'female' },
  { label: 'International', tag: 'INTERNATIONAL', icon: 'earth' },
  { label: 'Veterans', tag: 'VETERANS', icon: 'ribbon' },
  { label: 'First-Gen', tag: 'FIRSTGEN', icon: 'star' },
  { label: 'Accessibility', tag: 'ACCESSIBILITY', icon: 'accessibility' },
  { label: 'Mental Health', tag: 'MENTALHEALTH', icon: 'heart-half' },
  { label: 'Philanthropy', tag: 'PHILANTHROPY', icon: 'gift' },
  { label: 'Hackathon', tag: 'HACKATHON', icon: 'terminal' },
];
const INTERESTS = ['All', ...CATEGORIES.map(c => c.label)];
const CAT_ICON = Object.fromEntries(CATEGORIES.map(c => [c.tag, c.icon]));
// the Discover filter stores a label ('Greek Life'); clubs store a tag ('GREEK') — bridge them
const tagForLabel = (label) => (CATEGORIES.find(c => c.label === label) || {}).tag || label.toUpperCase();

// ── basic profanity filter for posts, comments & messages ──
// whole-word match (so "class", "assassin", etc. are NOT flagged) on a curated list.
const BANNED_WORDS = [
  'fuck', 'fucks', 'fucking', 'fucked', 'fucker', 'motherfucker', 'shit', 'shitty', 'bullshit',
  'bitch', 'bitches', 'bastard', 'asshole', 'assholes', 'dick', 'dickhead', 'cock', 'pussy',
  'slut', 'whore', 'douche', 'douchebag', 'prick', 'cunt', 'twat', 'wanker', 'jackass',
  'faggot', 'faggots', 'fag', 'retard', 'retarded', 'nigger', 'niggers', 'nigga', 'niggas',
  'kike', 'spic', 'chink', 'gook', 'tranny', 'dyke', 'coon',
];
const BANNED_SET = new Set(BANNED_WORDS);
const hasProfanity = (text) => {
  if (!text) return false;
  return String(text).toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')   // strip punctuation so "f.u.c.k" splits into harmless tokens
    .split(/\s+/)
    .some(word => BANNED_SET.has(word));
};
// pick a representative Ionicons name for any club from its name/category
const clubIcon = (club) => {
  const n = (club.name || '').toLowerCase();
  const pairs = [
    [['robot'], 'hardware-chip'], [['drone'], 'airplane'], [['hack', 'comput', 'code', 'software'], 'laptop'], [['game', 'esport'], 'game-controller'],
    [['soccer'], 'football'], [['barbell', 'lifting', 'powerlift', 'fit', 'gym'], 'barbell'], [['volleyball'], 'basketball'], [['ultimate', 'frisbee'], 'disc'],
    [['box', 'bout'], 'fitness'], [['cycl', '500'], 'bicycle'], [['climb', 'outdoor', 'adventure'], 'trail-sign'], [['run', '5k'], 'walk'],
    [['theatre', 'theater', 'drama'], 'film'], [['sing', 'cappella', 'glee', 'choir', 'concert', 'music'], 'musical-notes'], [['dance'], 'body'], [['film'], 'videocam'],
    [['invest', 'business', 'consult', 'sales', 'kelley', 'sibc', 'finance'], 'trending-up'], [['med', 'bio', 'health', 'nurs'], 'medkit'],
    [['nsbe', 'swe', 'engineer'], 'construct'], [['rocket', 'aero', 'space', 'astro'], 'rocket'],
  ];
  for (const [keys, icon] of pairs) if (keys.some(k => n.includes(k))) return icon;
  return CAT_ICON[club.tag] || 'school';
};

// Ionicons name for a campus building
const buildingIcon = (name) => ({
  'WALC': 'library', 'PMU': 'business', 'CoRec': 'barbell', 'ARMS': 'rocket', 'Rawls': 'trending-up', 'Stewart Ctr': 'film',
}[name] || 'location');

// extra info shown on the club detail page, derived from the club's category
const TAG_INFO = {
  TECH: { meets: 'Weekly · evenings', perks: ['Hands-on build projects & hackathons', 'Coding, hardware & design workshops', 'Network with tech recruiters'] },
  ENGINEERING: { meets: 'Bi-weekly · evenings', perks: ['Team design & build competitions', 'Resume help & professional development', 'Industry guest speakers'] },
  BUSINESS: { meets: 'Weekly', perks: ['Real-world case & consulting projects', 'Networking with companies & alumni', 'Pitch competitions'] },
  PROFESSIONAL: { meets: 'Bi-weekly', perks: ['Resume, interview & LinkedIn prep', 'Employer info sessions & networking nights', 'Internship & job referrals from alumni'] },
  SCIENCE: { meets: 'Weekly', perks: ['Research & lab opportunities', 'Exam prep & study groups', 'Grad/med school guidance'] },
  SPORTS: { meets: 'Multiple times per week', perks: ['Practices, games & tournaments', 'All skill levels welcome', 'Team trips & socials'] },
  ARTS: { meets: 'Weekly · evenings', perks: ['Performances & showcases', 'Creative workshops', 'Open to all majors'] },
};
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ── "Who's free right now" helpers ──
const todayIdx = () => (new Date().getDay() + 6) % 7;       // JS 0=Sun → 0=Mon … 6=Sun
const nowMins = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
const parseMins = (str, ampm) => {                          // "9:30","AM" → minutes since midnight
  const m = (str || '').trim().match(/^(\d{1,2})(?::(\d{2}))?$/);
  if (!m) return null;
  let h = parseInt(m[1], 10); const min = m[2] ? parseInt(m[2], 10) : 0;
  if (h < 1 || h > 12 || min > 59) return null;
  if (ampm === 'PM' && h !== 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  return h * 60 + min;
};
const fmtMins = (mins) => {                                 // 870 → "2:30 PM"
  let h = Math.floor(mins / 60); const m = mins % 60; const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12; if (h === 0) h = 12;
  return `${h}:${String(m).padStart(2, '0')} ${ap}`;
};
// from a person's weekly classes, are they free right NOW? (uses local device time)
const freeStatus = (classes) => {
  const day = todayIdx(), mins = nowMins();
  const todays = (classes || []).filter(c => c.day === day).sort((a, b) => a.start - b.start);
  const inClass = todays.find(c => mins >= c.start && mins < c.end);
  if (inClass) return { free: false, busyUntil: inClass.end };
  const next = todays.find(c => c.start > mins);
  return { free: true, until: next ? next.start : null };    // until=null → free rest of day
};
// quiet hours = 11 PM–8 AM (local device time)
const inQuietHours = () => { const h = new Date().getHours(); return h >= 23 || h < 8; };
const EV_COLORS = ['#7C3AED', '#FF1744', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444'];

export {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  EAS_PROJECT_ID,
  EXPO_PUSH_ENDPOINT,
  PURDUE_CLUBS,
  CAMPUSES,
  INITIAL_EVENTS,
  FRIENDS,
  BUILDINGS,
  YOU,
  POSTS,
  ADS,
  BADGES,
  REWARDS,
  CAUSES,
  STARTER_CHATS,
  AUTO_REPLIES,
  CATEGORIES,
  INTERESTS,
  CAT_ICON,
  tagForLabel,
  BANNED_WORDS,
  BANNED_SET,
  hasProfanity,
  clubIcon,
  buildingIcon,
  TAG_INFO,
  DAY_NAMES,
  todayIdx,
  nowMins,
  parseMins,
  fmtMins,
  freeStatus,
  inQuietHours,
  EV_COLORS
};
