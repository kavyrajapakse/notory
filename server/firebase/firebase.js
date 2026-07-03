const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
require('dotenv').config();

// Load service account credentials
const serviceAccountPath = path.resolve(__dirname, './service-account.json');
const serviceAccount = require(serviceAccountPath);

// Initialize Firebase Admin App
initializeApp({
  credential: cert(serviceAccount)
});

// Get Firestore Database reference
const db = getFirestore();

module.exports = db;