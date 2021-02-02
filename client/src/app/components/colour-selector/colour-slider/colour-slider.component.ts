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
  private ctx: CanvasRenderingContext2D;
  public height: number;
  public width: number;
  
  @Output()
  colour: EventEmitter<string> = new EventEmitter()

  onMouseDown(evt: MouseEvent) {

    this.service.onMouseDown(evt, this.height, this.width, this.ctx);
  }

  onMouseMove(evt: MouseEvent) {
    
    this.service.onMouseMove(evt, this.height, this.width, this.ctx);
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(evt: MouseEvent) {
    this.service.mousedown = false;
}

  constructor(public service: ColourToolService) { }
  
  ngOnInit(): void {
  }

  ngAfterViewInit() {
    
    this.service.colour = this.colour;
    this.draw();
  }

  draw() {
    if (!this.ctx) {
      this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }
    this.width = this.canvas.nativeElement.width;
    this.height = this.canvas.nativeElement.height;
    this.service.draw(this.height, this.width, this.ctx);
  }

}
