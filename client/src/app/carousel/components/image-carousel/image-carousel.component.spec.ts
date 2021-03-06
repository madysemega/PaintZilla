import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ImageDetailsComponent } from '@app/carousel/components/image-details/image-details.component';
import { MaterialModule } from '@app/material.module';
import { Drawing } from '@common/models/drawing';
import { ImageCarouselComponent } from './image-carousel.component';

// tslint:disable: no-any
// tslint:disable: no-string-literal
describe('ImageCarouselComponent', () => {
    let component: ImageCarouselComponent;
    let fixture: ComponentFixture<ImageCarouselComponent>;

    let getNeightbouringIndicesSpy: jasmine.Spy<any>;
    let rotateRightSpy: jasmine.Spy<any>;
    let rotateLeftSpy: jasmine.Spy<any>;

    let refreshSpy: jasmine.Spy<any>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MaterialModule, CommonModule, MatTooltipModule, CommonModule],
            declarations: [ImageCarouselComponent, ImageDetailsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ImageCarouselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        getNeightbouringIndicesSpy = spyOn<any>(component, 'getNeighbouringIndices').and.callThrough();
        rotateRightSpy = spyOn(component, 'rotateRight').and.callThrough();
        rotateLeftSpy = spyOn(component, 'rotateLeft').and.callThrough();

        refreshSpy = spyOn<any>(component, 'refresh').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('rotate right, should get neighbouring indices with index to the right of the current one', () => {
        const expectedIndex: number = component['centerIndex'] + 1;
        component.rotateRight();
        expect(getNeightbouringIndicesSpy).toHaveBeenCalledWith(expectedIndex);
    });

    it('rotate left, should get neighbouring indices with index to the right of the current one', () => {
        const expectedIndex: number = component['centerIndex'] - 1;
        component.rotateLeft();
        expect(getNeightbouringIndicesSpy).toHaveBeenCalledWith(expectedIndex);
    });

    it('right arrow should rotate carousel to the right', () => {
        component.onKeyPress({ key: 'ArrowRight' } as KeyboardEvent);
        expect(rotateRightSpy).toHaveBeenCalled();
    });

    it('left arrow should rotate carousel to the left', () => {
        component.onKeyPress({ key: 'ArrowLeft' } as KeyboardEvent);
        expect(rotateLeftSpy).toHaveBeenCalled();
    });

    it('setting the drawings input should update the drawings to display', () => {
        const DRAWINGS = [{} as Drawing];

        component.drawings = DRAWINGS;
        expect(component.drawingsToDisplay).toEqual(DRAWINGS);
    });

    it('settings the drawings input should refresh the carousel', () => {
        const DRAWINGS = [{} as Drawing];

        component.drawings = DRAWINGS;
        expect(refreshSpy).toHaveBeenCalled();
    });

    it('handleDeleteImageEvent() should emit a delete image event', () => {
        let deleteImageEventEmitted = false;
        component.deleteImage.subscribe(() => (deleteImageEventEmitted = true));
        component.handleDeleteImageEvent('123');
        expect(deleteImageEventEmitted).toBeTrue();
    });

    it('handleDeleteImageEvent() should refresh the carousel', () => {
        component.handleDeleteImageEvent('123');
        expect(refreshSpy).toHaveBeenCalled();
    });

    it('refreshImages sets centerIndex at the center of neighbourIndices if drawingsToDisplay has more than 1 image', () => {
        const DRAWING_TEST1: Drawing = {
            id: 'test1',
            name: 'test1',
            drawing: 'test1',
            labels: [],
        };
        const DRAWING_TEST2: Drawing = {
            id: 'test2',
            name: 'test2',
            drawing: 'test2',
            labels: [],
        };
        component.drawingsToDisplay.push(DRAWING_TEST1, DRAWING_TEST2);
        const EXPECTED_VALUE = component['getNeighbouringIndices'](component['centerIndex']).center;
        component['refresh']();
        expect(component['centerIndex']).toBe(EXPECTED_VALUE);
    });
});
