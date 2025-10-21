import { Photo } from '../../domain/entities/Photo.js';

const MAPILLARY_BASE_URL = 'https://graph.mapillary.com';
const MAPILLARY_TOKEN = 'MLY|24471568689210680|a71d8529e468cdfe6474f2cc950bad3b';

//Bounding box globali
const GLOBAL_BBOXES = [
  { name: 'North America (Est)', bbox: [-90, 25, -65, 50] },
  { name: 'North America (Ovest)', bbox: [-125, 30, -100, 50] },
  { name: 'Europe Centrale', bbox: [0, 45, 20, 55] },
  { name: 'Europe Occidentale', bbox: [-10, 40, 5, 55] },
  { name: 'Asia Orientale (Giappone/Corea)', bbox: [120, 30, 145, 45] },
  { name: 'Asia Meridionale (India)', bbox: [70, 15, 90, 30] },
  { name: 'South America (Brasile/Argentina)', bbox: [-60, -40, -40, -15] },
  { name: 'Oceania (Australia/Nuova Zelanda)', bbox: [140, -40, 180, -20] }
];

//Genera N bounding box casuali da regioni globali
function generateRandomBboxes(n) {
  const bboxes = [];
  const delta = 0.01;
  for (let i = 0; i < n; i++) {
    const region = GLOBAL_BBOXES[Math.floor(Math.random() * GLOBAL_BBOXES.length)];
    const [minLon, minLat, maxLon, maxLat] = region.bbox;
    const lon = minLon + Math.random() * (maxLon - minLon);
    const lat = minLat + Math.random() * (maxLat - minLat);
    bboxes.push([lon - delta, lat - delta, lon + delta, lat + delta]);
  }
  return bboxes;
}

//Chiamata API Mapillary
async function fetchMapillaryImages(bbox, limit = 10) {
  const bboxStr = bbox.join(',');
  const fields = 'id,thumb_1024_url,geometry';
  const url = `${MAPILLARY_BASE_URL}/images?access_token=${MAPILLARY_TOKEN}&fields=${fields}&bbox=${bboxStr}&limit=${limit}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ? data.data.map(img => ({
      url: img.thumb_1024_url,
      coordinates: img.geometry.coordinates
    })) : [];
  } catch {
    return [];
  }
}

// 🔹 Funzione di supporto: calcola distanza approssimata tra due coordinate
function areCoordsClose(coord1, coord2, minDistanceDeg = 0.05) {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  const dLon = lon1 - lon2;
  const dLat = lat1 - lat2;
  const distance = Math.sqrt(dLon * dLon + dLat * dLat);
  return distance < minDistanceDeg; // se troppo vicine, ritorna true
}

//Cerca immagini globali, filtrando quelle troppo vicine
export async function fetchUniqueImages(N = 5, batchSize = 200, limitPerBBox = 20) {
  const uniqueImages = [];

  const bboxes = generateRandomBboxes(batchSize);
  const allResults = await Promise.all(bboxes.map(bbox => fetchMapillaryImages(bbox, limitPerBBox)));
  const images = allResults.flat().filter(Boolean);

  for (const img of images) {
    if (!img?.coordinates) continue;

    const isTooClose = uniqueImages.some(
      other => areCoordsClose(img.coordinates, other.coordinates)
    );

    if (!isTooClose) {
      uniqueImages.push(img);
      if (uniqueImages.length >= N) break;
    }
  }

  //Se non trovi abbastanza immagini, riprova una volta
  if (uniqueImages.length < N) {
    console.warn(`Solo ${uniqueImages.length} immagini trovate, nuovo tentativo...`);
    return fetchUniqueImages(N, batchSize * 2, limitPerBBox);
  }

  return uniqueImages.slice(0, N);
}

//Conversione finale in entity Photo
export async function fetchPhotoEntities(count = 5) {
  const images = await fetchUniqueImages(count);
  return images.map(img => {
    const [lon, lat] = img.coordinates;
    return new Photo(img.url, lat, lon);
  });
}
