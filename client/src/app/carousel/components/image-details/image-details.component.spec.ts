import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { Vec2 } from '@app/app/classes/vec2';
import { HistoryService } from '@app/history/service/history.service';
import { MaterialModule } from '@app/material.module';
import { ImageDetailsComponent } from './image-details.component';

describe('ImageDetailsComponent', () => {
    let component: ImageDetailsComponent;
    let fixture: ComponentFixture<ImageDetailsComponent>;

    let routerSpy: jasmine.SpyObj<Router>;
    let historyService: HistoryService;

    beforeEach(async(() => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
        // tslint:disable-next-line: no-empty
        routerSpy.navigateByUrl.and.returnValue(new Promise(() => {}));

        historyService = new HistoryService();

        TestBed.configureTestingModule({
            imports: [MaterialModule, BrowserAnimationsModule, CommonModule, MatTooltipModule],
            declarations: [ImageDetailsComponent],
            providers: [
                { provide: Router, useValue: routerSpy },
                { provide: HistoryService, useValue: historyService },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ImageDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        component.dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('loadImage() should navigate to /editor/:imageId', () => {
        const promise = Promise.resolve(true);
        routerSpy.navigateByUrl.and.returnValue(promise);

        const IMAGE_ID = '1234567890';

        component.data.id = IMAGE_ID;
        component.loadImage();

        expect(routerSpy.navigateByUrl).toHaveBeenCalled();
        promise.then(() => {
            expect(routerSpy.navigate).toHaveBeenCalled();
        });
    });

    it('deleteImage() should emit a delete event', () => {
        let deleteEventEmitted = false;
        component.delete.subscribe((id: number) => {
            deleteEventEmitted = true;
        });
        component.deleteImage(jasmine.createSpyObj('MouseEvent', ['preventDefault', 'stopPropagation']));
        expect(deleteEventEmitted).toBeTrue();
    });

    it('imageWidth should be maximum in is greater than imageHeight', () => {
        const WIDTH = 400;
        const HEIGHT = 300;

        spyOn(component, 'getRealImageDimensions').and.returnValue({ x: WIDTH, y: HEIGHT } as Vec2);

        expect(component.imageWidth).toEqual(component.imageContainerWidth);
    });

    it('imageWidth should keep aspect ratio even if it is less than imageHeight', () => {
        const WIDTH = 300;
        const HEIGHT = 400;

        spyOn(component, 'getRealImageDimensions').and.returnValue({ x: WIDTH, y: HEIGHT } as Vec2);

        expect(component.imageWidth).toEqual((component.imageContainerHeight / HEIGHT) * WIDTH);
    });

    it('imageHeight should be maximum in is greater than imageWidth', () => {
        const WIDTH = 300;
        const HEIGHT = 400;

        spyOn(component, 'getRealImageDimensions').and.returnValue({ x: WIDTH, y: HEIGHT } as Vec2);

        expect(component.imageHeight).toEqual(component.imageContainerHeight);
    });

    it('imageHeight should keep aspect ratio even if it is less than imageWidth', () => {
        const WIDTH = 400;
        const HEIGHT = 300;

        spyOn(component, 'getRealImageDimensions').and.returnValue({ x: WIDTH, y: HEIGHT } as Vec2);

        expect(component.imageHeight).toEqual((component.imageContainerWidth / WIDTH) * HEIGHT);
    });

    it('Discard confirm callback should navigate to image', () => {
        const navigateToImageSpy = spyOn(component, 'navigateToImage').and.stub();

        // tslint:disable-next-line: no-string-literal
        component['discardChangesModalData'].confirmCallback();

        expect(navigateToImageSpy).toHaveBeenCalled();
    });

    it('loadImage() should display discard changes modal if changes have been done to current drawing', () => {
        const dialogOpenSpy = spyOn(fixture.debugElement.injector.get(MatDialog), 'open').and.stub();

        // tslint:disable-next-line: no-empty
        historyService.do({ apply: () => {} });
        component.loadImage();

        expect(dialogOpenSpy).toHaveBeenCalled();
    });
});
