// src/domain/services/DistanceCalculator.js

export function calculateDistance(guess, photo) {
  const toRad = val => (val * Math.PI) / 180;

  const R = 6371; // Raggio Terra in km
  const dLat = toRad(photo.lat - guess.lat);
  const dLon = toRad(photo.lng - guess.lng);
  const lat1 = toRad(guess.lat);
  const lat2 = toRad(photo.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(lat1) *
      Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distanza in km
}





