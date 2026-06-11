import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Modal,
  StyleSheet, FlatList, KeyboardAvoidingView, Platform, Switch, SafeAreaView, Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker, Polyline } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
  initializeAuth, getReactNativePersistence,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  onAuthStateChanged, signOut as fbSignOut, updateProfile,
} from 'firebase/auth';
import { initializeFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

/* ─────────── FIREBASE ─────────── */
const firebaseApp = initializeApp({
  apiKey: 'AIzaSyBZme2DEX_aubcTBjMviqgEpPk0Z15CzGs',
  authDomain: 'one-campus-acdc6.firebaseapp.com',
  projectId: 'one-campus-acdc6',
  storageBucket: 'one-campus-acdc6.firebasestorage.app',
  messagingSenderId: '673557735993',
  appId: '1:673557735993:web:5084d747e39ee688febbe8',
});
const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = initializeFirestore(firebaseApp, { experimentalForceLongPolling: true });

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
  { id: 'p1', person: 'Maya L.', initial: 'M', color: '#7C3AED', time: '5m ago', club: 'Purdue Hackers', text: 'Just finished building my first full-stack app at tonight\'s Hack Purdue session 🚀 Anyone want to collab this weekend?', emoji: '💻', likes: 24, comments: 7 },
  { id: 'p2', person: 'Jordan R.', initial: 'J', color: '#EF4444', time: '18m ago', club: 'NSBE Purdue', text: 'Engineering Career Fair tomorrow at PMU Ballrooms — 30 copies of my resume ready. See you there! 💼', emoji: '🏛️', likes: 41, comments: 12 },
  { id: 'p3', person: 'Priya M.', initial: 'P', color: '#EC4899', time: '45m ago', club: 'Pre-Med Society', text: 'Study group forming for BIOL 201 midterm. WALC 2nd floor, 6pm Friday. Comment to join 📚', emoji: '🔬', likes: 18, comments: 22 },
  { id: 'p4', person: 'Tyler B.', initial: 'T', color: '#0EA5E9', time: '1h ago', club: null, text: 'CoRec just got new rowing machines 🏋️ New PR today. Anyone training for the Boilermaker 5K?', emoji: '💪', likes: 33, comments: 5 },
  { id: 'p5', person: 'Sam K.', initial: 'S', color: '#10B981', time: '2h ago', club: 'Boilermaker Invest Club', text: 'BIG closed our Q2 portfolio review — up 12% this semester. Recruitment opens Monday 📈', emoji: '📊', likes: 57, comments: 19 },
];

const ADS = [
  { id: 'ad1', brand: "Domino's", cat: 'Food Delivery', logo: '🍕', color: '#E63946', headline: '30-min delivery to your dorm 🍕', copy: 'Large pizza to your room for $7.99. Code BOILER at checkout.', cta: 'Order Now' },
  { id: 'ad2', brand: 'Chegg', cat: 'Textbooks', logo: '📚', color: '#F4792B', headline: 'Rent textbooks from $9.99 📖', copy: 'Stop overpaying at the bookstore. 24/7 homework help included.', cta: 'Save on Books' },
  { id: 'ad3', brand: 'Spotify', cat: 'Student Discount', logo: '🎵', color: '#1DB954', headline: 'Premium — 3 months free 🎧', copy: 'Verified students get 3 months free, then $5.99/mo.', cta: 'Get Free Trial' },
];

const BADGES = [
  { icon: '🔥', name: 'On Fire', desc: '7-day streak', pts: '+500' },
  { icon: '🚀', name: 'Early Adopter', desc: 'Joined Week 1', pts: '+250' },
  { icon: '🤝', name: 'Connector', desc: '10 friends made', pts: '+300' },
  { icon: '📅', name: 'Event Goer', desc: '5 events attended', pts: '+400' },
  { icon: '🏛️', name: 'Club Hopper', desc: 'Joined 3 clubs', pts: '+350' },
  { icon: '⭐', name: 'Top Contributor', desc: 'Weekly #1 rank', pts: '+600' },
];

const REWARDS = [
  { id: 'coffee', icon: '☕', name: 'Free Drink at Greyhouse', desc: 'Any drink at Greyhouse Coffee', cost: 1000, sponsor: 'Sponsored by Greyhouse' },
  { id: 'charity', icon: '❤️', name: 'Donate $1 to a Cause', desc: 'One Campus donates to a student-voted cause', cost: 1000, sponsor: 'Community impact' },
  { id: 'dominos', icon: '🍕', name: "$5 off Domino's", desc: 'Code applied at checkout', cost: 2000, sponsor: "Sponsored by Domino's" },
  { id: 'chickfila', icon: '🐔', name: 'Free Chick-fil-A Entrée', desc: 'Any entrée at the PMU Chick-fil-A', cost: 3000, sponsor: 'Sponsored by Chick-fil-A' },
];

const CAUSES = [
  { emoji: '🏥', name: "Riley Children's Hospital" },
  { emoji: '🍲', name: 'Lafayette Food Bank' },
  { emoji: '🧠', name: 'Student Mental Health Fund' },
  { emoji: '🐾', name: 'Local Animal Shelter' },
];

const STARTER_CHATS = {
  Maya: [{ who: 'them', text: 'Hey! Are you coming to Hack Purdue tonight? 💻' }, { who: 'me', text: 'Yeah planning on it! What time?' }, { who: 'them', text: '7pm at WALC 1055. We need a frontend dev btw 👀' }],
  Jordan: [{ who: 'them', text: 'You ready for the career fair tomorrow?' }],
  Sam: [{ who: 'them', text: 'Invest club recruitment opens Monday 📈' }],
  Priya: [{ who: 'them', text: 'BIOL 201 study group — WALC 2nd floor, 6pm Friday!' }],
  Tyler: [{ who: 'them', text: 'New rowing machines at CoRec are insane 🏋️ Run the 5K with me Saturday?' }],
  Zoe: [{ who: 'them', text: 'Astronomy night Thursday!! Jupiter is visible rn 🪐' }],
};

