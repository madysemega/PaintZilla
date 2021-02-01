import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { ColourToolService } from '../../../services/tools/colour-tool.service';

@Component({
  selector: 'app-colour-slider',
  templateUrl: './colour-slider.component.html',
  styleUrls: ['./colour-slider.component.scss']
})
export class ColourSliderComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>;
  // private ctx: CanvasRenderingContext2D;
  
  @Output()
  colour: EventEmitter<string> = new EventEmitter()

  onMouseDown(evt: MouseEvent) {

    this.service.onMouseDown(evt);
  }

  onMouseMove(evt: MouseEvent) {
    
    this.service.onMouseMove(evt);
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(evt: MouseEvent) {
    this.service.mousedown = false;
}

  constructor(public service: ColourToolService) { }
  
  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.canvas = this.service.canvas;
    this.service.canvas = this.canvas;
    this.service.width = this.canvas.nativeElement.width;
    this.service.height = this.canvas.nativeElement.height;
    
    this.service.colour = this.colour;
    this.service.draw();
  }

}
