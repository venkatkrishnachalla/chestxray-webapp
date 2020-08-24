import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cxr-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.scss'],
})
// DragDropComponent class implementation  
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

  /*  
* constructor for DragDropComponent class  
*/ 
  constructor() {}

    /**  
 * This is a init function, retrieve current user details.  
 * @param {void} empty - A empty param  
 * @example  
 * ngOnInit();
 */  
  ngOnInit(): void {}

 /**  
 * This is a  handleDragEnter function, when handle drag .  
 * @param {void} empty - A empty param  
 * @example  
 * handleDragEnter();
 */  
  handleDragEnter() {
    this.dragging = true;
  }

/**  
 * This is a handleDragLeave function, when handle leave.  
 * @param {void} empty - A empty param  
 * @example  
 * handleDragLeave();
 */ 
  handleDragLeave() {
    this.dragging = false;
  }

  /**  
 * This is a handleDrop function, when handle drop.  
 * @param {string} value - A string param  
 * @example  
 * handleDrop(e);
 */ 
  handleDrop(e) {
    e.preventDefault();
    this.dragging = false;
    this.handleInputChange(e);
  }

  /**  
 * This is a handleImageLoad function.  
 * @param {void} empty - A empty param  
 * @example  
 * handleImageLoad();
 */ 
  handleImageLoad() {
    this.imageLoaded = true;
  }

  /**  
 * This is a handleInputChange function, to detect input change.  
 * @param {string} value - A string param  
 * @example  
 * handleInputChange(e);
 */ 
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
  
  /**  
 * This is a _handleReaderLoaded function, to detect reader change.  
 * @param {string} value - A string param  
 * @example  
 * _handleReaderLoaded(e);
 */ 
  _handleReaderLoaded(e) {
    const reader = e.target;
    this.imageSrc = reader.result;
    this.dragImageSrc.emit(this.imageSrc);
    this.dragImageFile.emit(this.file);
    this.loaded = true;
  }

  /*** getLocalImageSrc function, to store image source ***/
    /**  
 * This is a getLocalImageSrc function, to store image source.  
 * @param {string} value - A string param  
 * @example  
 * getLocalImageSrc(event);
 */ 
  getLocalImageSrc(event: string) {
    this.imageSrc = event;
  }
}