const AUTO_REPLIES = ['Sounds good! 🙌', 'Haha for sure', 'Okay see you there!', 'Perfect 👍', 'Yesss let\'s do it', 'Bet. See you on campus!'];
const INTERESTS = ['All', 'Tech', 'Engineering', 'Business', 'Science', 'Arts', 'Sports'];
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const EV_COLORS = ['#7C3AED', '#FF1744', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444'];

/* ─────────── APP ─────────── */
export default function App() {
  const [tab, setTab] = useState('discover');
  const [points, setPoints] = useState(2456);
  const [isPremium, setIsPremium] = useState(false);
  const [dark, setDark] = useState(false);
  const [toast, setToast] = useState(null);

  const [joined, setJoined] = useState([]);
  const [rsvpd, setRsvpd] = useState([]);
  const [liked, setLiked] = useState([]);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [redeemed, setRedeemed] = useState([]);
  const [chats, setChats] = useState(STARTER_CHATS);

  const [campus, setCampus] = useState('purdue');
  const [interest, setInterest] = useState('All');
  const [cardIdx, setCardIdx] = useState(0);
  const [dayFilter, setDayFilter] = useState(null);
  const [ptsTab, setPtsTab] = useState('badges');
  const [connectTab, setConnectTab] = useState('feed');

  const [sheet, setSheet] = useState(null); // 'paywall' | 'payment' | 'planner' | 'addEvent' | 'charity' | 'reward' | 'cancelSub'
  const [rewardResult, setRewardResult] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [chatWith, setChatWith] = useState(null);
  const [chatTyping, setChatTyping] = useState(false);
  const [settings, setSettings] = useState({ location: true, notifications: true, leaderboard: true, notifEvents: true, notifDMs: true, notifRequests: true, quietHours: false });
  const [accent, setAccent] = useState('#7C3AED');
  const [profile, setProfile] = useState({ name: 'Leighton B.', major: 'Purdue University' });

  // ── real auth state ──
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authName, setAuthName] = useState('');
  const [authBusy, setAuthBusy] = useState(false);

  const dataLoaded = useRef(false);
  const saveTimer = useRef(null);

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
      if (u && u.displayName) setProfile(p => ({ ...p, name: u.displayName }));
      if (!u) dataLoaded.current = false;
    });
    return unsub;
  }, []);

  // ── BACKEND: load this user's saved data from Firestore ──
  React.useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const d = snap.data();
          if (typeof d.points === 'number') setPoints(d.points);
          if (Array.isArray(d.joined)) setJoined(d.joined);
          if (Array.isArray(d.rsvpd)) setRsvpd(d.rsvpd);
          if (Array.isArray(d.liked)) setLiked(d.liked);
          if (Array.isArray(d.redeemed)) setRedeemed(d.redeemed);
          if (typeof d.isPremium === 'boolean') setIsPremium(d.isPremium);
          if (d.profile) setProfile(d.profile);
          if (d.accent) setAccent(d.accent);
          if (typeof d.dark === 'boolean') setDark(d.dark);
          if (d.settings) setSettings(s => ({ ...s, ...d.settings }));
          showToast('☁️ Your data is synced!');
        }
        dataLoaded.current = true;
      } catch (e) {
        showToast('⚠️ Could not load saved data — is Firestore enabled?');
        dataLoaded.current = true;
      }
    })();
  }, [user]);

  // ── BACKEND: auto-save to Firestore when anything changes (debounced) ──
  React.useEffect(() => {
    if (!user || !dataLoaded.current) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setDoc(doc(db, 'users', user.uid), {
        points, joined, rsvpd, liked, redeemed, isPremium, profile, accent, dark, settings,
        email: user.email, updatedAt: Date.now(),
      }, { merge: true }).catch(() => {});
    }, 1200);
    return () => clearTimeout(saveTimer.current);
  }, [points, joined, rsvpd, liked, redeemed, isPremium, profile, accent, dark, settings, user]);

  const doAuth = async () => {
    const email = authEmail.trim();
    if (!email.includes('@')) { showToast('Enter a valid email 📧'); return; }
    if (authPass.length < 6) { showToast('Password needs 6+ characters 🔑'); return; }
    if (authMode === 'signup' && !authName.trim()) { showToast('Enter your name ✏️'); return; }
    setAuthBusy(true);
    try {
      if (authMode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, email, authPass);
        await updateProfile(cred.user, { displayName: authName.trim() });
        setProfile(p => ({ ...p, name: authName.trim() }));
        showToast(`🎉 Account created — welcome, ${authName.trim().split(' ')[0]}!`);
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, authPass);
        showToast(`👋 Welcome back${cred.user.displayName ? ', ' + cred.user.displayName.split(' ')[0] : ''}!`);
      }
      setAuthPass('');
    } catch (err) {
      const msgs = {
        'auth/email-already-in-use': 'That email already has an account — try Sign In',
        'auth/invalid-credential': 'Wrong email or password',
        'auth/user-not-found': 'No account with that email — try Sign Up',
        'auth/wrong-password': 'Wrong password',
        'auth/network-request-failed': 'No internet connection',
        'auth/too-many-requests': 'Too many tries — wait a minute',
      };
      showToast(msgs[err.code] || `Error: ${err.code || err.message}`);
    }
    setAuthBusy(false);
  };

  const doSignOut = async () => {
    await fbSignOut(auth);
    setShowSettings(false);
    showToast('Signed out 👋');
  };

  // add-event form
  const [evName, setEvName] = useState('');
  const [evTime, setEvTime] = useState('');
  const [evAmpm, setEvAmpm] = useState('PM');
  const [evLoc, setEvLoc] = useState('');
  const [evDay, setEvDay] = useState(0);
  const [evColor, setEvColor] = useState(EV_COLORS[0]);

  // payment form
  const [cardNum, setCardNum] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [payStatus, setPayStatus] = useState(null);

  const [chatInput, setChatInput] = useState('');
  const toastTimer = useRef(null);
  const chatScroll = useRef(null);

  const T = dark ? DARKTHEME : LIGHTTHEME;
  const A = accent;
  const st = React.useMemo(() => makeStyles(A), [A]);
  const initials = profile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'LB';

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  const addPoints = (n) => {
    const earned = isPremium ? n * 2 : n;
    setPoints(p => p + earned);
    return earned;
  };

  /* ── discover ── */
  const clubList = () => {
    const list = CAMPUSES[campus].clubs;
    return interest === 'All' ? list : list.filter(c => c.tag === interest.toUpperCase());
  };

  const swipe = (action) => {
    const list = clubList();
    if (!list.length) return;
    const club = list[cardIdx % list.length];
    if (action === 'join' || action === 'super') {
      if (joined.includes(club.name)) {
        showToast(`Already a member of ${club.name}`);
      } else {
        setJoined(j => [...j, club.name]);
        const earned = addPoints(action === 'super' ? 150 : 75);
        showToast(`${action === 'super' ? '⭐ Super joined' : '✓ Joined'} ${club.name}! +${earned} pts${isPremium ? ' (2x 👑)' : ''}`);
      }
    } else {
      showToast('Skipped — next up!');
    }
    setCardIdx(i => i + 1);
  };

  const pickCampus = (key) => {
    if (!CAMPUSES[key].free && !isPremium) { setSheet('paywall'); return; }
    setCampus(key);
    setCardIdx(0);
    showToast(key === 'purdue' ? '🚂 Back to Purdue' : `${CAMPUSES[key].emoji} Browsing ${CAMPUSES[key].name} — Premium perk!`);
  };

  /* ── events ── */
  const rsvp = (name) => {
    if (rsvpd.includes(name)) { showToast(`You're already going to ${name}`); return; }
    setRsvpd(r => [...r, name]);
    const earned = addPoints(25);
    showToast(`RSVP'd to ${name}! +${earned} pts${isPremium ? ' (2x 👑)' : ''}`);
  };

  const createEvent = () => {
    if (!evName.trim()) { showToast('Give your event a name! ✏️'); return; }
    let t = evTime.trim() || '12:00';
    if (!/^\d{1,2}(:\d{2})?$/.test(t)) { showToast('Time should look like 7:00'); return; }
    if (!t.includes(':')) t += ':00';
    setEvents(e => [...e, { name: evName.trim(), time: t, ampm: evAmpm, location: evLoc.trim() || 'Purdue Campus', badge: 'soon', color: evColor, day: evDay, mine: true }]);
    setSheet(null);
    setEvName(''); setEvTime(''); setEvLoc('');
    const earned = addPoints(50);
    showToast(`📅 Event created! +${earned} pts${isPremium ? ' (2x 👑)' : ''}`);
  };

  /* ── premium ── */
  const activatePremium = () => {
    setIsPremium(true);
    setSheet(null);
    setPayStatus(null);
    showToast('👑 Welcome to Premium! 2x points active');
  };

  const payApple = () => {
    setPayStatus('Confirm with Face ID 👤');
    setTimeout(() => setPayStatus('Processing... ⏳'), 1100);
    setTimeout(() => setPayStatus('Done ✅'), 2100);
    setTimeout(activatePremium, 2800);
  };

  const payCard = () => {
    const num = cardNum.replace(/\s/g, '');
    if (num.length < 15) { showToast('Enter a valid card number 💳'); return; }
    if (!/^\d{2}\/\d{2}$/.test(cardExp)) { showToast('Expiry should be MM/YY'); return; }
    if (cardCvv.length < 3) { showToast('Enter your 3-digit CVV'); return; }
    if (!cardName.trim()) { showToast('Enter the name on the card ✏️'); return; }
    setPayStatus('Processing payment... ⏳');
    setTimeout(() => setPayStatus('Payment approved ✅'), 1500);
    setTimeout(activatePremium, 2200);
  };

  const cancelSub = () => {
    setIsPremium(false);
    if (campus !== 'purdue') { setCampus('purdue'); setCardIdx(0); }
    setSheet(null);
    showToast('Subscription canceled — Premium ends July 10 💔');
  };

  /* ── shop ── */
  const redeem = (r) => {
    if (points < r.cost) { showToast(`Need ${(r.cost - points).toLocaleString()} more pts! ⚡`); return; }
    if (r.id === 'charity') { setSheet('charity'); return; }
    finishRedeem(r, null);
  };

  const finishRedeem = (r, cause) => {
    setPoints(p => p - r.cost);
    const code = 'OC-' + Math.random().toString(36).slice(2, 7).toUpperCase();
    setRedeemed(list => [{ icon: r.icon, name: cause ? `$1 donated to ${cause}` : r.name, code: cause ? 'THANK YOU 💜' : code }, ...list]);
    setRewardResult({ r, cause, code });
    setSheet('reward');
  };

  /* ── in-app directions (no leaving the app!) ── */
  const [routeCoords, setRouteCoords] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const mapRef = useRef(null);

  const openDirections = async (place) => {
    const b = BUILDINGS.find(x => place.includes(x.name) || place.includes(x.full));
    if (!b) { showToast('📍 Location not on the campus map yet'); return; }
    setTab('campus');
    showToast('🚶 Finding the best walking route...');
    try {
      const res = await fetch(`https://routing.openstreetmap.de/routed-foot/route/v1/foot/${YOU.lng},${YOU.lat};${b.lng},${b.lat}?overview=full&geometries=geojson&steps=true`);
      const data = await res.json();
      const r = data.routes[0];
      const coords = r.geometry.coordinates.map(([x, y]) => ({ latitude: y, longitude: x }));
      const steps = (r.legs[0]?.steps || []).map(stepToText).filter(Boolean);
      setRouteCoords(coords);
      setRouteInfo({ label: place, mins: Math.max(1, Math.round(r.duration / 60)), meters: Math.round(r.distance), steps });
      setTimeout(() => mapRef.current?.fitToCoordinates(coords, { edgePadding: { top: 50, bottom: 50, left: 50, right: 50 }, animated: true }), 350);
    } catch (e) {
      showToast('Could not load route — check internet 📶');
    }
  };

  const stepToText = (s) => {
    const dist = s.distance >= 10 ? ` — ${Math.round(s.distance)} m` : '';
    const road = s.name ? ` on ${s.name}` : '';
    const m = s.maneuver || {};
    const dir = (m.modifier || '').includes('left') ? '←' : (m.modifier || '').includes('right') ? '→' : '↑';
    if (m.type === 'depart') return `↑ Head out${road}${dist}`;
    if (m.type === 'arrive') return `🏁 You've arrived!`;
    if (m.type === 'turn' || m.type === 'end of road' || m.type === 'fork') return `${dir} Turn ${m.modifier || ''}${road}${dist}`;
    if (m.type === 'new name' || m.type === 'continue') return `↑ Continue${road}${dist}`;
    return `${dir} ${m.type || 'Continue'}${road}${dist}`;
  };

  const [showSteps, setShowSteps] = useState(false);
  const clearRoute = () => { setRouteCoords(null); setRouteInfo(null); setShowSteps(false); };

  /* ── chat ── */
  const sendChat = () => {
    const text = chatInput.trim();
    if (!text || !chatWith) return;
    const name = chatWith;
    setChats(c => ({ ...c, [name]: [...(c[name] || []), { who: 'me', text }] }));
    setChatInput('');
    setTimeout(() => setChatTyping(true), 600);
    setTimeout(() => {
      setChatTyping(false);
      setChats(c => ({ ...c, [name]: [...(c[name] || []), { who: 'them', text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)] }] }));
    }, 1900);
  };

  /* ─────────── RENDER HELPERS ─────────── */

  const Pill = ({ label, active, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[st.pill, { backgroundColor: active ? A : T.card }, !active && { borderWidth: 1, borderColor: T.border }]}>
      <Text style={{ color: active ? 'white' : T.subtext, fontWeight: '700', fontSize: 12 }}>{label}</Text>
    </TouchableOpacity>
  );

  const renderDiscover = () => {
    const list = clubList();
    const club = list.length ? list[cardIdx % list.length] : null;
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        <Text style={[st.title, { color: A }]}>Discover</Text>
        <Text style={[st.sub, { color: T.subtext }]}>Find your people & passions</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
          {Object.entries(CAMPUSES).map(([key, c]) => {
            const locked = !c.free && !isPremium;
            return (
              <TouchableOpacity key={key} onPress={() => pickCampus(key)} style={[st.pill, { backgroundColor: campus === key ? A : T.card, marginRight: 8 }]}>
                <Text style={{ color: campus === key ? 'white' : T.subtext, fontWeight: '700', fontSize: 12 }}>{locked ? '🔒' : c.emoji} {c.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {club ? (
          <View style={[st.clubCard, { backgroundColor: club.colors[0] }]}>
            <View style={st.clubTag}><Text style={{ color: 'white', fontSize: 11, fontWeight: '700' }}>{club.tag}</Text></View>
            <Text style={st.clubName}>{club.name}</Text>
            <Text style={st.clubDesc}>{club.desc}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <View style={st.metaPill}><Text style={st.metaPillText}>👥 {club.members.toLocaleString()}</Text></View>
              <View style={st.metaPill}><Text style={st.metaPillText}>📍 {club.location}</Text></View>
              {joined.includes(club.name) && <View style={[st.metaPill, { backgroundColor: 'rgba(255,255,255,0.45)' }]}><Text style={st.metaPillText}>✓ Joined</Text></View>}
            </View>
          </View>
        ) : (
          <View style={[st.clubCard, { backgroundColor: T.card, alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ fontSize: 40 }}>🔍</Text>
            <Text style={{ fontSize: 16, fontWeight: '800', color: T.text, marginTop: 6 }}>No {interest} clubs yet</Text>
            <Text style={{ fontSize: 12, color: T.subtext, marginTop: 4 }}>Try another interest!</Text>
          </View>
        )}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 18, marginVertical: 14 }}>
          <TouchableOpacity onPress={() => swipe('skip')} style={[st.actionBtn, { backgroundColor: T.card }]}><Text style={{ fontSize: 20 }}>✕</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => swipe('super')} style={[st.actionBtn, { backgroundColor: '#FF6B35' }]}><Text style={{ fontSize: 20 }}>⭐</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => swipe('join')} style={[st.actionBtn, { backgroundColor: A }]}><Text style={{ fontSize: 20, color: 'white' }}>✓</Text></TouchableOpacity>
        </View>
        <Text style={[st.sectionLabel, { color: T.subtext }]}>FILTER BY INTEREST</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {INTERESTS.map(i => <Pill key={i} label={i} active={interest === i} onPress={() => { setInterest(i); setCardIdx(0); }} />)}
        </View>
      </ScrollView>
    );
  };

  const renderEvents = () => {
    const filtered = dayFilter === null ? events : events.filter(e => e.day === dayFilter);
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={[st.title, { color: A }]}>Events</Text>
            <Text style={[st.sub, { color: T.subtext }]}>What's happening on campus</Text>
          </View>
          <TouchableOpacity onPress={() => setSheet('addEvent')} style={st.addBtn}><Text style={{ color: 'white', fontSize: 22 }}>+</Text></TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', gap: 6, marginVertical: 12 }}>
          {DAY_NAMES.map((d, i) => (
            <TouchableOpacity key={d} onPress={() => setDayFilter(dayFilter === i ? null : i)}
              style={[st.dayCell, { backgroundColor: dayFilter === i ? A : T.card }]}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: dayFilter === i ? 'white' : T.subtext }}>{d}</Text>
              {events.some(e => e.day === i) && <View style={[st.dot, { backgroundColor: dayFilter === i ? 'white' : '#FF4081' }]} />}
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[st.sectionLabel, { color: T.subtext }]}>{filtered.length} UPCOMING EVENT{filtered.length !== 1 ? 'S' : ''}</Text>
        {filtered.map((e, idx) => {
          const going = rsvpd.includes(e.name);
          return (
            <TouchableOpacity key={idx} onPress={() => rsvp(e.name)} style={[st.eventCard, { backgroundColor: T.card }]}>
              <View style={{ width: 4, height: 44, borderRadius: 4, backgroundColor: e.color }} />
              <View style={{ minWidth: 50 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: A }}>{e.time}</Text>
                <Text style={{ fontSize: 11, color: T.subtext }}>{e.ampm}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: T.text }}>{e.name}</Text>
                <Text style={{ fontSize: 12, color: T.subtext }}>
                  📍 {e.location}{'  '}
                  <Text onPress={() => openDirections(e.location)} style={{ color: '#34A853', fontWeight: '800' }}>🧭 Directions</Text>
                </Text>
              </View>
              <View style={[st.badge, { backgroundColor: e.mine ? '#EDE9FE' : going ? '#F0FDF4' : '#FEE2E2' }]}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: e.mine ? A : going ? '#22c55e' : '#EF4444' }}>
                  {e.mine ? '⭐ Host' : going ? '✓ Going' : e.badge === 'live' ? '🔴 Live' : e.badge === 'today' ? 'Today' : 'Soon'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const renderCampus = () => (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Text style={[st.title, { color: A }]}>Campus</Text>
      <Text style={[st.sub, { color: T.subtext }]}>
        {settings.location ? `${FRIENDS.filter(f => f.online).length} friends active right now` : "You're invisible 👻 (location off)"}
      </Text>
      {routeInfo && (
        <View style={{ backgroundColor: T.card, borderRadius: 14, padding: 11, marginTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flex: 1, fontSize: 13, color: T.text }}>🚶 <Text style={{ fontWeight: '800' }}>{routeInfo.mins} min walk</Text> ({routeInfo.meters} m) to {routeInfo.label}</Text>
            <TouchableOpacity onPress={() => setShowSteps(s => !s)} style={{ backgroundColor: dark ? '#2E2942' : '#EDE9FE', borderRadius: 9, paddingHorizontal: 9, paddingVertical: 4, marginRight: 4 }}>
              <Text style={{ color: A, fontSize: 11, fontWeight: '800' }}>{showSteps ? 'Steps ▴' : 'Steps ▾'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={clearRoute}><Text style={{ color: T.subtext, fontSize: 15, paddingHorizontal: 6 }}>✕</Text></TouchableOpacity>
          </View>
          {showSteps && (
            <View style={{ marginTop: 8, borderTopWidth: 1, borderColor: T.border, paddingTop: 4 }}>
              {routeInfo.steps.map((s, i) => (
                <Text key={i} style={{ fontSize: 12.5, color: T.text, paddingVertical: 5, borderBottomWidth: i < routeInfo.steps.length - 1 ? 1 : 0, borderColor: T.border }}>{s}</Text>
              ))}
            </View>
          )}
        </View>
      )}
      <View style={{ height: 240, borderRadius: 16, overflow: 'hidden', marginTop: 10 }}>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={{ latitude: 40.4253, longitude: -86.9160, latitudeDelta: 0.014, longitudeDelta: 0.014 }}
        >
          <Marker coordinate={{ latitude: YOU.lat, longitude: YOU.lng }} title="You" description="Engineering Fountain" pinColor="#1a1a2e" />
          {BUILDINGS.map(b => (
            <Marker key={b.name} coordinate={{ latitude: b.lat, longitude: b.lng }} title={b.name} description={b.full} pinColor={A} />
          ))}
          {settings.location && FRIENDS.filter(f => f.online).map(f => {
            const b = BUILDINGS.find(x => x.name === f.at);
            if (!b) return null;
            return <Marker key={f.name} coordinate={{ latitude: b.lat + 0.0005, longitude: b.lng + 0.0005 }} title={f.name} description={f.major} pinColor={f.color} onCalloutPress={() => setChatWith(f.name)} />;
          })}
          {routeCoords && <Polyline coordinates={routeCoords} strokeColor={A} strokeWidth={4} lineDashPattern={[6, 6]} />}
        </MapView>
      </View>
      {BUILDINGS.map(b => {
        const here = FRIENDS.filter(f => f.at === b.name && f.online);
        const clubsHere = PURDUE_CLUBS.filter(c => c.location.includes(b.name));
        return (
          <View key={b.name} style={[st.buildingCard, { backgroundColor: T.card, marginTop: 10 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 24 }}>{b.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '800', color: T.text }}>{b.name}</Text>
                <Text style={{ fontSize: 11, color: T.subtext }}>{b.full}</Text>
              </View>
              <TouchableOpacity onPress={() => openDirections(b.full)} style={{ backgroundColor: '#34A853', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 11 }}>
                <Text style={{ color: 'white', fontSize: 11, fontWeight: '800' }}>🧭 Directions</Text>
              </TouchableOpacity>
            </View>
            {here.length > 0 && (
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                {here.map(f => (
                  <TouchableOpacity key={f.name} onPress={() => setChatWith(f.name)} style={[st.friendChip, { backgroundColor: f.color }]}>
                    <Text style={{ color: 'white', fontWeight: '700', fontSize: 12 }}>{f.initial} {f.name} 💬</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {clubsHere.map(c => (
              <TouchableOpacity key={c.name} onPress={() => {
                if (joined.includes(c.name)) { showToast(`Already a member of ${c.name}`); return; }
                setJoined(j => [...j, c.name]);
                const earned = addPoints(75);
                showToast(`✓ Joined ${c.name}! +${earned} pts${isPremium ? ' (2x 👑)' : ''}`);
              }} style={[st.clubRow, { borderColor: T.border }]}>
                <Text style={{ fontSize: 12.5, fontWeight: '600', color: T.text, flex: 1 }}>🏛️ {c.name} · {c.members} members</Text>
                <Text style={{ fontSize: 12, fontWeight: '800', color: joined.includes(c.name) ? '#22c55e' : A }}>{joined.includes(c.name) ? '✓ Joined' : '+ Join'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );

  const renderPoints = () => (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <View style={st.heroCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={st.heroAvatar}><Text style={{ color: 'white', fontSize: 20, fontWeight: '800' }}>{initials}</Text></View>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '700' }}>{profile.name}</Text>
            <Text style={{ color: 'white', fontSize: 32, fontWeight: '900' }}>{points.toLocaleString()}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>Campus Explorer · {profile.major} {isPremium ? '· 👑 PRO' : ''}</Text>
          </View>
        </View>
      </View>
      {isPremium ? (
        <TouchableOpacity onPress={() => setSheet('planner')} style={[st.upgradeBanner, { backgroundColor: dark ? '#2E2942' : '#EDE9FE' }]}>
          <Text style={{ fontSize: 22 }}>🤖</Text>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={{ fontWeight: '800', fontSize: 13, color: T.text }}>AI Organizer <Text style={{ color: '#F59E0B' }}>PRO</Text></Text>
            <Text style={{ fontSize: 11, color: T.subtext }}>Your day & night, planned by AI</Text>
          </View>
          <View style={st.upgradeBtn}><Text style={{ color: 'white', fontSize: 12, fontWeight: '800' }}>Open</Text></View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => setSheet('paywall')} style={[st.upgradeBanner, { backgroundColor: dark ? '#3A2E1E' : '#FEF3C7' }]}>
          <Text style={{ fontSize: 22 }}>⭐</Text>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={{ fontWeight: '800', fontSize: 13, color: dark ? '#FDE68A' : '#92400E' }}>One Campus Premium ✨</Text>
            <Text style={{ fontSize: 11, color: dark ? '#D9C58A' : '#B45309' }}>2x points · AI organizer · all campuses</Text>
          </View>
          <View style={st.upgradeBtn}><Text style={{ color: 'white', fontSize: 12, fontWeight: '800' }}>Upgrade</Text></View>
        </TouchableOpacity>
      )}
      <View style={{ flexDirection: 'row', gap: 8, marginVertical: 12 }}>
        {[['badges', '🏅 Badges'], ['weekly', '⚡ Weekly'], ['shop', '🎁 Shop']].map(([k, label]) => (
          <TouchableOpacity key={k} onPress={() => setPtsTab(k)} style={[st.tabBtn, { backgroundColor: ptsTab === k ? A : T.card }]}>
            <Text style={{ color: ptsTab === k ? 'white' : T.subtext, fontSize: 12, fontWeight: '700' }}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {ptsTab === 'badges' && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {BADGES.map(b => (
            <View key={b.name} style={[st.badgeCard, { backgroundColor: T.card }]}>
              <Text style={{ fontSize: 26 }}>{b.icon}</Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: T.text }}>{b.name}</Text>
              <Text style={{ fontSize: 11, color: T.subtext }}>{b.desc}</Text>
              <Text style={{ fontSize: 11, color: A, fontWeight: '700', marginTop: 3 }}>{b.pts} pts</Text>
            </View>
          ))}
        </View>
      )}
      {ptsTab === 'weekly' && [
        { name: profile.name, pts: points, you: true }, { name: 'Maya L.', pts: 2210 }, { name: 'Jordan R.', pts: 1980 }, { name: 'Priya M.', pts: 1750 }, { name: 'Tyler B.', pts: 1600 },
      ].map((u, i) => (
        <View key={u.name} style={[st.leaderRow, { backgroundColor: u.you ? (dark ? '#2E2942' : '#EDE9FE') : T.card }]}>
          <Text style={{ fontSize: 16, minWidth: 30 }}>{['🥇', '🥈', '🥉', '#4', '#5'][i]}</Text>
          <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: T.text }}>{u.name}{u.you ? ' (You)' : ''}</Text>
          <Text style={{ fontSize: 13, fontWeight: '700', color: A }}>⚡ {u.pts.toLocaleString()}</Text>
        </View>
      ))}
      {ptsTab === 'shop' && (
        <View>
          <Text style={{ textAlign: 'center', fontSize: 12, color: T.subtext, marginBottom: 10 }}>You have <Text style={{ color: A, fontWeight: '800' }}>⚡ {points.toLocaleString()} pts</Text> to spend</Text>
          {REWARDS.map(r => {
            const afford = points >= r.cost;
            return (
              <View key={r.id} style={[st.rewardRow, { backgroundColor: T.card, opacity: afford ? 1 : 0.55 }]}>
                <Text style={{ fontSize: 24 }}>{r.icon}</Text>
                <View style={{ flex: 1, marginHorizontal: 10 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: T.text }}>{r.name}</Text>
                  <Text style={{ fontSize: 11, color: T.subtext }}>{r.desc}</Text>
                  <Text style={{ fontSize: 10, color: T.subtext, opacity: 0.7 }}>{r.sponsor}</Text>
                </View>
                <TouchableOpacity onPress={() => redeem(r)} style={[st.redeemBtn, { backgroundColor: afford ? A : T.border }]}>
                  <Text style={{ color: afford ? 'white' : T.subtext, fontSize: 11, fontWeight: '800' }}>⚡ {r.cost.toLocaleString()}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
          {redeemed.length > 0 && <Text style={[st.sectionLabel, { color: T.subtext, marginTop: 10 }]}>MY REDEMPTIONS</Text>}
          {redeemed.map((r, i) => (
            <View key={i} style={[st.rewardRow, { backgroundColor: dark ? '#1E3328' : '#F0FDF4' }]}>
              <Text style={{ fontSize: 18 }}>{r.icon}</Text>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ fontSize: 12.5, fontWeight: '700', color: '#16A34A' }}>{r.name}</Text>
                <Text style={{ fontSize: 11, color: '#22c55e', fontWeight: '700', letterSpacing: 1 }}>{r.code}</Text>
              </View>
              <Text style={{ fontSize: 11, color: '#22c55e', fontWeight: '700' }}>✓ Redeemed</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );

  const renderConnect = () => (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Text style={[st.title, { color: A }]}>Connections</Text>
      <Text style={[st.sub, { color: T.subtext }]}>{FRIENDS.length} friends on campus</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginVertical: 10 }}>
        {[['feed', '🔥 Feed'], ['friends', '👥 Friends']].map(([k, label]) => (
          <TouchableOpacity key={k} onPress={() => setConnectTab(k)} style={[st.tabBtn, { backgroundColor: connectTab === k ? A : T.card }]}>
            <Text style={{ color: connectTab === k ? 'white' : T.subtext, fontSize: 12, fontWeight: '700' }}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {connectTab === 'friends' ? FRIENDS.map(f => (
        <TouchableOpacity key={f.name} onPress={() => setChatWith(f.name)} style={[st.friendRow, { backgroundColor: T.card }]}>
          <View style={[st.avatar, { backgroundColor: f.color }]}><Text style={{ color: 'white', fontWeight: '700' }}>{f.initial}</Text></View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: T.text }}>{f.name} {f.online ? '🟢' : ''}</Text>
            <Text style={{ fontSize: 12, color: T.subtext }}>{f.major}</Text>
          </View>
          <Text style={{ color: A, fontWeight: '800', fontSize: 12 }}>Message 💬</Text>
        </TouchableOpacity>
      )) : POSTS.map((p, i) => (
        <View key={p.id}>
          <View style={[st.postCard, { backgroundColor: T.card }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[st.avatar, { backgroundColor: p.color }]}><Text style={{ color: 'white', fontWeight: '700' }}>{p.initial}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: T.text }}>{p.person} {p.club ? `· ${p.club}` : ''}</Text>
                <Text style={{ fontSize: 11, color: T.subtext }}>{p.time}</Text>
              </View>
            </View>
            <Text style={{ fontSize: 13, color: T.text, marginVertical: 8, lineHeight: 19 }}>{p.emoji} {p.text}</Text>
            <View style={{ flexDirection: 'row', gap: 18 }}>
              <TouchableOpacity onPress={() => setLiked(l => l.includes(p.id) ? l.filter(x => x !== p.id) : [...l, p.id])}>
                <Text style={{ fontSize: 13, color: liked.includes(p.id) ? '#EF4444' : T.subtext, fontWeight: '700' }}>
                  {liked.includes(p.id) ? '❤️' : '🤍'} {p.likes + (liked.includes(p.id) ? 1 : 0)}
                </Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 13, color: T.subtext, fontWeight: '700' }}>💬 {p.comments}</Text>
              <TouchableOpacity onPress={() => showToast('Shared! 🔗')}><Text style={{ fontSize: 13, color: T.subtext, fontWeight: '700' }}>🔗 Share</Text></TouchableOpacity>
            </View>
          </View>
          {(i + 1) % 2 === 0 && ADS[Math.floor(i / 2)] && (() => {
            const ad = ADS[Math.floor(i / 2)];
            return (
              <View style={[st.postCard, { backgroundColor: T.card, borderWidth: 1, borderColor: T.border }]}>
                <Text style={{ fontSize: 10, color: T.subtext, fontWeight: '700', letterSpacing: 0.5, marginBottom: 6 }}>SPONSORED</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={[st.avatar, { backgroundColor: ad.color, borderRadius: 12 }]}><Text style={{ fontSize: 18 }}>{ad.logo}</Text></View>
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: T.text }}>{ad.brand}</Text>
                    <Text style={{ fontSize: 11, color: T.subtext }}>{ad.cat}</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 14, fontWeight: '800', color: T.text, marginTop: 8 }}>{ad.headline}</Text>
                <Text style={{ fontSize: 12, color: T.subtext, marginVertical: 4 }}>{ad.copy}</Text>
                <TouchableOpacity onPress={() => showToast(`Opening ${ad.brand}... 🔗`)} style={[st.ctaBtn, { backgroundColor: ad.color }]}>
                  <Text style={{ color: 'white', fontWeight: '700', fontSize: 13 }}>{ad.cta}</Text>
                </TouchableOpacity>
              </View>
            );
          })()}
        </View>
      ))}
    </ScrollView>
  );

  /* ─────────── SHEETS (Modal) ─────────── */
  const renderSheet = () => {
    if (!sheet) return null;
    const close = () => { setSheet(null); setPayStatus(null); };
    return (
      <Modal visible transparent animationType="slide" onRequestClose={close}>
        <View style={st.modalWrap}>
          <TouchableOpacity style={{ flex: 1 }} onPress={close} />
          <View style={[st.modalSheet, { backgroundColor: T.card }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={[st.handle, { backgroundColor: T.border }]} />

              {sheet === 'paywall' && (<>
                <Text style={st.sheetEmoji}>👑</Text>
                <Text style={[st.sheetTitle, { color: '#F59E0B' }]}>One Campus Premium</Text>
                <Text style={[st.sheetSub, { color: T.subtext }]}>$7.99 / month · cancel anytime</Text>
                {[['⚡', 'Double Points', 'Earn 2x on every join, RSVP, and friend.'], ['🤖', 'AI Day / Night Organizer', 'AI plans your campus day & social night.'], ['🌎', 'All Local Campuses', 'IU, Notre Dame, Butler, Ball State, Rose-Hulman & IUPUI.']].map(([icon, name, desc]) => (
                  <View key={name} style={{ flexDirection: 'row', gap: 12, paddingVertical: 9 }}>
                    <Text style={{ fontSize: 22 }}>{icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: T.text }}>{name}</Text>
                      <Text style={{ fontSize: 12, color: T.subtext }}>{desc}</Text>
                    </View>
                  </View>
                ))}
                <TouchableOpacity onPress={() => setSheet('payment')} style={st.bigBtn}><Text style={st.bigBtnText}>Start Premium — $7.99/mo</Text></TouchableOpacity>
                <TouchableOpacity onPress={close}><Text style={[st.skipText, { color: T.subtext }]}>Maybe later</Text></TouchableOpacity>
                <Text style={[st.fine, { color: T.subtext }]}>Demo only — no real payment is processed.</Text>
              </>)}

              {sheet === 'payment' && (<>
                {payStatus ? (
                  <View style={{ alignItems: 'center', paddingVertical: 30 }}>
                    <Text style={{ fontSize: 48 }}>{payStatus.includes('✅') ? '✅' : payStatus.includes('⏳') ? '⏳' : '👤'}</Text>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: T.text, marginTop: 10 }}>{payStatus}</Text>
                    <Text style={{ fontSize: 12, color: T.subtext, marginTop: 4 }}>One Campus Premium · $7.99/mo</Text>
                  </View>
                ) : (<>
                  <Text style={st.sheetEmoji}>💳</Text>
                  <Text style={[st.sheetTitle, { color: A }]}>Checkout</Text>
                  <Text style={[st.sheetSub, { color: T.subtext }]}>One Campus Premium · $7.99/month</Text>
                  <TouchableOpacity onPress={payApple} style={[st.bigBtn, { backgroundColor: '#000' }]}><Text style={st.bigBtnText}> Pay with Apple Pay</Text></TouchableOpacity>
                  <Text style={{ textAlign: 'center', fontSize: 11, color: T.subtext, marginVertical: 10, fontWeight: '600' }}>— OR PAY WITH CARD —</Text>
                  <TextInput value={cardNum} onChangeText={v => setCardNum(v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19))} placeholder="Card number" placeholderTextColor={T.subtext} keyboardType="number-pad" style={[st.input, { backgroundColor: T.bg, color: T.text, borderColor: T.border }]} />
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TextInput value={cardExp} onChangeText={v => { const d = v.replace(/\D/g, '').slice(0, 4); setCardExp(d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d); }} placeholder="MM/YY" placeholderTextColor={T.subtext} keyboardType="number-pad" style={[st.input, { flex: 1, backgroundColor: T.bg, color: T.text, borderColor: T.border }]} />
                    <TextInput value={cardCvv} onChangeText={setCardCvv} placeholder="CVV" placeholderTextColor={T.subtext} keyboardType="number-pad" secureTextEntry maxLength={4} style={[st.input, { flex: 1, backgroundColor: T.bg, color: T.text, borderColor: T.border }]} />
                  </View>
                  <TextInput value={cardName} onChangeText={setCardName} placeholder="Name on card" placeholderTextColor={T.subtext} style={[st.input, { backgroundColor: T.bg, color: T.text, borderColor: T.border }]} />
                  <TouchableOpacity onPress={payCard} style={st.bigBtn}><Text style={st.bigBtnText}>Pay $7.99 →</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => setSheet('paywall')}><Text style={[st.skipText, { color: T.subtext }]}>‹ Back</Text></TouchableOpacity>
                  <Text style={[st.fine, { color: T.subtext }]}>🔒 Demo checkout — nothing is charged or stored.</Text>
                </>)}
              </>)}

              {sheet === 'planner' && (<>
                <Text style={st.sheetEmoji}>🤖</Text>
                <Text style={[st.sheetTitle, { color: A }]}>Your AI-Planned Day</Text>
                <View style={[st.plannerBlock, { backgroundColor: dark ? '#3A2E1E' : '#FEF3C7' }]}>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: dark ? '#FDE68A' : '#92400E', marginBottom: 8 }}>☀️ DAYTIME</Text>
                  {[['8:30 AM', 'Breakfast at PMU — beats the rush'], ['10:00 AM', 'Career Fair @ PMU Ballrooms — 3 friends going'], ['12:30 PM', 'Lunch with Maya — 4 min from you'], ['2:00 PM', 'Study: WALC 2nd floor is 40% empty'], ['4:30 PM', 'CoRec workout with Tyler']].map(([t, w]) => (
                    <Text key={t} style={{ fontSize: 12.5, color: dark ? '#E8D9B0' : '#78350F', marginBottom: 5 }}><Text style={{ fontWeight: '800' }}>{t}</Text>  {w}</Text>
                  ))}
                </View>
                <View style={[st.plannerBlock, { backgroundColor: '#1a1a2e' }]}>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: '#C7D2FE', marginBottom: 8 }}>🌙 TONIGHT</Text>
                  {[['6:00 PM', 'NSBE Meeting @ ARMS — ~100 pts (2x)'], ['7:30 PM', 'Hack Purdue — Maya needs a frontend dev'], ['9:30 PM', 'Astronomy Night rooftop hangout'], ['11:00 PM', 'Wind down — quiz at 10:30 tomorrow']].map(([t, w]) => (
                    <Text key={t} style={{ fontSize: 12.5, color: '#E0E7FF', marginBottom: 5 }}><Text style={{ fontWeight: '800', color: '#A5B4FC' }}>{t}</Text>  {w}</Text>
                  ))}
                </View>
                <TouchableOpacity onPress={() => { close(); const earned = addPoints(25); showToast(`Day added to calendar! 📅 +${earned} pts`); }} style={st.bigBtn}><Text style={st.bigBtnText}>Add All to My Calendar</Text></TouchableOpacity>
              </>)}

              {sheet === 'addEvent' && (<>
                <Text style={st.sheetEmoji}>📅</Text>
                <Text style={[st.sheetTitle, { color: A }]}>Create Event</Text>
                <Text style={[st.label, { color: T.subtext }]}>EVENT NAME</Text>
                <TextInput value={evName} onChangeText={setEvName} placeholder="e.g. CS Study Jam" placeholderTextColor={T.subtext} style={[st.input, { backgroundColor: T.bg, color: T.text, borderColor: T.border }]} />
                <Text style={[st.label, { color: T.subtext }]}>DAY</Text>
                <View style={{ flexDirection: 'row', gap: 5 }}>
                  {DAY_NAMES.map((d, i) => (
                    <TouchableOpacity key={d} onPress={() => setEvDay(i)} style={[st.dayPick, { backgroundColor: evDay === i ? A : T.bg, borderColor: T.border }]}>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: evDay === i ? 'white' : T.subtext }}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[st.label, { color: T.subtext }]}>TIME</Text>
                    <TextInput value={evTime} onChangeText={setEvTime} placeholder="7:00" placeholderTextColor={T.subtext} style={[st.input, { backgroundColor: T.bg, color: T.text, borderColor: T.border }]} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[st.label, { color: T.subtext }]}>AM / PM</Text>
                    <TouchableOpacity onPress={() => setEvAmpm(a => a === 'PM' ? 'AM' : 'PM')} style={[st.input, { backgroundColor: T.bg, borderColor: T.border, justifyContent: 'center' }]}>
                      <Text style={{ color: T.text, fontWeight: '700' }}>{evAmpm} ⇄</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={[st.label, { color: T.subtext }]}>LOCATION</Text>
                <TextInput value={evLoc} onChangeText={setEvLoc} placeholder="e.g. WALC 2nd Floor" placeholderTextColor={T.subtext} style={[st.input, { backgroundColor: T.bg, color: T.text, borderColor: T.border }]} />
                <Text style={[st.label, { color: T.subtext }]}>COLOR</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {EV_COLORS.map(c => (
                    <TouchableOpacity key={c} onPress={() => setEvColor(c)} style={[st.colorDot, { backgroundColor: c, borderWidth: evColor === c ? 3 : 0, borderColor: T.text }]} />
                  ))}
                </View>
                <TouchableOpacity onPress={createEvent} style={st.bigBtn}><Text style={st.bigBtnText}>Create Event ⚡</Text></TouchableOpacity>
                <TouchableOpacity onPress={close}><Text style={[st.skipText, { color: T.subtext }]}>Cancel</Text></TouchableOpacity>
              </>)}

              {sheet === 'charity' && (<>
                <Text style={st.sheetEmoji}>❤️</Text>
                <Text style={[st.sheetTitle, { color: A }]}>Pick Your Cause</Text>
                <Text style={[st.sheetSub, { color: T.subtext }]}>1,000 pts → One Campus donates $1 where you vote</Text>
                {CAUSES.map(c => (
                  <TouchableOpacity key={c.name} onPress={() => finishRedeem(REWARDS.find(r => r.id === 'charity'), c.name)} style={[st.causeRow, { borderColor: T.border }]}>
                    <Text style={{ fontSize: 20 }}>{c.emoji}</Text>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: T.text, marginLeft: 10 }}>{c.name}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={close}><Text style={[st.skipText, { color: T.subtext }]}>Cancel</Text></TouchableOpacity>
              </>)}

              {sheet === 'reward' && rewardResult && (<>
                <Text style={st.sheetEmoji}>{rewardResult.cause ? '❤️' : '🎉'}</Text>
                <Text style={[st.sheetTitle, { color: A }]}>{rewardResult.cause ? 'Donation Made!' : 'Reward Unlocked!'}</Text>
                {rewardResult.cause ? (
                  <Text style={[st.sheetSub, { color: T.subtext }]}>One Campus is donating $1 to {rewardResult.cause} on behalf of students like you. 💜</Text>
                ) : (<>
                  <Text style={[st.sheetSub, { color: T.subtext }]}>Show this code at the register:</Text>
                  <View style={[st.codeBox, { borderColor: A }]}><Text style={{ fontSize: 22, fontWeight: '900', color: A, letterSpacing: 3 }}>{rewardResult.code}</Text></View>
                </>)}
                <Text style={{ textAlign: 'center', fontSize: 12, color: T.subtext, marginTop: 8 }}>New balance: ⚡ {points.toLocaleString()}</Text>
                <TouchableOpacity onPress={close} style={st.bigBtn}><Text style={st.bigBtnText}>Done</Text></TouchableOpacity>
              </>)}

              {sheet === 'cancelSub' && (<>
                <Text style={st.sheetEmoji}>😢</Text>
                <Text style={[st.sheetTitle, { color: '#F59E0B' }]}>Cancel Premium?</Text>
                <Text style={[st.sheetSub, { color: T.subtext }]}>You'll lose 2x points, the AI organizer, and all-campus access.</Text>
                <TouchableOpacity onPress={close} style={st.bigBtn}><Text style={st.bigBtnText}>Keep Premium 👑</Text></TouchableOpacity>
                <TouchableOpacity onPress={cancelSub}><Text style={[st.skipText, { color: '#EF4444', fontWeight: '700' }]}>Cancel anyway</Text></TouchableOpacity>
              </>)}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  /* ─────────── CHAT SCREEN ─────────── */
  const renderChat = () => {
    if (!chatWith) return null;
    const f = FRIENDS.find(x => x.name === chatWith) || { name: chatWith, initial: chatWith[0], color: A, online: true };
    const msgs = chats[chatWith] || [];
    return (
      <Modal visible animationType="slide" onRequestClose={() => setChatWith(null)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <View style={[st.chatHeader, { backgroundColor: T.card, borderColor: T.border }]}>
              <TouchableOpacity onPress={() => setChatWith(null)}><Text style={{ fontSize: 24, color: A, paddingRight: 10 }}>‹</Text></TouchableOpacity>
              <View style={[st.avatar, { backgroundColor: f.color }]}><Text style={{ color: 'white', fontWeight: '700' }}>{f.initial}</Text></View>
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontSize: 15, fontWeight: '800', color: T.text }}>{f.name}</Text>
                <Text style={{ fontSize: 11, color: f.online ? '#22c55e' : T.subtext, fontWeight: '600' }}>{f.online ? '● Active now' : 'Offline'}</Text>
              </View>
            </View>
            <FlatList
              ref={chatScroll}
              data={chatTyping ? [...msgs, { who: 'typing' }] : msgs}
              keyExtractor={(_, i) => String(i)}
              contentContainerStyle={{ padding: 14, gap: 8 }}
              onContentSizeChange={() => chatScroll.current?.scrollToEnd({ animated: true })}
              renderItem={({ item }) => item.who === 'typing' ? (
                <View style={[st.msgThem, { backgroundColor: T.card }]}><Text style={{ color: T.subtext }}>● ● ●</Text></View>
              ) : (
                <View style={item.who === 'me' ? st.msgMe : [st.msgThem, { backgroundColor: T.card }]}>
                  <Text style={{ color: item.who === 'me' ? 'white' : T.text, fontSize: 14, lineHeight: 20 }}>{item.text}</Text>
                </View>
              )}
            />
            <View style={[st.chatBar, { backgroundColor: T.card, borderColor: T.border }]}>
              <TextInput value={chatInput} onChangeText={setChatInput} placeholder="Message..." placeholderTextColor={T.subtext}
                onSubmitEditing={sendChat} returnKeyType="send"
                style={[st.chatInput, { backgroundColor: T.bg, color: T.text }]} />
              <TouchableOpacity onPress={sendChat} style={st.sendBtn}><Text style={{ color: 'white', fontSize: 16 }}>➤</Text></TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    );
  };

  /* ─────────── SETTINGS ─────────── */
  const renderSettingsModal = () => (
    <Modal visible={showSettings} animationType="slide" onRequestClose={() => setShowSettings(false)}>
      <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
        <View style={[st.chatHeader, { backgroundColor: T.card, borderColor: T.border }]}>
          <TouchableOpacity onPress={() => setShowSettings(false)}><Text style={{ fontSize: 24, color: A, paddingRight: 10 }}>‹</Text></TouchableOpacity>
          <View>
            <Text style={{ fontSize: 16, fontWeight: '800', color: T.text }}>Settings</Text>
            <Text style={{ fontSize: 11, color: T.subtext }}>{profile.name} · {profile.major}</Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text style={[st.sectionLabel, { color: T.subtext }]}>SUBSCRIPTION</Text>
          <View style={[st.setCard, { backgroundColor: T.card }]}>
            {isPremium ? (<>
              <View style={st.setRow}>
                <Text style={{ fontSize: 18 }}>👑</Text>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: T.text }}>One Campus Premium</Text>
                  <Text style={{ fontSize: 11, color: T.subtext }}>$7.99/mo · renews July 10, 2026</Text>
                </View>
                <Text style={{ fontSize: 11, fontWeight: '800', color: '#22c55e' }}>ACTIVE</Text>
              </View>
              <TouchableOpacity onPress={() => { setShowSettings(false); setSheet('cancelSub'); }} style={[st.setRow, { borderTopWidth: 1, borderColor: T.border }]}>
                <Text style={{ fontSize: 16 }}>✕</Text>
                <Text style={{ flex: 1, marginLeft: 10, fontSize: 14, fontWeight: '700', color: '#EF4444' }}>Cancel Subscription</Text>
                <Text style={{ color: T.subtext }}>›</Text>
              </TouchableOpacity>
            </>) : (
              <TouchableOpacity onPress={() => { setShowSettings(false); setSheet('paywall'); }} style={st.setRow}>
                <Text style={{ fontSize: 18 }}>👑</Text>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: T.text }}>Upgrade to Premium</Text>
                  <Text style={{ fontSize: 11, color: T.subtext }}>2x points · AI organizer · all campuses</Text>
                </View>
                <Text style={{ color: T.subtext }}>›</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={[st.sectionLabel, { color: T.subtext }]}>PROFILE</Text>
          <View style={[st.setCard, { backgroundColor: T.card }]}>
            <View style={st.setRow}>
              <View style={[st.avatar, { backgroundColor: A }]}><Text style={{ color: 'white', fontWeight: '700' }}>{initials}</Text></View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <TextInput value={profile.name} onChangeText={v => setProfile(p => ({ ...p, name: v }))}
                  placeholder="Your name" placeholderTextColor={T.subtext}
                  style={{ fontSize: 14, fontWeight: '700', color: T.text, padding: 0 }} />
                <TextInput value={profile.major} onChangeText={v => setProfile(p => ({ ...p, major: v }))}
                  placeholder="Your major / school" placeholderTextColor={T.subtext}
                  style={{ fontSize: 11, color: T.subtext, padding: 0 }} />
              </View>
              <Text style={{ fontSize: 11, color: T.subtext }}>✏️ tap to edit</Text>
            </View>
          </View>

          <Text style={[st.sectionLabel, { color: T.subtext }]}>APPEARANCE</Text>
          <View style={[st.setCard, { backgroundColor: T.card }]}>
            <View style={st.setRow}>
              <Text style={{ fontSize: 18 }}>{dark ? '🌙' : '☀️'}</Text>
              <Text style={{ flex: 1, marginLeft: 10, fontSize: 14, fontWeight: '700', color: T.text }}>Dark Mode</Text>
              <Switch value={dark} onValueChange={v => { setDark(v); showToast(v ? '🌙 Dark mode on' : '☀️ Light mode on'); }} trackColor={{ true: A }} />
            </View>
            <View style={[st.setRow, { borderTopWidth: 1, borderColor: T.border }]}>
              <Text style={{ fontSize: 18 }}>🎨</Text>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: T.text }}>Accent Color</Text>
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
                  {[['#7C3AED', 'Purple'], ['#0EA5E9', 'Blue'], ['#10B981', 'Green'], ['#FF6B35', 'Orange'], ['#EC4899', 'Pink']].map(([c, label]) => (
                    <TouchableOpacity key={c} onPress={() => { setAccent(c); showToast(`🎨 ${label} theme on!`); }}
                      style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c, borderWidth: accent === c ? 3 : 0, borderColor: T.text, alignItems: 'center', justifyContent: 'center' }}>
                      {accent === c && <Text style={{ color: 'white', fontSize: 12, fontWeight: '900' }}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
          <Text style={[st.sectionLabel, { color: T.subtext }]}>PRIVACY</Text>
          <View style={[st.setCard, { backgroundColor: T.card }]}>
            <View style={st.setRow}>
              <Text style={{ fontSize: 18 }}>📍</Text>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: T.text }}>Share My Location</Text>
                <Text style={{ fontSize: 11, color: T.subtext }}>{settings.location ? 'Friends can see you on campus' : "You're invisible 👻"}</Text>
              </View>
              <Switch value={settings.location} onValueChange={v => { setSettings(s => ({ ...s, location: v })); showToast(v ? '📍 Location sharing on' : '👻 You\'re now invisible'); }} trackColor={{ true: A }} />
            </View>
            <View style={[st.setRow, { borderTopWidth: 1, borderColor: T.border }]}>
              <Text style={{ fontSize: 18 }}>🏆</Text>
              <Text style={{ flex: 1, marginLeft: 10, fontSize: 14, fontWeight: '700', color: T.text }}>Show on Leaderboard</Text>
              <Switch value={settings.leaderboard} onValueChange={v => setSettings(s => ({ ...s, leaderboard: v }))} trackColor={{ true: A }} />
            </View>
          </View>
          <Text style={[st.sectionLabel, { color: T.subtext }]}>NOTIFICATIONS</Text>
          <View style={[st.setCard, { backgroundColor: T.card }]}>
            <View style={st.setRow}>
              <Text style={{ fontSize: 18 }}>🔔</Text>
              <Text style={{ flex: 1, marginLeft: 10, fontSize: 14, fontWeight: '700', color: T.text }}>Push Notifications</Text>
              <Switch value={settings.notifications} onValueChange={v => { setSettings(s => ({ ...s, notifications: v })); showToast(v ? '🔔 Notifications on' : '🔕 All notifications muted'); }} trackColor={{ true: A }} />
            </View>
            {settings.notifications && (<>
              <View style={[st.setRow, { borderTopWidth: 1, borderColor: T.border }]}>
                <Text style={{ fontSize: 16 }}>📅</Text>
                <Text style={{ flex: 1, marginLeft: 10, fontSize: 13, fontWeight: '600', color: T.text }}>Event reminders</Text>
                <Switch value={settings.notifEvents} onValueChange={v => setSettings(s => ({ ...s, notifEvents: v }))} trackColor={{ true: A }} />
              </View>
              <View style={[st.setRow, { borderTopWidth: 1, borderColor: T.border }]}>
                <Text style={{ fontSize: 16 }}>💬</Text>
                <Text style={{ flex: 1, marginLeft: 10, fontSize: 13, fontWeight: '600', color: T.text }}>Direct messages</Text>
                <Switch value={settings.notifDMs} onValueChange={v => setSettings(s => ({ ...s, notifDMs: v }))} trackColor={{ true: A }} />
              </View>
              <View style={[st.setRow, { borderTopWidth: 1, borderColor: T.border }]}>
                <Text style={{ fontSize: 16 }}>🤝</Text>
                <Text style={{ flex: 1, marginLeft: 10, fontSize: 13, fontWeight: '600', color: T.text }}>Friend requests</Text>
                <Switch value={settings.notifRequests} onValueChange={v => setSettings(s => ({ ...s, notifRequests: v }))} trackColor={{ true: A }} />
              </View>
              <View style={[st.setRow, { borderTopWidth: 1, borderColor: T.border }]}>
                <Text style={{ fontSize: 16 }}>😴</Text>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: T.text }}>Quiet Hours</Text>
                  <Text style={{ fontSize: 11, color: T.subtext }}>{settings.quietHours ? 'Silenced 11 PM – 8 AM' : 'Off — notifications anytime'}</Text>
                </View>
                <Switch value={settings.quietHours} onValueChange={v => { setSettings(s => ({ ...s, quietHours: v })); showToast(v ? '😴 Quiet hours: 11 PM – 8 AM' : 'Quiet hours off'); }} trackColor={{ true: A }} />
              </View>
            </>)}
          </View>

          <Text style={[st.sectionLabel, { color: T.subtext }]}>ACCOUNT</Text>
          <View style={[st.setCard, { backgroundColor: T.card }]}>
            <TouchableOpacity onPress={() => {
              setPoints(2456); setJoined([]); setRsvpd([]); setLiked([]); setRedeemed([]); setEvents(INITIAL_EVENTS); setChats(STARTER_CHATS);
              showToast('🗑️ Demo data reset — fresh start!');
            }} style={st.setRow}>
              <Text style={{ fontSize: 18 }}>🗑️</Text>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: T.text }}>Reset Demo Data</Text>
                <Text style={{ fontSize: 11, color: T.subtext }}>Points, clubs, RSVPs & chats back to start</Text>
              </View>
              <Text style={{ color: T.subtext }}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={doSignOut} style={[st.setRow, { borderTopWidth: 1, borderColor: T.border }]}>
              <Text style={{ fontSize: 18 }}>🚪</Text>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#EF4444' }}>Sign Out</Text>
                <Text style={{ fontSize: 11, color: T.subtext }}>{user?.email || ''}</Text>
              </View>
              <Text style={{ color: T.subtext }}>›</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ textAlign: 'center', fontSize: 11, color: T.subtext, marginTop: 20 }}>One Campus v1.0 · Made with 💜 at Purdue</Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  /* ─────────── LOGIN SCREEN ─────────── */
  if (!authReady) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 44 }}>🎓</Text>
        <Text style={{ fontSize: 18, fontWeight: '800', color: A, marginTop: 8 }}>One Campus</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
        <StatusBar style={dark ? 'light' : 'dark'} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 26 }}>
            <View style={{ alignItems: 'center', marginBottom: 26 }}>
              <View style={[st.logoIcon, { width: 64, height: 64, borderRadius: 18 }]}><Text style={{ fontSize: 32 }}>🎓</Text></View>
              <Text style={{ fontSize: 26, fontWeight: '900', color: A, marginTop: 12 }}>One Campus</Text>
              <Text style={{ fontSize: 13, color: T.subtext, marginTop: 4 }}>Your campus. Your people. One app.</Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 18 }}>
              {[['signin', 'Sign In'], ['signup', 'Create Account']].map(([k, label]) => (
                <TouchableOpacity key={k} onPress={() => setAuthMode(k)} style={[st.tabBtn, { backgroundColor: authMode === k ? A : T.card }]}>
                  <Text style={{ color: authMode === k ? 'white' : T.subtext, fontSize: 13, fontWeight: '700' }}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {authMode === 'signup' && (
              <TextInput value={authName} onChangeText={setAuthName} placeholder="Full name" placeholderTextColor={T.subtext}
                autoCapitalize="words" style={[st.input, { backgroundColor: T.card, color: T.text, borderColor: T.border }]} />
            )}
            <TextInput value={authEmail} onChangeText={setAuthEmail} placeholder="Email" placeholderTextColor={T.subtext}
              autoCapitalize="none" keyboardType="email-address" autoComplete="email"
              style={[st.input, { backgroundColor: T.card, color: T.text, borderColor: T.border }]} />
            <TextInput value={authPass} onChangeText={setAuthPass} placeholder="Password (6+ characters)" placeholderTextColor={T.subtext}
              secureTextEntry autoCapitalize="none"
              style={[st.input, { backgroundColor: T.card, color: T.text, borderColor: T.border }]} />

            <TouchableOpacity onPress={doAuth} disabled={authBusy} style={[st.bigBtn, authBusy && { opacity: 0.6 }]}>
              <Text style={st.bigBtnText}>{authBusy ? 'One sec...' : authMode === 'signup' ? 'Create My Account 🚀' : 'Sign In →'}</Text>
            </TouchableOpacity>

            <Text style={{ textAlign: 'center', fontSize: 11, color: T.subtext, marginTop: 18, lineHeight: 17 }}>
              Real accounts powered by Firebase 🔥{'\n'}Google sign-in works on the website — onecampus web portal
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
        {toast && <View style={st.toast}><Text style={{ color: 'white', fontWeight: '600', fontSize: 13, textAlign: 'center' }}>{toast}</Text></View>}
      </SafeAreaView>
    );
  }

  /* ─────────── MAIN ─────────── */
  const TABS = [
    ['discover', '🧭', 'Discover'], ['events', '📅', 'Events'], ['campus', '🗺️', 'Campus'], ['points', '🏆', 'Points'], ['connect', '👥', 'Connect'],
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <View style={[st.header, { backgroundColor: T.bg }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={st.logoIcon}><Text style={{ fontSize: 18 }}>🎓</Text></View>
          <Text style={{ fontSize: 17, fontWeight: '800', color: A }}>One Campus</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={[st.ptsBadge, isPremium && { backgroundColor: '#F59E0B' }]}>
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 13 }}>{isPremium ? '👑' : '⚡'} {points.toLocaleString()} pts</Text>
          </View>
          <TouchableOpacity onPress={() => setShowSettings(true)} style={[st.gearBtn, { backgroundColor: T.card }]}><Text style={{ fontSize: 15 }}>⚙️</Text></TouchableOpacity>
        </View>
      </View>

      {tab === 'discover' && renderDiscover()}
      {tab === 'events' && renderEvents()}
      {tab === 'campus' && renderCampus()}
      {tab === 'points' && renderPoints()}
      {tab === 'connect' && renderConnect()}

      <View style={[st.tabBar, { backgroundColor: T.card, borderColor: T.border }]}>
        {TABS.map(([key, icon, label]) => (
          <TouchableOpacity key={key} onPress={() => setTab(key)} style={[st.navBtn, tab === key && { backgroundColor: A }]}>
            <Text style={{ fontSize: 18 }}>{icon}</Text>
            <Text style={{ fontSize: 9, fontWeight: '600', color: tab === key ? 'white' : T.subtext }}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {toast && (
        <View style={st.toast}><Text style={{ color: 'white', fontWeight: '600', fontSize: 13, textAlign: 'center' }}>{toast}</Text></View>
      )}

      {renderSheet()}
      {renderChat()}
      {renderSettingsModal()}
    </SafeAreaView>
  );
}

/* ─────────── THEMES & STYLES ─────────── */
const LIGHTTHEME = { bg: '#F5F3FF', card: '#FFFFFF', text: '#1a1a2e', subtext: '#6B7280', border: '#E9D5FF' };
const DARKTHEME = { bg: '#15131F', card: '#221E33', text: '#F3F4F6', subtext: '#8B85A0', border: '#2E2942' };

const makeStyles = (A) => StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  logoIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: A, alignItems: 'center', justifyContent: 'center' },
  ptsBadge: { backgroundColor: '#FF6B35', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 18 },
  gearBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '800' },
  sub: { fontSize: 13, marginTop: 2 },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginVertical: 8 },
  pill: { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 18 },
  clubCard: { borderRadius: 22, padding: 20, minHeight: 240, justifyContent: 'flex-end', marginTop: 4 },
  clubTag: { backgroundColor: 'rgba(255,255,255,0.25)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, marginBottom: 8 },
  clubName: { fontSize: 24, fontWeight: '800', color: 'white', marginBottom: 4 },
  clubDesc: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 10 },
  metaPill: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  metaPillText: { color: 'white', fontSize: 11, fontWeight: '600' },
  actionBtn: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
  addBtn: { width: 42, height: 42, borderRadius: 13, backgroundColor: A, alignItems: 'center', justifyContent: 'center' },
  dayCell: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 12, gap: 3 },
  dot: { width: 5, height: 5, borderRadius: 3 },
  eventCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, padding: 12, marginBottom: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 9 },
  buildingCard: { borderRadius: 16, padding: 14 },
  friendChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14 },
  clubRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 10, marginTop: 10, borderTopWidth: 1 },
  heroCard: { backgroundColor: A, borderRadius: 22, padding: 18 },
  heroAvatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  upgradeBanner: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 12, marginTop: 12 },
  upgradeBtn: { backgroundColor: '#FF6B35', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 11 },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 12 },
  badgeCard: { width: '47.5%', borderRadius: 14, padding: 12, alignItems: 'center' },
  leaderRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 12, marginBottom: 8 },
  rewardRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 12, marginBottom: 8 },
  redeemBtn: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 11 },
  friendRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 11, marginBottom: 8 },
  avatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  postCard: { borderRadius: 16, padding: 13, marginBottom: 10 },
  ctaBtn: { borderRadius: 11, paddingVertical: 9, alignItems: 'center', marginTop: 4 },
  tabBar: { flexDirection: 'row', paddingHorizontal: 8, paddingTop: 7, paddingBottom: 7, borderTopWidth: 1 },
  navBtn: { flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: 12, gap: 1 },
  toast: { position: 'absolute', bottom: 90, alignSelf: 'center', backgroundColor: '#1a1a2e', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 18, maxWidth: '88%' },
  modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 20, maxHeight: '88%' },
  handle: { width: 40, height: 4, borderRadius: 3, alignSelf: 'center', marginBottom: 14 },
  sheetEmoji: { fontSize: 42, textAlign: 'center' },
  sheetTitle: { fontSize: 22, fontWeight: '900', textAlign: 'center', marginTop: 4 },
  sheetSub: { fontSize: 13, textAlign: 'center', marginTop: 4, marginBottom: 12, lineHeight: 19 },
  bigBtn: { backgroundColor: A, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 12 },
  bigBtnText: { color: 'white', fontSize: 15, fontWeight: '800' },
  skipText: { textAlign: 'center', fontSize: 13, paddingVertical: 11 },
  fine: { fontSize: 10, textAlign: 'center', opacity: 0.7 },
  input: { borderRadius: 13, borderWidth: 1.5, paddingHorizontal: 13, paddingVertical: 11, fontSize: 14, marginBottom: 10 },
  label: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 6, marginTop: 4 },
  dayPick: { flex: 1, paddingVertical: 8, borderRadius: 10, borderWidth: 1, alignItems: 'center', marginBottom: 10 },
  colorDot: { width: 32, height: 32, borderRadius: 16, marginBottom: 10 },
  causeRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 13, padding: 13, marginBottom: 8 },
  codeBox: { borderWidth: 2, borderStyle: 'dashed', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 6 },
  plannerBlock: { borderRadius: 14, padding: 13, marginBottom: 10 },
  chatHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1 },
  msgThem: { alignSelf: 'flex-start', maxWidth: '75%', borderRadius: 16, borderBottomLeftRadius: 5, padding: 11 },
  msgMe: { alignSelf: 'flex-end', maxWidth: '75%', backgroundColor: A, borderRadius: 16, borderBottomRightRadius: 5, padding: 11 },
  chatBar: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderTopWidth: 1 },
  chatInput: { flex: 1, borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, fontSize: 14 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: A, alignItems: 'center', justifyContent: 'center' },
  setCard: { borderRadius: 14, overflow: 'hidden', marginBottom: 6 },
  setRow: { flexDirection: 'row', alignItems: 'center', padding: 13 },
});
