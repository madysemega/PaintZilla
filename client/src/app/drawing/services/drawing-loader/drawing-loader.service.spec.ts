import { HttpClient, HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { MaterialModule } from '@app/material.module';
import { ServerService } from '@app/server-communication/service/server.service';
import { Drawing } from '@common/models/drawing';
import { HotkeyModule } from 'angular2-hotkeys';
import { of, throwError } from 'rxjs';
import { DrawingLoaderService } from './drawing-loader.service';

describe('DrawingLoaderService', () => {
    let service: DrawingLoaderService;

    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let serverServiceSpy: jasmine.SpyObj<ServerService>;

    let snackBarStub: jasmine.SpyObj<MatSnackBar>;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['setImageFromBase64']);

        serverServiceSpy = jasmine.createSpyObj('ServerService', ['getDrawingById']);
        serverServiceSpy.getDrawingById.and.returnValue(of({} as Drawing));

        snackBarStub = jasmine.createSpyObj('MatSnackBar', ['open']);

        TestBed.configureTestingModule({
            imports: [MaterialModule, BrowserAnimationsModule, HotkeyModule.forRoot()],
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: HttpClient },
                { provide: HttpHandler },
                { provide: ServerService, useValue: serverServiceSpy },
                { provide: MatSnackBar, useValue: snackBarStub },
                { provide: MatDialog },
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

    it('loadFromServer() should open snack bar on error', () => {
        const error: HttpErrorResponse = new HttpErrorResponse({
            error: '',
            status: 404,
            statusText: '',
        });

        serverServiceSpy.getDrawingById.and.returnValue(throwError(error));

        service.loadFromServer('123');

        expect(snackBarStub.open).toHaveBeenCalled();
    });
});
