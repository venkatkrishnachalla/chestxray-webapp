import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cxr-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.scss']
})
export class DragDropComponent implements OnInit {

  activeColor = 'green';
  baseColor = '#ccc';
  overlayColor = 'rgba(255,255,255,0.5)';
  
  dragging = false;
  loaded = false;
  imageLoaded = false;
  imageSrc = '';
  constructor() { }

  ngOnInit(): void {
  }
  
  handleDragEnter() {
      this.dragging = true;
  }
  
  handleDragLeave() {
      this.dragging = false;
  }
  
  handleDrop(e) {
      e.preventDefault();
      this.dragging = false;
      this.handleInputChange(e);
  }
  
  handleImageLoad() {
      this.imageLoaded = true;
  }

  handleInputChange(e) {
      const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

      const pattern = /image-*/;
      const reader = new FileReader();

      if (!file.type.match(pattern)) {
          alert('invalid format');
          return;
      }

      this.loaded = false;

      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
  }
  
  _handleReaderLoaded(e) {
      const reader = e.target;
      this.imageSrc = reader.result;
      this.loaded = true;
  }

}
