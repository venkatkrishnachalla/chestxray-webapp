import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XRayComponent } from './x-ray.component';
import { MaterialModule } from 'src/app/material.module';
import { Ng5SliderModule } from 'ng5-slider';
import { ActionPanelComponent } from './component/action-panel/action-panel.component';
import { FindingsComponent } from './component/findings/findings.component';
import { ImageSlidingComponent } from './component/image-sliding/image-sliding.component';
import { ImpressionComponent } from './component/impression/impression.component';
import { PatientDetailsComponent } from './component/patient-details/patient-details.component';
import { CanvasImageComponent } from './component/canvas-image/canvas-image.component';
import { FormsModule } from '@angular/forms';
import { SearchFilterPipe } from 'src/app/filters/search-filter.pipe';
import { AskAiComponent } from './component/ask-ai/ask-ai.component';
import { ToastrModule } from 'ngx-toastr';
import { CoreModule } from 'src/app/core/core.module';
import { AskAiToolComponent } from './component/action-panel/component/ask-ai-tool/ask-ai-tool.component';
import { PathologyToolComponent } from './component/action-panel/component/pathology-tool/pathology-tool.component';
import { TimelineToolComponent } from './component/action-panel/component/timeline-tool/timeline-tool.component';
import { DrawEllipseFreehandDrawingComponent } from './component/action-panel/component/draw-ellipse-freehand-drawing/draw-ellipse-freehand-drawing.component';
import { UndoRedoToolComponent } from './component/action-panel/component/undo-redo-tool/undo-redo-tool.component';
import { MeasureLengthAngleToolComponent } from './component/action-panel/component/measure-length-angle-tool/measure-length-angle-tool.component';
import { SaveEraseToolComponent } from './component/action-panel/component/save-erase-tool/save-erase-tool.component';
import { ArrowTextToolComponent } from './component/action-panel/component/arrow-text-tool/arrow-text-tool.component';
import { SettingsDeleteToolComponent } from './component/action-panel/component/settings-delete-tool/settings-delete-tool.component';
import { BrightnessContrastToolComponent } from './component/action-panel/component/brightness-contrast-tool/brightness-contrast-tool.component';
import { SelectFitscreenToolComponent } from './component/action-panel/component/select-fitscreen-tool/select-fitscreen-tool.component';
import { ZoominZoomoutToolComponent } from './component/action-panel/component/zoomin-zoomout-tool/zoomin-zoomout-tool.component';
import { RotateToolComponent } from './component/action-panel/component/rotate-tool/rotate-tool.component';
import { FlipToolComponent } from './component/action-panel/component/flip-tool/flip-tool.component';

@NgModule({
  declarations: [
    XRayComponent,
    ActionPanelComponent,
    FindingsComponent,
    ImageSlidingComponent,
    ImpressionComponent,
    PatientDetailsComponent,
    CanvasImageComponent,
    SearchFilterPipe,
    AskAiComponent,
    AskAiToolComponent,
    PathologyToolComponent,
    TimelineToolComponent,
    DrawEllipseFreehandDrawingComponent,
    UndoRedoToolComponent,
    MeasureLengthAngleToolComponent,
    SaveEraseToolComponent,
    ArrowTextToolComponent,
    SettingsDeleteToolComponent,
    BrightnessContrastToolComponent,
    SelectFitscreenToolComponent,
    ZoominZoomoutToolComponent,
    RotateToolComponent,
    FlipToolComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    Ng5SliderModule,
    FormsModule,
    ToastrModule,
    CoreModule,
  ],
  exports: [SearchFilterPipe],
})
export class XRayModule {}
