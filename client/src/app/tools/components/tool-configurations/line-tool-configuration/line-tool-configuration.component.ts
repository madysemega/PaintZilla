import { Component } from '@angular/core';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { LineShape } from '@app/shapes/line-shape';
import { LineType } from '@app/shapes/types/line-type';
import { LineService } from '@app/tools/services/tools/line.service';

@Component({
    selector: 'app-line-tool-configuration',
    templateUrl: './line-tool-configuration.component.html',
    styleUrls: ['./line-tool-configuration.component.scss'],
})
export class LineToolConfigurationComponent {
    lineType: string;
    jointsDiameter: number;

    onLineTypeChange(lineType: MatButtonToggleGroup): void {
        this.lineType = lineType.value;
        this.lineTool.setLineType(this.lineType as LineType);
    }

    onJointsDiameterChange(jointsDiameter: number): void {
        this.jointsDiameter = jointsDiameter;
        this.lineTool.setJointsDiameter(jointsDiameter);
    }

    constructor(public lineTool: LineService) {
        this.lineType = LineType.WITHOUT_JOINTS as string;
        this.jointsDiameter = LineShape.DEFAULT_JOINTS_DIAMETER;
    }
}
