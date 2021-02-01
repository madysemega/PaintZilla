
import {
  AfterViewInit, Component, ElementRef, EventEmitter,
  HostListener, Input,
  OnChanges, OnInit, Output, SimpleChanges, ViewChild
} from '@angular/core';
import { PaletteToolService } from '../../../services/tools/palette-tool.service';

@Component({
  selector: 'app-colour-palette',
  templateUrl: './colour-palette.component.html',
  styleUrls: ['./colour-palette.component.scss']
})
export class ColourPaletteComponent implements OnInit, AfterViewInit, OnChanges {

  @Input()
  hue: string;

  @Output()
  colour: EventEmitter<string> = new EventEmitter(true);

  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>

  constructor(public service: PaletteToolService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.service.canvas = this.canvas;
    this.service.colour = this.colour;
    this.service.hue = this.hue;
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['hue']) {

      this.service.draw();
      const pos = this.service.selectedPosition;
      if (pos) {

        this.service.colour.emit(this.service.getColourAtPosition(pos.x, pos.y));
      }
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(evt: MouseEvent) {
    this.service.onMouseUp(evt);
  }

  onMouseDown(evt: MouseEvent) {
    this.service.mousedown = true
    this.service.selectedPosition = { x: evt.offsetX, y: evt.offsetY }
    this.service.draw()
    this.service.colour.emit(this.service.getColourAtPosition(evt.offsetX, evt.offsetY))
  }

  onMouseMove(evt: MouseEvent) {
    if (this.service.mousedown) {
      this.service.selectedPosition = { x: evt.offsetX, y: evt.offsetY }
      this.service.draw()
      this.service.emitColour(evt.offsetX, evt.offsetY)
    }
  }


}
