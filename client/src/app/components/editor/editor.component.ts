import { Component, HostListener, ViewChild } from '@angular/core';
import { DrawingComponent } from '@app/components/drawing/drawing.component';

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
        this.drawingComponent.getCurrentTool().onMouseDown(event);
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.drawingComponent.getCurrentTool().onMouseUp(event);
    }
}
