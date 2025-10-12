// src/domain/services/ScoringService.js

export function calculateScore(distanceKm) {
  const maxDistance = 10000; // km oltre i quali punteggio 0
  const maxScore = 500;

  if (distanceKm >= maxDistance) return 0;

  return Math.round(maxScore * (1 - distanceKm / maxDistance));
}






