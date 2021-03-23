import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { Vec2 } from '@app/app/classes/vec2';
import { MaterialModule } from '@app/material.module';
import { ImageDetailsComponent } from './image-details.component';

describe('ImageDetailsComponent', () => {
    let component: ImageDetailsComponent;
    let fixture: ComponentFixture<ImageDetailsComponent>;

    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async(() => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        TestBed.configureTestingModule({
            imports: [MaterialModule, BrowserAnimationsModule],
            declarations: [ImageDetailsComponent],
            providers: [{ provide: Router, useValue: routerSpy }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ImageDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('loadImage() should navigate to /editor/:imageId', () => {
        const IMAGE_ID = '1234567890';

        component.data.id = IMAGE_ID;
        component.loadImage();

        expect(routerSpy.navigate).toHaveBeenCalledWith([`/editor/${IMAGE_ID}`]);
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

        spyOn(component, 'getRealImageDimensions').and.returnValue({x: WIDTH, y: HEIGHT} as Vec2);

        expect(component.imageWidth).toEqual(component.imageContainerWidth);
    });

    it('imageWidth should keep aspect ratio even if it is less than imageHeight', () => {
        const WIDTH = 300;
        const HEIGHT = 400;

        spyOn(component, 'getRealImageDimensions').and.returnValue({x: WIDTH, y: HEIGHT} as Vec2);

        expect(component.imageWidth).toEqual((component.imageContainerHeight / HEIGHT) * WIDTH);
    });

    it('imageHeight should be maximum in is greater than imageWidth', () => {
        const WIDTH = 300;
        const HEIGHT = 400;

        spyOn(component, 'getRealImageDimensions').and.returnValue({x: WIDTH, y: HEIGHT} as Vec2);

        expect(component.imageHeight).toEqual(component.imageContainerHeight);
    });

    it('imageHeight should keep aspect ratio even if it is less than imageWidth', () => {
        const WIDTH = 400;
        const HEIGHT = 300;

        spyOn(component, 'getRealImageDimensions').and.returnValue({x: WIDTH, y: HEIGHT} as Vec2);

        expect(component.imageHeight).toEqual((component.imageContainerWidth / WIDTH) * HEIGHT);
    });
});
