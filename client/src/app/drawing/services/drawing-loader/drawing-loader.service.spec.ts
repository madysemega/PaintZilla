import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { DrawingLoaderService } from './drawing-loader.service';

describe('DrawingLoaderService', () => {
    let service: DrawingLoaderService;

    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['setImageFromBase64']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpy }],
        });
        service = TestBed.inject(DrawingLoaderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it("loadFromServer() should set the drawing surface's image to the downloaded base64 image", () => {
        const IMAGE_ID = '1234567890';

        service.loadFromServer(IMAGE_ID);
        expect(drawingServiceSpy.setImageFromBase64).toHaveBeenCalled();
    });
});
