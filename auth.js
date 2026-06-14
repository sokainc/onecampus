// ── REAL FIREBASE AUTHENTICATION ──
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth, GoogleAuthProvider, signInWithPopup,
  onAuthStateChanged, signOut,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBZme2DEX_aubcTBjMviqgEpPk0Z15CzGs',
  authDomain: 'one-campus-acdc6.firebaseapp.com',
  projectId: 'one-campus-acdc6',
  storageBucket: 'one-campus-acdc6.firebasestorage.app',
  messagingSenderId: '673557735993',
  appId: '1:673557735993:web:5084d747e39ee688febbe8',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
// always show the account picker instead of auto-signing into the last account
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ── REAL GOOGLE SIGN-IN (overrides the demo handler in app.js) ──
let oauthBusy = false;
window.handleOAuth = async function (provider) {
  if (provider !== 'Google') {
    showToast(`${provider} sign-in coming soon — use Google for now!`);
    return;
  }
  if (location.protocol === 'file:') {
    showToast('⚠️ Open the site via a local server or the live link for Google sign-in');
    return;
  }
  if (oauthBusy) return;            // ignore rapid double-clicks
  oauthBusy = true;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // One Campus is students-only — require a .edu school email
    if (!/(\.edu|\.k12\.[a-z]{2}\.us)$/i.test(result.user.email || '')) {
      await signOut(auth);
      showToast('🎓 One Campus is for students — sign in with your school email (.edu or K-12 school email)');
      return;
    }
    closeModal();
    showToast(`🎉 Welcome, ${result.user.displayName}!`);
  } catch (err) {
    if (err.code === 'auth/cancelled-popup-request') {
      /* harmless — another popup request took over */
    } else if (err.code === 'auth/popup-closed-by-user') {
      showToast('Sign-in canceled');
    } else if (err.code === 'auth/unauthorized-domain') {
      showToast('⚠️ This domain needs to be added in Firebase → Auth → Settings → Authorized domains');
    } else {
      showToast(`Sign-in error: ${err.code || err.message}`);
    }
  } finally {
    oauthBusy = false;
  }
};

// email form stays demo for now (real email sign-in comes with the backend phase)
window.handleEmail = function (e) {
  e.preventDefault();
  showToast('Email sign-in coming soon — use “Continue with Google”! 👆');
};

// ── SIGNED-IN STATE: swap the navbar button for the user chip ──
const signInBtn = document.getElementById('openLoginBtn');

onAuthStateChanged(auth, (user) => {
  if (user) {
    signInBtn.innerHTML = `
      <span style="display:inline-flex;align-items:center;gap:8px">
        ${user.photoURL ? `<img src="${user.photoURL}" alt="" style="width:22px;height:22px;border-radius:50%">` : '👤'}
        ${user.displayName ? user.displayName.split(' ')[0] : 'Account'} · Sign out
      </span>`;
    signInBtn.onclick = async (ev) => {
      ev.stopImmediatePropagation();
      await signOut(auth);
      showToast('Signed out 👋');
    };
  } else {
    signInBtn.textContent = 'Sign In';
    signInBtn.onclick = null; // falls back to the modal-open listener in app.js
  }
});
