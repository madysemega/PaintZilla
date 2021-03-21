import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ServerService } from '@app/server-communication/service/server.service';
import { Drawing } from '@common/models/drawing';
import { of } from 'rxjs';
import { DrawingLoaderService } from './drawing-loader.service';

describe('DrawingLoaderService', () => {
    let service: DrawingLoaderService;

    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let serverServiceSpy: jasmine.SpyObj<ServerService>;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['setImageFromBase64']);

        serverServiceSpy = jasmine.createSpyObj('ServerService', ['getDrawingById']);
        serverServiceSpy.getDrawingById.and.returnValue(of({} as Drawing));

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: HttpClient },
                { provide: HttpHandler },
                { provide: ServerService, useValue: serverServiceSpy },
            ],
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
