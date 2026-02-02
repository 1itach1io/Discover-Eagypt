// search.js - Search Functionality

import { db } from '../firebase/firebase.js';
import { collection, getDocs } from "firebase/firestore";

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const exploreList = document.getElementById('explore-list');
const noResults = document.getElementById('no-results');

// Fetch Places from Firestore
async function getPlaces() {
    const placesCol = collection(db, 'places');
    const snapshot = await getDocs(placesCol);
    return snapshot.docs.map(doc => doc.data());
}

// Display Places
function displayPlaces(places) {
    exploreList.innerHTML = '';
    if (places.length === 0) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
        places.forEach(place => {
            const card = document.createElement('div');
            card.className = 'place-card';
            card.innerHTML = `
        <h3>${place.name}</h3>
        <p>Governorate: ${place.governorate}</p>
        <p>Type: ${place.type}</p>
      `;
            exploreList.appendChild(card);
        });
    }
    // Scroll to Explore Section
    document.getElementById('explore').scrollIntoView({ behavior: 'smooth' });
}

// Search Event (live filter on input)
let allPlaces = [];
getPlaces().then(places => allPlaces = places);

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = allPlaces.filter(place =>
        place.name.toLowerCase().includes(query) ||
        place.governorate.toLowerCase().includes(query) ||
        place.type.toLowerCase().includes(query)
    );
    displayPlaces(filtered);
});

// Search Button (same as input)
searchBtn.addEventListener('click', () => {
    // Trigger input event manually
    searchInput.dispatchEvent(new Event('input'));
});