import { AfterContentInit, Component } from '@angular/core';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { LineType } from '@app/shapes/types/line-type';
import { LineService } from '@app/tools/services/tools/line.service';

@Component({
    selector: 'app-line-tool-configuration',
    templateUrl: './line-tool-configuration.component.html',
    styleUrls: ['./line-tool-configuration.component.scss'],
})
export class LineToolConfigurationComponent implements AfterContentInit {
    lineType: string;
    jointsDiameter: number;

    constructor(public lineTool: LineService) {}

    onLineTypeChange(lineType: MatButtonToggleGroup): void {
        this.lineType = lineType.value;
        this.lineTool.lineType = this.lineType as LineType;
    }

    onJointsDiameterChange(jointsDiameter: number): void {
        this.jointsDiameter = jointsDiameter;
        this.lineTool.jointsDiameter = jointsDiameter;
    }

    ngAfterContentInit(): void {
        this.lineType = this.lineTool.lineType;
        this.jointsDiameter = this.lineTool.jointsDiameter;
    }
}
