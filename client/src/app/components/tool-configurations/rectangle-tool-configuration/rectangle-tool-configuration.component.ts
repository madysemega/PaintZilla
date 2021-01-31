import { AfterContentInit, Component } from '@angular/core';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { ShapeType } from '@app/classes/shape-type';
import { RectangleService } from '@app/services/tools/rectangle.service';

@Component({
    selector: 'app-rectangle-tool-configuration',
    templateUrl: './rectangle-tool-configuration.component.html',
    styleUrls: ['./rectangle-tool-configuration.component.scss'],
})
export class RectangleToolConfigurationComponent implements AfterContentInit {
    shapeType: string;

    constructor(private rectangleTool: RectangleService) {}

    onShapeTypeChange(shapeType: MatButtonToggleGroup): void {
        switch (shapeType.value) {
            case 'contoured':
                this.rectangleTool.shapeType = ShapeType.Contoured;
                break;
            case 'filled':
                this.rectangleTool.shapeType = ShapeType.Filled;
                break;
            case 'contoured-and-filled':
                this.rectangleTool.shapeType = ShapeType.ContouredAndFilled;
                break;
        }
    }

    ngAfterContentInit(): void {
        const currentShapeType = this.rectangleTool.shapeType;

        switch (currentShapeType) {
            case ShapeType.Contoured:
                this.shapeType = 'contoured';
                break;
            case ShapeType.Filled:
                this.shapeType = 'filled';
                break;
            case ShapeType.ContouredAndFilled:
                this.shapeType = 'contoured-and-filled';
                break;
        }
    }
}
