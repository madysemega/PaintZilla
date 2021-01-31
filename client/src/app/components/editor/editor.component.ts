import { Component, HostListener, ViewChild } from '@angular/core';
import { DrawingComponent } from '../drawing/drawing.component';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    @ViewChild(DrawingComponent)
    drawingComponent: DrawingComponent;
    
    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.drawingComponent.currentTool.onMouseDown(event);
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.drawingComponent.currentTool.onMouseUp(event);
    }
}
