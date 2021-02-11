import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ColourToolService } from '../../services/tools/colour-tool.service';

@Component({
  selector: 'app-colour-selector',
  templateUrl: './colour-selector.component.html',
  styleUrls: ['./colour-selector.component.scss']
})
export class ColourSelectorComponent implements OnInit {

  
  public show: boolean = false;
  @ViewChild('colorHex') colorHex: ElementRef;
  public hue: string;
  public colour: string;
  public colourInput: string;
  public opacity: number = 1;
  public position: string = 'right';
  
  constructor(public service: ColourToolService) { }
  changeOpacity(event: any) {
    
    let indexThirdComma = this.colour.split(',', 3).join(',').length;
    let opacityString = this.colour.substring(indexThirdComma+1, this.colour.length - 1);
    console.log(opacityString);
    this.opacity = parseInt(opacityString)
    this.opacity = event.value;
    this.colour = this.colour.substring(0, indexThirdComma+1) + this.opacity.toString() + ')';
  }
  addColEv(event: any) {
    
    this.service.colour1 = event.target.style.backgroundColor;
  }
  addSecEv(event: any) {
    this.service.colour2 = event.target.style.backgroundColor;
  }
  addFirstCol(isSelected: boolean) {
    this.service.colour1 = this.colour;
    if (isSelected) {
      this.rememberCol(this.colour);
    }
  }
  addSecCol(isSelected: boolean) {
    this.service.colour2 = this.colour;
    if (isSelected) {
      this.rememberCol(this.colour);
    }
  }
  ngOnInit(): void {
    // RGB(FF, FF, FF, 1)
    
    
  }

  takeHexClr(event: any) {
    console.log('called before');
    let isValid: Boolean = true;
    let inputString: String = event.target.value;
    if (inputString.length == 7 && 
      inputString[0] == '#') {

        for (let i = 1; i < 9; i++) {
          
          if (inputString[i] >= '9' && inputString[i] <= '0') {
            isValid = false;
          }
        }
        
        if (isValid) {
          let RValue: Number = parseInt(inputString.substr(1, 2), 16);
          let GValue: Number = parseInt(inputString.substr(3, 2), 16);
          let BValue: Number = parseInt(inputString.substr(5, 2), 16);
          this.colour = 'rgba('+ RValue.toString(10) + ',' +
          BValue.toString(10) + ',' + GValue.toString(10) +',1)';
          this.rememberCol(this.colour);
        }
        
    }
  }

  switchCol(): void {

    let temp = this.service.colour1;
    this.service.colour1 = this.service.colour2;
    this.service.colour2 = temp;
  }

  rememberCol(newCol: string): void {
    
    if (this.service.colourList.length < 10) {
      this.service.colourList.push(newCol);
    }
    else if (this.service.colourList.length == 10) {
      this.service.colourList.shift();
      this.service.colourList.push(newCol);
    }
    console.log(this.service.colourList);
  }

  showList(): void {

    if (!this.show) {
      this.show = true;
    }
    else {
      this.show = false;
    }
    
  }
}
