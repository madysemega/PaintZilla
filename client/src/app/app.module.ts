import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app/components/app/app.component';
import { MainPageComponent } from '@app/app/components/main-page/main-page.component';
import { ImageCarouselComponent } from '@app/carousel/components/image-carousel/image-carousel.component';
import { ImageDetailsComponent } from '@app/carousel/components/image-details/image-details.component';
import { ImageNavigationComponent } from '@app/carousel/components/image-navigation/image-navigation.component';
import { ColourPaletteComponent } from '@app/colour-picker/components/colour-palette/colour-palette.component';
import { ColourPickerComponent } from '@app/colour-picker/components/colour-picker/colour-picker.component';
import { ColourSliderComponent } from '@app/colour-picker/components/colour-slider/colour-slider.component';
import { OpacitySliderComponent } from '@app/colour-picker/components/opacity-slider/opacity-slider.component';
import { RgbFormComponent } from '@app/colour-picker/components/rgb-form/rgb-form.component';
import { ColoursComponent } from '@app/drawing/components/colours/colours.component';
import { DrawingComponent } from '@app/drawing/components/drawing/drawing.component';
import { SidebarComponent } from '@app/drawing/components/sidebar/sidebar.component';
import { EditorComponent } from '@app/editor/components/editor/editor.component';
import { DiscardChangesDialogComponent } from '@app/file-options/dialog/discard-changes-dialog/discard-changes-dialog.component';
import { ExportDrawingDialogComponent } from '@app/file-options/dialog/export-drawing-dialog/export-drawing-dialog.component';
import { SaveDrawingDialogComponent } from '@app/file-options/dialog/save-drawing-dialog/save-drawing-dialog.component';
import { HistoryControlsComponent } from '@app/history/component/history-controls/history-controls.component';
import { MaterialModule } from '@app/material.module';
import { EllipseSelectionComponent } from '@app/tools/components/selection/ellipse-selection/ellipse-selection.component';
import { RectangleSelectionComponent } from '@app/tools/components/selection/rectangle-selection/rectangle-selection.component';
import { SelectionComponent } from '@app/tools/components/selection/selection/selection.component';
import { EllipseToolConfigurationComponent } from '@app/tools/components/tool-configurations/ellipse-tool-configuration/ellipse-tool-configuration.component';
import { EraserToolConfigurationComponent } from '@app/tools/components/tool-configurations/eraser-tool-configuration/eraser-tool-configuration.component';
import { LineToolConfigurationComponent } from '@app/tools/components/tool-configurations/line-tool-configuration/line-tool-configuration.component';
import { PencilToolConfigurationComponent } from '@app/tools/components/tool-configurations/pencil-tool-configuration/pencil-tool-configuration.component';
import { PipetteToolConfigurationComponent } from '@app/tools/components/tool-configurations/pipette-tool-configuration/pipette-tool-configuration.component';
import { PolygonComponent } from '@app/tools/components/tool-configurations/polygon/polygon.component';
import { RectangleToolConfigurationComponent } from '@app/tools/components/tool-configurations/rectangle-tool-configuration/rectangle-tool-configuration.component';
import { ResizableToolConfigurationComponent } from '@app/tools/components/tool-configurations/resizable-tool-configuration/resizable-tool-configuration.component';
import { ShapeToolConfigurationComponent } from '@app/tools/components/tool-configurations/shape-tool-configuration/shape-tool-configuration.component';
import { SprayToolConfigurationComponent } from '@app/tools/components/tool-configurations/spray-tool-configuration/spray-tool-configuration.component';
import { HotkeyModule } from 'angular2-hotkeys';
import { FilterLabelComponent } from './carousel/components/filter-label/filter-label.component';
import { ConfigurationPanelComponent } from './drawing/components/configuration-panel/configuration-panel.component';

@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        SidebarComponent,
        DrawingComponent,
        MainPageComponent,
        EllipseToolConfigurationComponent,
        PencilToolConfigurationComponent,
        PipetteToolConfigurationComponent,
        SprayToolConfigurationComponent,
        EraserToolConfigurationComponent,
        RectangleToolConfigurationComponent,
        DiscardChangesDialogComponent,
        ShapeToolConfigurationComponent,
        ResizableToolConfigurationComponent,
        PencilToolConfigurationComponent,
        PipetteToolConfigurationComponent,
        SprayToolConfigurationComponent,
        ColourPaletteComponent,
        LineToolConfigurationComponent,
        ExportDrawingDialogComponent,
        PolygonComponent,
        OpacitySliderComponent,
        ColourSliderComponent,
        ColourPickerComponent,
        RgbFormComponent,
        ColoursComponent,
        RectangleSelectionComponent,
        EllipseSelectionComponent,
        SelectionComponent,
        HistoryControlsComponent,
        ImageNavigationComponent,
        ImageCarouselComponent,
        ImageDetailsComponent,
        ConfigurationPanelComponent,
        FilterLabelComponent,
        SaveDrawingDialogComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        HotkeyModule.forRoot(),
    ],

    bootstrap: [AppComponent],
    entryComponents: [DiscardChangesDialogComponent],
})
export class AppModule {}
