import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageNavigationComponent } from '@app/carousel/components/image-navigation/image-navigation.component';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { IconsMetaData } from '@app/meta-data/icons-meta-data';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor(
        private iconRegistryService: MatIconRegistry,
        private domSanitizer: DomSanitizer,
        private keyboardService: KeyboardService,
        private dialog: MatDialog,
    ) {
        for (const icon of IconsMetaData.iconFiles) {
            this.iconRegistryService.addSvgIcon(icon.name, this.domSanitizer.bypassSecurityTrustResourceUrl(icon.path));
        }

        this.registerKeyboardShortcuts();
    }

    private registerKeyboardShortcuts(): void {
        this.keyboardService.registerAction({
            trigger: 'ctrl+g',
            invoke: () => {
                if (this.dialog.openDialogs.length === 0) {
                    this.dialog.open(ImageNavigationComponent, { panelClass: 'custom-modalbox' });
                }
            },
            uniqueName: 'Open carousel',
            contexts: ['editor', 'main-page'],
        });
    }
}
