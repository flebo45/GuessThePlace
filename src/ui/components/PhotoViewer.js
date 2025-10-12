// src/ui/components/PhotoViewer.js

export class PhotoViewer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  setPhoto(url) {
    this.container.innerHTML = '';
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Photo';
    img.style.maxWidth = '100%';
    this.container.appendChild(img);
  }
}
