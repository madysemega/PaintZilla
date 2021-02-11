import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app/components/app/app.component';
import { MainPageComponent } from '@app/app/components/main-page/main-page.component';
import { DiscardChangesDialogComponent } from '@app/components/dialog/discard-changes-dialog/discard-changes-dialog.component';
import { DrawingComponent } from '@app/drawing/components/drawing/drawing.component';
import { SidebarComponent } from '@app/drawing/components/sidebar/sidebar.component';
import { EditorComponent } from '@app/editor/components/editor/editor.component';
import { EllipseToolConfigurationComponent } from '@app/tools/components/tool-configurations/ellipse-tool-configuration/ellipse-tool-configuration.component';
import { PencilToolConfigurationComponent } from '@app/tools/components/tool-configurations/pencil-tool-configuration/pencil-tool-configuration.component';
import { RectangleToolConfigurationComponent } from '@app/tools/components/tool-configurations/rectangle-tool-configuration/rectangle-tool-configuration.component';
import { ResizableToolConfigurationComponent } from '@app/tools/components/tool-configurations/resizable-tool-configuration/resizable-tool-configuration.component';
import { ShapeToolConfigurationComponent } from '@app/tools/components/tool-configurations/shape-tool-configuration/shape-tool-configuration.component';
@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        SidebarComponent,
        DrawingComponent,
        MainPageComponent,
        EllipseToolConfigurationComponent,
        PencilToolConfigurationComponent,
        RectangleToolConfigurationComponent,
        DiscardChangesDialogComponent,
        ShapeToolConfigurationComponent,
        ResizableToolConfigurationComponent,
        PencilToolConfigurationComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatDividerModule,
        MatMenuModule,
        MatSelectModule,
        MatButtonToggleModule,
        MatDialogModule,
        MatSliderModule,
    ],
    providers: [MatDialog],
    bootstrap: [AppComponent],
    entryComponents: [DiscardChangesDialogComponent],
})
export class AppModule {}
