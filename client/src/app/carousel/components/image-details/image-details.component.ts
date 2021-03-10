import { Component, Input, OnInit } from '@angular/core';
import { CarouselCardInformation } from '@app/carousel/data/carousel-card-information';

@Component({
    selector: 'app-image-details',
    templateUrl: './image-details.component.html',
    styleUrls: ['./image-details.component.scss'],
})
export class ImageDetailsComponent implements OnInit {
    @Input() data: CarouselCardInformation;

    constructor() {}

    ngOnInit(): void {}
}
