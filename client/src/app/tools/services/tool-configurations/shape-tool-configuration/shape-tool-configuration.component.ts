import { AfterContentInit, Component, Input } from '@angular/core';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { ShapeTool } from '@app/app/classes/shape-tool';
import { ShapeType } from '@app/app/classes/shape-type';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';

@Component({
    selector: 'app-shape-tool-configuration',
    templateUrl: './shape-tool-configuration.component.html',
    styleUrls: ['./shape-tool-configuration.component.scss'],
})
export class ShapeToolConfigurationComponent implements AfterContentInit {
    toolName: string;
    shapeType: string;
    @Input() toolService: ShapeTool;
    iconNames: string[] = [];

    constructor(public toolSelectorService: ToolSelectorService) {}

    onShapeTypeChange(shapeType: MatButtonToggleGroup): void {
        switch (shapeType.value) {
            case 'contoured':
                this.toolService.shapeType = ShapeType.Contoured;
                break;
            case 'filled':
                this.toolService.shapeType = ShapeType.Filled;
                break;
            case 'contoured-and-filled':
                this.toolService.shapeType = ShapeType.ContouredAndFilled;
                break;
        }
    }

    ngAfterContentInit(): void {
        const currentShapeType = this.toolService.shapeType;

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

        this.iconNames.push(this.toolService.name.concat('-contoured'));
        this.iconNames.push(this.toolService.name.concat('-filled'));
        this.iconNames.push(this.toolService.name.concat('-contoured-and-filled'));
    }
}
