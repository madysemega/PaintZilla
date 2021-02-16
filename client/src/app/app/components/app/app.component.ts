import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { IconsMetaData } from '@app/meta-data/icons-meta-data';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor(private iconRegistryService: MatIconRegistry, private domSanitizer: DomSanitizer) {
        for (const icon of IconsMetaData.iconFiles) {
            this.iconRegistryService.addSvgIcon(icon.name, this.domSanitizer.bypassSecurityTrustResourceUrl(icon.path));
        }
    }
}
