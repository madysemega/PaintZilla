import { Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { PencilService } from '@app/services/tools/pencil-service';

@Component({
  selector: 'app-pencil-tool-configuration',
  templateUrl: './pencil-tool-configuration.component.html',
  styleUrls: ['./pencil-tool-configuration.component.scss']
})
export class PencilToolConfigurationComponent implements OnInit {
  lineWidth: number;
  
  constructor(private pencilTool: PencilService) { }

  ngOnInit(): void {
    this.lineWidth = this.pencilTool.lineWidth;
  }

  onSliderChange(event: MatSliderChange): void {
    this.pencilTool.lineWidth = event.value as number;
  }
}
