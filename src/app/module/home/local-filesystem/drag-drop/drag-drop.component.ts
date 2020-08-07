import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cxr-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.scss'],
})
export class DragDropComponent implements OnInit {
  @Output() dragImageSrc = new EventEmitter();
  @Output() dragImageFile = new EventEmitter();
  activeColor = 'green';
  baseColor = '#ccc';
  overlayColor = 'rgba(255,255,255,0.5)';
  dragging = false;
  loaded = false;
  imageLoaded = false;
  imageSrc: string;
  file: string;

  constructor() {}

  /*** class init function ***/
  ngOnInit(): void {}

  /*** handleDragEnter function, when handle drag ***/
  handleDragEnter() {
    this.dragging = true;
  }

  /*** handleDragLeave function, when handle leave ***/
  handleDragLeave() {
    this.dragging = false;
  }

  /*** handleDrop function, when handle drop ***/
  handleDrop(e) {
    e.preventDefault();
    this.dragging = false;
    this.handleInputChange(e);
  }

  /*** handleImageLoad function ***/
  handleImageLoad() {
    this.imageLoaded = true;
  }

  /*** handleInputChange function, to detect input change ***/
  handleInputChange(e) {
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

    const pattern = /image-*/;
    const reader = new FileReader();

    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }

    this.loaded = false;
    this.file = file;
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  /*** _handleReaderLoaded function, to detect reader change ***/
  _handleReaderLoaded(e) {
    const reader = e.target;
    this.imageSrc = reader.result;
    this.dragImageSrc.emit(this.imageSrc);
    this.dragImageFile.emit(this.file);
    this.loaded = true;
  }

  /*** getLocalImageSrc function, to store image source ***/
  getLocalImageSrc(event: string) {
    this.imageSrc = event;
  }
}
