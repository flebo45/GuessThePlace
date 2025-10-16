import { Photo } from '../../domain/entities/Photo.js';


const MAPILLARY_BASE_URL = 'https://graph.mapillary.com';
const MAPILLARY_TOKEN = 'MLY|24471568689210680|a71d8529e468cdfe6474f2cc950bad3b';


// Definisci copie di bounding box per zone globali con copertura urbana
const GLOBAL_BBOXES = [
  // Nord America: Concentrati sulle aree urbane e sulle coste più popolate
  { name: 'North America (Est)', bbox: [-90, 25, -65, 50] }, // Costa Est USA/Canada
  { name: 'North America (Ovest)', bbox: [-125, 30, -100, 50] }, // Costa Ovest USA/Canada
  
  // Europa: Riduci il range per evitare sovra-rappresentazione
  { name: 'Europe Centrale', bbox: [0, 45, 20, 55] },
  { name: 'Europe Occidentale', bbox: [-10, 40, 5, 55] }, 
  
  // Asia: Aggiungi aree molto popolate e coperte
  { name: 'Asia Orientale (Giappone/Corea)', bbox: [120, 30, 145, 45] },
  { name: 'Asia Meridionale (India)', bbox: [70, 15, 90, 30] },
  
  // Sud America: Concentrati sulle coste e capitali
  { name: 'South America (Brasile/Argentina)', bbox: [-60, -40, -40, -15] },
  
  // Oceania: Concentrati sulle coste popolate
  { name: 'Oceania (Australia/Nuova Zelanda)', bbox: [140, -40, 180, -20] }
];


/**
 * Genera N bounding box molto piccoli casuali scelti da zone di copertura globali.
 * Ogni bbox è [min_lon, min_lat, max_lon, max_lat].
 */
function generateRandomBboxes(n) {
 const bboxes = [];
 const delta = 0.01; // circa 1–2km di lato
 const WEIGHTED_REGIONS = [
  GLOBAL_BBOXES[0], GLOBAL_BBOXES[1], // North America (x2)
  GLOBAL_BBOXES[2], // Europe (x1 - peso ridotto)
  GLOBAL_BBOXES[3], GLOBAL_BBOXES[3], // Asia (x2)
  GLOBAL_BBOXES[4], GLOBAL_BBOXES[4], // South America (x2)
  GLOBAL_BBOXES[5] // Oceania (x1)
];
 for (let i = 0; i < n; i++) {
 const region = WEIGHTED_REGIONS[Math.floor(Math.random() * WEIGHTED_REGIONS.length)];
 const [minLon, minLat, maxLon, maxLat] = region.bbox;
 const lon = minLon + Math.random() * (maxLon - minLon);
 const lat = minLat + Math.random() * (maxLat - minLat);
 bboxes.push([
 lon - delta,
 lat - delta,
 lon + delta,
 lat + delta
 ]);
 }
 return bboxes;
}


/**
 * Effettua la chiamata Mapillary all'API per un bbox.
 * Ritorna array di immagini {url, coordinates}.
 */
async function fetchMapillaryImages(bbox, limit = 10) {
 const bboxStr = bbox.join(',');
 const fields = 'id,thumb_1024_url,computed_geometry';
 const url = `${MAPILLARY_BASE_URL}/images?access_token=${MAPILLARY_TOKEN}&fields=${fields}&bbox=${bboxStr}&limit=${limit}`;
 console.log(url)


 try {
 const res = await fetch(url);
 if (!res.ok) return [];
 const data = await res.json();
 return data.data ? data.data.map(img => ({
 url: img.thumb_1024_url,
 coordinates: img.computed_geometry.coordinates
})) : [];
 } catch {
 return [];
 }
}


/**
 * Cerca più immagini in parallelo per gruppi di bounding box casuali
 * riducendo il numero totale di chiamate e migliorando le prestazioni.
 */
export async function fetchUniqueImages(N = 5, batchSize = 100, limitPerBBox = 20) {
  const uniqueImages = new Map(); // mappa url -> imgData

  // Primo batch di bounding box globali
  const bboxes = generateRandomBboxes(batchSize);

  // Esegui le richieste in parallelo
  const allResults = await Promise.all(
    bboxes.map(bbox => fetchMapillaryImages(bbox, limitPerBBox))
  );

  // Flatten dei risultati in un singolo array
  const images = allResults.flat().filter(Boolean);

  // Aggiungi immagini uniche alla mappa
  for (const img of images) {
    if (img && !uniqueImages.has(img.url)) {
      uniqueImages.set(img.url, img);
      if (uniqueImages.size >= N) break; // già raggiunto il numero richiesto
    }
  }

  // Se non hai ancora N immagini, riprova una volta con un nuovo batch
  if (uniqueImages.size < N) {
    console.warn(`Trovate solo ${uniqueImages.size} immagini, ritento con nuovo batch...`);
    const retryBboxes = generateRandomBboxes(batchSize);
    const retryResults = await Promise.all(
      retryBboxes.map(bbox => fetchMapillaryImages(bbox, limitPerBBox))
    );
    const retryImages = retryResults.flat().filter(Boolean);

    for (const img of retryImages) {
      if (img && !uniqueImages.has(img.url)) {
        uniqueImages.set(img.url, img);
        if (uniqueImages.size >= N) break;
      }
    }
  }

  return Array.from(uniqueImages.values()).slice(0, N);
}



/**
 * Converte i dati grezzi Mapillary in entity Photo
 */
export async function fetchPhotoEntities(count = 5) {
 const images = await fetchUniqueImages(count);
 return images.map(img => {
 const [lon, lat] = img.coordinates; // attenzione: [lon, lat]
 return new Photo(img.url, lat, lon);
 });
}