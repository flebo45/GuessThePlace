// src/ui/components/PhotoViewer.js

export class PhotoViewer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  setPhoto(url) {
    // Clear container first
    this.container.innerHTML = '';
    // Do not create an <img> element when url is falsy (''/null/undefined).
    // Creating an <img> with an empty src causes browsers to show a broken
    // image icon because they try to load the current document as image.
    if (!url) return;

    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Photo';
    img.style.maxWidth = '100%';
    this.container.appendChild(img);
  }
}
