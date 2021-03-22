import { Component, EventEmitter, Input, Output } from '@angular/core';
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

    @Output() delete: EventEmitter<string>;

    constructor(private domSanitizer: DomSanitizer, private router: Router) {
        this.delete = new EventEmitter();
    }

    get imageSrc(): SafeResourceUrl {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(this.data.drawing);
    }

    loadImage(): void {
        this.router.navigate([`/editor/${this.data.id}`]);
    }

    deleteImage(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.delete.emit(this.data.id);
    }
}
