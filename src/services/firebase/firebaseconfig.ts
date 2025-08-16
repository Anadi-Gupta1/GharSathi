// Demo Firebase configuration - Replace with actual Firebase config in production
// For now, we'll create mock implementations to allow the app to run

interface MockAuth {
  currentUser: any;
}

interface MockDB {
  collection: (name: string) => any;
}

interface MockStorage {
  ref: (path: string) => any;
}

// Mock Firebase services for demo
const auth: MockAuth = {
  currentUser: null,
};

const db: MockDB = {
  collection: (name: string) => ({
    doc: (id: string) => ({
      get: () => Promise.resolve({ exists: false, data: () => null }),
      set: (data: any) => Promise.resolve(),
      update: (data: any) => Promise.resolve(),
    }),
    add: (data: any) => Promise.resolve({ id: 'mock-id' }),
  }),
};

const storage: MockStorage = {
  ref: (path: string) => ({
    put: (file: any) => Promise.resolve({ ref: { getDownloadURL: () => Promise.resolve('mock-url') } }),
  }),
};

const analytics = null;

// Mock Firebase functions for compatibility
export const signInWithEmailAndPassword = (auth: any, email: string, password: string) => 
  Promise.resolve({ user: { uid: 'demo-user', email } });

export const GoogleAuthProvider = {
  credential: (idToken: string | null, accessToken: string) => ({ providerId: 'google.com' }),
};

export const signInWithCredential = (auth: any, credential: any) => 
  Promise.resolve({ user: { uid: 'demo-user', email: 'demo@example.com', displayName: 'Demo User' } });

export const PhoneAuthProvider = {
  credential: (verificationId: string, code: string) => ({ providerId: 'phone' }),
};

export const signInWithPhoneNumber = (auth: any, phone: string) => 
  Promise.resolve({ confirm: (code: string) => Promise.resolve({ user: { uid: 'demo-user', phoneNumber: phone } }) });

export const RecaptchaVerifier = function(this: any, elementId: string, options: any, auth: any) {
  return { verify: () => Promise.resolve('recaptcha-token') };
};

export const doc = (db: any, collection: string, id: string) => ({
  get: () => Promise.resolve({ exists: false, data: () => null }),
  set: (data: any) => Promise.resolve(),
  update: (data: any) => Promise.resolve(),
});

export const getDoc = (docRef: any) => docRef.get();
export const setDoc = (docRef: any, data: any) => docRef.set(data);
export const updateDoc = (docRef: any, data: any) => docRef.update(data);

export { auth, db, storage, analytics };
export default { auth, db, storage, analytics };