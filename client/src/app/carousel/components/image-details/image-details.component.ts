import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Drawing } from '@common/models/drawing';

@Component({
    selector: 'app-image-details',
    templateUrl: './image-details.component.html',
    styleUrls: ['./image-details.component.scss'],
})
export class ImageDetailsComponent {
    @Input() data: Drawing = {
        id: '',
        name: '',
        drawing: '',
        labels: [],
    };

    constructor(private domSanitizer: DomSanitizer, private router: Router) {}

    get imageSrc(): SafeResourceUrl {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(this.data.drawing);
    }

    loadImage(): void {
        this.router.navigate([`/editor/${this.data.id}`]);
    }
}
