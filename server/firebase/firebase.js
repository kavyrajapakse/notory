const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
require('dotenv').config();

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Production (Vercel): Parse the JSON credentials string from env variables
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // Local Development: Read from your local file
  const serviceAccountPath = path.resolve(__dirname, './service-account.json');
  serviceAccount = require(serviceAccountPath);
}

// Initialize Firebase Admin App
initializeApp({
  credential: cert(serviceAccount)
});

// Get Firestore Database reference
const db = getFirestore();

module.exports = db;