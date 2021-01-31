import { AfterContentInit, Component } from '@angular/core';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { ShapeType } from '@app/classes/shape-type';
import { EllipseService } from '@app/services/tools/ellipse-service.service';

@Component({
    selector: 'app-ellipse-tool-configuration',
    templateUrl: './ellipse-tool-configuration.component.html',
    styleUrls: ['./ellipse-tool-configuration.component.scss'],
})
export class EllipseToolConfigurationComponent implements AfterContentInit {
    shapeType: string;

    constructor(private ellipseTool: EllipseService) {}

    onShapeTypeChange(shapeType: MatButtonToggleGroup): void {
        switch (shapeType.value) {
            case 'contoured':
                this.ellipseTool.shapeType = ShapeType.Contoured;
                break;
            case 'filled':
                this.ellipseTool.shapeType = ShapeType.Filled;
                break;
            case 'contoured-and-filled':
                this.ellipseTool.shapeType = ShapeType.ContouredAndFilled;
                break;
        }
    }

    ngAfterContentInit(): void {
        const currentShapeType = this.ellipseTool.shapeType;

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
