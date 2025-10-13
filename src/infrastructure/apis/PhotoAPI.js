// src/infrastructure/apis/PhotoAPI.js

const MAPILLARY_BASE_URL = 'https://graph.mapillary.com';
const MAPILLARY_TOKEN = 'MLY|24471568689210680|a71d8529e468cdfe6474f2cc950bad3b'; // inserisci qui il tuo token

/**
 * Cerca immagini Mapillary in una bounding box
 * @param {Array} bbox - [minLon, minLat, maxLon, maxLat]
 * @param {number} limit - massimo numero immagini da prendere
 * @returns {Promise<Array>} - array di URL delle immagini
 */
export async function fetchMapillaryImages(bbox, limit = 5) {
  const bboxStr = bbox.join(',');
  const fields = 'id,thumb_1024_url';
  const url = `${MAPILLARY_BASE_URL}/images?bounds=${bboxStr}&limit=${limit}&fields=${fields}&access_token=${MAPILLARY_TOKEN}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Errore caricamento immagini Mapillary: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data.map(img => img.thumb_1024_url);
}

