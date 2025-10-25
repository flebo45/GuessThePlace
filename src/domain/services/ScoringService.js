/**
 * Calculates the score based on the distance from the correct location.
 * @param {number} distanceKm - The distance in kilometers from the correct location.
 * @returns {number} The calculated score.
 */

export function calculateScore(distanceKm) {
  const maxDistance = 10000; // km beyond which score is 0
  const maxScore = 500;

  if (distanceKm >= maxDistance) return 0;

  return Math.round(maxScore * (1 - distanceKm / maxDistance));
}






