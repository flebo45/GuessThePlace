/**
 * Calculates the distance between a guessed location and the actual photo location using the Haversine formula.
 * @param {Object} guess - The guessed location with 'lat' and 'lng' properties.
 * @param {Object} photo - The actual photo location with 'lat' and 'lng' properties.
 * @returns {number} - The distance in kilometers.
 */
export function calculateDistance(guess, photo) {
  const toRad = val => (val * Math.PI) / 180;

  const R = 6371; // Radius of the Earth in km
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

  return R * c; // distance in km
}





