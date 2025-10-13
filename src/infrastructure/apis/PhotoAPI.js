
const MAPILLARY_BASE_URL = 'https://graph.mapillary.com';
const MAPILLARY_TOKEN = 'MLY|24471568689210680|a71d8529e468cdfe6474f2cc950bad3b';

export async function fetchMapillaryImages(bbox, limit = 1) {
  const bboxStr = bbox.join(',');
  const fields = 'id,thumb_1024_url';
  const url = `${MAPILLARY_BASE_URL}/images?access_token=${MAPILLARY_TOKEN}&fields=${fields}&bbox=${bboxStr}&limit=${limit}`;
  console.log(url)
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Errore caricamento immagini Mapillary: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data.map(img => img.thumb_1024_url);
}

export async function displayImages(bbox, limit) {
  const container = document.getElementById('images');
  container.innerHTML = ''; // pulisce griglia

  try {
    const images = await fetchMapillaryImages(bbox, limit);

    if (images.length === 0) {
      container.innerHTML = '<p>Nessuna immagine trovata in questa area.</p>';
      return;
    }

    images.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      container.appendChild(img);
      return img;
    });
  } catch (err) {
    console.error('Errore:', err);
    container.innerHTML = `<p style="color:red">Errore: ${err.message}</p>`;
  }
}
