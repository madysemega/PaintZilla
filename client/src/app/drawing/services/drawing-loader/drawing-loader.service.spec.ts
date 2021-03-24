import { HttpClient, HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { MaterialModule } from '@app/material.module';
import { ServerService } from '@app/server-communication/service/server.service';
import { Drawing } from '@common/models/drawing';
import { of, throwError } from 'rxjs';
import { DrawingLoaderService } from './drawing-loader.service';

describe('DrawingLoaderService', () => {
    let service: DrawingLoaderService;

    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let snackBarStub: jasmine.SpyObj<MatSnackBar>;
    let dialogStub: jasmine.SpyObj<MatDialog>;
    let serverServiceStub: jasmine.SpyObj<ServerService>;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['setImageFromBase64']);
        drawingServiceSpy.setImageFromBase64.and.stub();

        serverServiceStub = jasmine.createSpyObj('ServerService', ['getDrawingById']);

        snackBarStub = jasmine.createSpyObj('MatSnackBar', ['open']);
        snackBarStub.open.and.stub();

        dialogStub = jasmine.createSpyObj('MatDialog', ['open']);
        dialogStub.open.and.stub();

        TestBed.configureTestingModule({
            imports: [MaterialModule, BrowserAnimationsModule],
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: HttpClient },
                { provide: HttpHandler },
                { provide: ServerService, useValue: serverServiceStub },
                { provide: MatSnackBar, useValue: snackBarStub },
                { provide: MatDialog, useValue: dialogStub },
            ],
        });
        service = TestBed.inject(DrawingLoaderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('When loading drawing from server, if success then apply drawing to surface', () => {
        const FAKE_DRAWING: Drawing = {
            id: '123',
            name: 'test',
            drawing: '',
            labels: ['321', 'test'],
        };

        serverServiceStub.getDrawingById.and.returnValue(of(FAKE_DRAWING));
        service.loadFromServer('123');
        expect(drawingServiceSpy.setImageFromBase64).toHaveBeenCalled();
    });

    it('When loading drawing from server, if failure then notify user', () => {
        const FAKE_HTTP_ERROR_RESPONSE: HttpErrorResponse = new HttpErrorResponse({
            error: '',
            status: 404,
            statusText: '',
        });

        serverServiceStub.getDrawingById.and.returnValue(throwError(FAKE_HTTP_ERROR_RESPONSE));
        service.loadFromServer('123');
        expect(snackBarStub.open).toHaveBeenCalled();
    });
});
