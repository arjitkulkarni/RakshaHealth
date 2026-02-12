// Script to update existing users with ABHA profiles
const { createABHAProfile } = require('./src/lib/abha.ts');

// Get existing users from localStorage simulation
const fs = require('fs');
const path = require('path');

// This script would be run in browser console
// For now, let's create a simple instruction
console.log(`
To manually add ABHA ID to existing user:

1. Open browser developer console (F12)
2. Run this code:

// Get current user
const currentUser = JSON.parse(localStorage.getItem('medination_current_user'));
if (currentUser && !currentUser.abhaProfile) {
  // Create ABHA profile
  const abhaProfile = {
    abhaNumber: Math.random().toString().slice(2, 16).replace(/(\\d{4})(\\d{4})(\\d{4})(\\d{2})/, '$1-$2-$3$4'),
    abhaAddress: currentUser.name.toLowerCase().replace(/\\s/g, '') + Math.floor(Math.random() * 9999) + '@abha',
    name: currentUser.name,
    dateOfBirth: currentUser.dateOfBirth,
    gender: 'O',
    mobile: currentUser.phoneNumber,
    isActive: true,
    createdAt: new Date().toISOString()
  };
  
  // Update user
  currentUser.abhaProfile = abhaProfile;
  
  // Save to localStorage
  localStorage.setItem('medination_current_user', JSON.stringify(currentUser));
  
  // Update users array
  const users = JSON.parse(localStorage.getItem('medination_users') || '[]');
  const updatedUsers = users.map(u => u.id === currentUser.id ? currentUser : u);
  localStorage.setItem('medination_users', JSON.stringify(updatedUsers));
  
  console.log('ABHA profile added successfully!');
  console.log('ABHA Number:', abhaProfile.abhaNumber);
  console.log('ABHA Address:', abhaProfile.abhaAddress);
  
  // Reload page to see changes
  window.location.reload();
} else if (currentUser && currentUser.abhaProfile) {
  console.log('User already has ABHA profile:');
  console.log('ABHA Number:', currentUser.abhaProfile.abhaNumber);
  console.log('ABHA Address:', currentUser.abhaProfile.abhaAddress);
} else {
  console.log('No user found. Please login first.');
}
`);
