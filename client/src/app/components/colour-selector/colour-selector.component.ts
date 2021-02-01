import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-colour-selector',
  templateUrl: './colour-selector.component.html',
  styleUrls: ['./colour-selector.component.scss']
})
export class ColourSelectorComponent implements OnInit {

  public hue: string;
  public colour: string;
  
  constructor() { }

  ngOnInit(): void {
  }

}
