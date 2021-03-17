import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import * as Constants from '@app/commons/constants/server.service.spec.constants';
import { Drawing } from '@common/models/drawing';
import { Validator } from '@common/validation/validator';
import { Subject, Subscriber } from 'rxjs';
import { ServerService } from './server.service';

export const MOCK_DRAWING: Drawing = {
    id: Constants.DEFAULT_ID,
    drawing: Constants.DEFAULT_DRAWING,
    name: Constants.DEFAULT_NAME,
    labels: Constants.DEFAULT_LABELS,
};
describe('RequestsService', () => {
    // tslint:disable:no-any
    let service: ServerService;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    let subscriberSpy: jasmine.SpyObj<any>;
    let postSubject: Subject<Drawing>;
    let getMultipleDrawingSubject: Subject<Drawing[]>;
    let getSubject: Subject<Drawing>;
    let putSubject: Subject<Drawing>;
    let deleteSubject: Subject<void>;
    beforeEach(async () => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get', 'put', 'delete']);
        subscriberSpy = jasmine.createSpyObj('Subscriber', ['successChannel', 'errorChannel']);
        postSubject = new Subject<Drawing>();
        getMultipleDrawingSubject = new Subject<Drawing[]>();
        getSubject = new Subject<Drawing>();
        putSubject = new Subject<Drawing>();
        deleteSubject = new Subject<void>();
        httpClientSpy.post.and.returnValue(postSubject);
        httpClientSpy.get.and.returnValue(getSubject);
        httpClientSpy.put.and.returnValue(putSubject);
        httpClientSpy.delete.and.returnValue(deleteSubject);
        spyOn(Validator, 'checkAll').and.returnValue();
        spyOn(Validator, 'checkId').and.returnValue();
        spyOn(Validator, 'checkName').and.returnValue();
        spyOn(Validator, 'checkLabels').and.returnValue();
        spyOn(Validator, 'checkDrawing').and.returnValue();
        TestBed.configureTestingModule({
            providers: [
                { provide: HttpClient, useValue: httpClientSpy },
                { provider: Subscriber, useValue: subscriberSpy },
            ],
        });
        service = TestBed.inject(ServerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('createDrawing(): should call all external methods', () => {
        service.createDrawing(MOCK_DRAWING.name, MOCK_DRAWING.drawing, MOCK_DRAWING.labels);
        expect(Validator.checkName).toHaveBeenCalledWith(MOCK_DRAWING.name);
        expect(Validator.checkDrawing).toHaveBeenCalledWith(MOCK_DRAWING.drawing);
        expect(Validator.checkLabels).toHaveBeenCalledWith(MOCK_DRAWING.labels);
        expect(httpClientSpy.post).toHaveBeenCalled();
    });

    it('createDrawing(): should return an observable on success channel if post request returns success', () => {
        service.createDrawing(MOCK_DRAWING.name, MOCK_DRAWING.drawing, MOCK_DRAWING.labels).subscribe((drawing: Drawing) => {
            subscriberSpy.successChannel(drawing);
        });
        postSubject.next(MOCK_DRAWING);
        expect(subscriberSpy.successChannel).toHaveBeenCalledWith(MOCK_DRAWING);
    });

    it('createDrawing(): should return an observable on error channel if post request returns error', () => {
        service.createDrawing(MOCK_DRAWING.name, MOCK_DRAWING.drawing, MOCK_DRAWING.labels).subscribe(
            (drawing: Drawing) => {
                subscriberSpy.successChannel(drawing);
            },
            (error: HttpErrorResponse) => {
                subscriberSpy.errorChannel(error);
            },
        );
        postSubject.error(Constants.CREATE_ERROR);
        expect(subscriberSpy.successChannel).not.toHaveBeenCalled();
        expect(subscriberSpy.errorChannel).toHaveBeenCalledWith(Constants.CREATE_ERROR);
    });

    it('getAllDrawings(): should call all external methods', () => {
        service.getAllDrawings();
        expect(httpClientSpy.get).toHaveBeenCalled();
    });

    it('getAllDrawings(): should return an observable on success channel if get request returns success', () => {
        httpClientSpy.get.and.returnValue(getMultipleDrawingSubject);
        service.getAllDrawings().subscribe((drawings: Drawing[]) => {
            subscriberSpy.successChannel(drawings);
        });
        getMultipleDrawingSubject.next([MOCK_DRAWING]);
        expect(subscriberSpy.successChannel).toHaveBeenCalledWith([MOCK_DRAWING]);
    });

    it('getAllDrawings(): should return an observable on error channel if get request returns error', () => {
        httpClientSpy.get.and.returnValue(getMultipleDrawingSubject);
        service.getAllDrawings().subscribe(
            (drawings: Drawing[]) => {
                subscriberSpy.successChannel(drawings);
            },
            (error: HttpErrorResponse) => {
                subscriberSpy.errorChannel(error);
            },
        );
        getMultipleDrawingSubject.error(Constants.GET_ERROR);
        expect(subscriberSpy.successChannel).not.toHaveBeenCalled();
        expect(subscriberSpy.errorChannel).toHaveBeenCalledWith(Constants.GET_ERROR);
    });

    it('getAllLabels(): should call all external methods', () => {
        service.getAllLabels();
        expect(httpClientSpy.get).toHaveBeenCalled();
    });

    it('getAllLabels(): should return an observable on success channel if get request returns success', () => {
        httpClientSpy.get.and.returnValue(getMultipleDrawingSubject);
        service.getAllLabels().subscribe((labels: string[]) => {
            subscriberSpy.successChannel(labels);
        });
        getMultipleDrawingSubject.next([MOCK_DRAWING]);
        expect(subscriberSpy.successChannel).toHaveBeenCalledWith([MOCK_DRAWING]);
    });

    it('getAllLabels(): should return an observable on error channel if get request returns error', () => {
        httpClientSpy.get.and.returnValue(getMultipleDrawingSubject);
        service.getAllLabels().subscribe(
            (labels: string[]) => {
                subscriberSpy.successChannel(labels);
            },
            (error: HttpErrorResponse) => {
                subscriberSpy.errorChannel(error);
            },
        );
        getMultipleDrawingSubject.error(Constants.GET_ERROR);
        expect(subscriberSpy.successChannel).not.toHaveBeenCalled();
        expect(subscriberSpy.errorChannel).toHaveBeenCalledWith(Constants.GET_ERROR);
    });

    it('getDrawingById(): should call all external methods', () => {
        service.getDrawingById(MOCK_DRAWING.id);
        expect(Validator.checkId).toHaveBeenCalledWith(MOCK_DRAWING.id);
        expect(httpClientSpy.get).toHaveBeenCalled();
    });

    it('getDrawingById(): should return an observable on success channel if get request returns success', () => {
        service.getDrawingById(MOCK_DRAWING.id).subscribe((drawing: Drawing) => {
            subscriberSpy.successChannel(drawing);
        });
        getSubject.next(MOCK_DRAWING);
        expect(subscriberSpy.successChannel).toHaveBeenCalledWith(MOCK_DRAWING);
    });

    it('getDrawingsById(): should return an observable on error channel if get request returns error', () => {
        service.getDrawingById(MOCK_DRAWING.id).subscribe(
            (drawing: Drawing) => {
                subscriberSpy.successChannel(drawing);
            },
            (error: HttpErrorResponse) => {
                subscriberSpy.errorChannel(error);
            },
        );
        getSubject.error(Constants.GET_ERROR);
        expect(subscriberSpy.successChannel).not.toHaveBeenCalled();
        expect(subscriberSpy.errorChannel).toHaveBeenCalledWith(Constants.GET_ERROR);
    });

    it('getDrawingByName(): should call all external methods', () => {
        service.getDrawingsByName(MOCK_DRAWING.name);
        expect(Validator.checkName).toHaveBeenCalledWith(MOCK_DRAWING.name);
        expect(httpClientSpy.get).toHaveBeenCalled();
    });

    it('getDrawingByName(): should return an observable on success channel if get request returns success', () => {
        httpClientSpy.get.and.returnValue(getMultipleDrawingSubject);
        service.getDrawingsByName(MOCK_DRAWING.name).subscribe((drawings: Drawing[]) => {
            subscriberSpy.successChannel(drawings);
        });
        getMultipleDrawingSubject.next([MOCK_DRAWING]);
        expect(subscriberSpy.successChannel).toHaveBeenCalledWith([MOCK_DRAWING]);
    });

    it('getDrawingsByName(): should return an observable on error channel if get request returns error', () => {
        httpClientSpy.get.and.returnValue(getMultipleDrawingSubject);
        service.getDrawingsByName(MOCK_DRAWING.name).subscribe(
            (drawings: Drawing[]) => {
                subscriberSpy.successChannel(drawings);
            },
            (error: HttpErrorResponse) => {
                subscriberSpy.errorChannel(error);
            },
        );
        getMultipleDrawingSubject.error(Constants.GET_ERROR);
        expect(subscriberSpy.successChannel).not.toHaveBeenCalled();
        expect(subscriberSpy.errorChannel).toHaveBeenCalledWith(Constants.GET_ERROR);
    });

    it('getDrawingsByLabelsAllMatch(): should call all external methods', () => {
        service.getDrawingsByLabelsAllMatch(MOCK_DRAWING.labels);
        expect(Validator.checkLabels).toHaveBeenCalledWith(MOCK_DRAWING.labels);
        expect(httpClientSpy.get).toHaveBeenCalled();
    });

    it('getDrawingsByLabelsAllMatch(): should return an observable on success channel if get request returns success', () => {
        httpClientSpy.get.and.returnValue(getMultipleDrawingSubject);
        service.getDrawingsByLabelsAllMatch(MOCK_DRAWING.labels).subscribe((drawings: Drawing[]) => {
            subscriberSpy.successChannel(drawings);
        });
        getMultipleDrawingSubject.next([MOCK_DRAWING]);
        expect(subscriberSpy.successChannel).toHaveBeenCalledWith([MOCK_DRAWING]);
    });

    it('getDrawingsByLabelsAllMatch(): should return an observable on error channel if get request returns error', () => {
        httpClientSpy.get.and.returnValue(getMultipleDrawingSubject);
        service.getDrawingsByLabelsAllMatch(MOCK_DRAWING.labels).subscribe(
            (drawings: Drawing[]) => {
                subscriberSpy.successChannel(drawings);
            },
            (error: HttpErrorResponse) => {
                subscriberSpy.errorChannel(error);
            },
        );
        getMultipleDrawingSubject.error(Constants.GET_ERROR);
        expect(subscriberSpy.successChannel).not.toHaveBeenCalled();
        expect(subscriberSpy.errorChannel).toHaveBeenCalledWith(Constants.GET_ERROR);
    });

    it('getDrawingsByLabelsOneMatch(): should call all external methods', () => {
        service.getDrawingsByLabelsOneMatch(MOCK_DRAWING.labels);
        expect(Validator.checkLabels).toHaveBeenCalledWith(MOCK_DRAWING.labels);
        expect(httpClientSpy.get).toHaveBeenCalled();
    });

    it('getDrawingsByLabelsOneMatch(): should return an observable on success channel if get request returns success', () => {
        httpClientSpy.get.and.returnValue(getMultipleDrawingSubject);
        service.getDrawingsByLabelsOneMatch(MOCK_DRAWING.labels).subscribe((drawings: Drawing[]) => {
            subscriberSpy.successChannel(drawings);
        });
        getMultipleDrawingSubject.next([MOCK_DRAWING]);
        expect(subscriberSpy.successChannel).toHaveBeenCalledWith([MOCK_DRAWING]);
    });

    it('getDrawingsByLabelsOneMatch(): should return an observable on error channel if get request returns error', () => {
        httpClientSpy.get.and.returnValue(getMultipleDrawingSubject);
        service.getDrawingsByLabelsOneMatch(MOCK_DRAWING.labels).subscribe(
            (drawings: Drawing[]) => {
                subscriberSpy.successChannel(drawings);
            },
            (error: HttpErrorResponse) => {
                subscriberSpy.errorChannel(error);
            },
        );
        getMultipleDrawingSubject.error(Constants.GET_ERROR);
        expect(subscriberSpy.successChannel).not.toHaveBeenCalled();
        expect(subscriberSpy.errorChannel).toHaveBeenCalledWith(Constants.GET_ERROR);
    });

    it('updateDrawing(): should call all external methods', () => {
        service.updateDrawing(MOCK_DRAWING.id, MOCK_DRAWING);
        expect(Validator.checkId).toHaveBeenCalledWith(MOCK_DRAWING.id);
        expect(Validator.checkAll).toHaveBeenCalledWith(MOCK_DRAWING);
        expect(httpClientSpy.put).toHaveBeenCalled();
    });

    it('updateDrawing(): should return an observable on success channel if get request returns success', () => {
        service.updateDrawing(MOCK_DRAWING.id, MOCK_DRAWING).subscribe((drawing: Drawing) => {
            subscriberSpy.successChannel(drawing);
        });
        putSubject.next(MOCK_DRAWING);
        expect(subscriberSpy.successChannel).toHaveBeenCalledWith(MOCK_DRAWING);
    });

    it('updateDrawing(): should return an observable on success channel if get request returns success', () => {
        service.updateDrawing(MOCK_DRAWING.id, MOCK_DRAWING).subscribe(
            (drawing: Drawing) => {
                subscriberSpy.successChannel(drawing);
            },
            (error: HttpErrorResponse) => {
                subscriberSpy.errorChannel(error);
            },
        );
        putSubject.error(Constants.PUT_ERROR);
        expect(subscriberSpy.successChannel).not.toHaveBeenCalled();
        expect(subscriberSpy.errorChannel).toHaveBeenCalledWith(Constants.PUT_ERROR);
    });

    it('updateDrawingName(): should call all external methods', () => {
        service.updateDrawingName(MOCK_DRAWING.id, MOCK_DRAWING.name);
        expect(Validator.checkId).toHaveBeenCalledWith(MOCK_DRAWING.id);
        expect(Validator.checkName).toHaveBeenCalledWith(MOCK_DRAWING.name);
        expect(httpClientSpy.put).toHaveBeenCalled();
    });

    it('updateDrawingName(): should return an observable on success channel if get request returns success', () => {
        service.updateDrawingName(MOCK_DRAWING.id, MOCK_DRAWING.name).subscribe((drawing: Drawing) => {
            subscriberSpy.successChannel(drawing);
        });
        putSubject.next(MOCK_DRAWING);
        expect(subscriberSpy.successChannel).toHaveBeenCalledWith(MOCK_DRAWING);
    });

    it('updateDrawingName(): should return an observable on success channel if get request returns success', () => {
        service.updateDrawingName(MOCK_DRAWING.id, MOCK_DRAWING.name).subscribe(
            (drawing: Drawing) => {
                subscriberSpy.successChannel(drawing);
            },
            (error: HttpErrorResponse) => {
                subscriberSpy.errorChannel(error);
            },
        );
        putSubject.error(Constants.PUT_ERROR);
        expect(subscriberSpy.successChannel).not.toHaveBeenCalled();
        expect(subscriberSpy.errorChannel).toHaveBeenCalledWith(Constants.PUT_ERROR);
    });

    it('updateDrawingLabels(): should call all external methods', () => {
        service.updateDrawingLabels(MOCK_DRAWING.id, MOCK_DRAWING.labels);
        expect(Validator.checkId).toHaveBeenCalledWith(MOCK_DRAWING.id);
        expect(Validator.checkLabels).toHaveBeenCalledWith(MOCK_DRAWING.labels);
        expect(httpClientSpy.put).toHaveBeenCalled();
    });

    it('updateDrawingLabels(): should return an observable on success channel if get request returns success', () => {
        service.updateDrawingLabels(MOCK_DRAWING.id, MOCK_DRAWING.labels).subscribe((drawing: Drawing) => {
            subscriberSpy.successChannel(drawing);
        });
        putSubject.next(MOCK_DRAWING);
        expect(subscriberSpy.successChannel).toHaveBeenCalledWith(MOCK_DRAWING);
    });

    it('updateDrawingLabels(): should return an observable on success channel if get request returns success', () => {
        service.updateDrawingLabels(MOCK_DRAWING.id, MOCK_DRAWING.labels).subscribe(
            (drawing: Drawing) => {
                subscriberSpy.successChannel(drawing);
            },
            (error: HttpErrorResponse) => {
                subscriberSpy.errorChannel(error);
            },
        );
        putSubject.error(Constants.PUT_ERROR);
        expect(subscriberSpy.successChannel).not.toHaveBeenCalled();
        expect(subscriberSpy.errorChannel).toHaveBeenCalledWith(Constants.PUT_ERROR);
    });

    it('updateDrawingContent(): should call all external methods', () => {
        service.updateDrawingContent(MOCK_DRAWING.id, MOCK_DRAWING.drawing);
        expect(Validator.checkId).toHaveBeenCalledWith(MOCK_DRAWING.id);
        expect(Validator.checkDrawing).toHaveBeenCalledWith(MOCK_DRAWING.drawing);
        expect(httpClientSpy.put).toHaveBeenCalled();
    });

    it('updateDrawingContent(): should return an observable on success channel if get request returns success', () => {
        service.updateDrawingContent(MOCK_DRAWING.id, MOCK_DRAWING.drawing).subscribe((drawing: Drawing) => {
            subscriberSpy.successChannel(drawing);
        });
        putSubject.next(MOCK_DRAWING);
        expect(subscriberSpy.successChannel).toHaveBeenCalledWith(MOCK_DRAWING);
    });

    it('updateDrawingContent(): should return an observable on success channel if get request returns success', () => {
        service.updateDrawingContent(MOCK_DRAWING.id, MOCK_DRAWING.drawing).subscribe(
            (drawing: Drawing) => {
                subscriberSpy.successChannel(drawing);
            },
            (error: HttpErrorResponse) => {
                subscriberSpy.errorChannel(error);
            },
        );
        putSubject.error(Constants.PUT_ERROR);
        expect(subscriberSpy.successChannel).not.toHaveBeenCalled();
        expect(subscriberSpy.errorChannel).toHaveBeenCalledWith(Constants.PUT_ERROR);
    });

    it('deleteDrawing(): should call all external methods', () => {
        service.deleteDrawing(MOCK_DRAWING.id);
        expect(Validator.checkId).toHaveBeenCalledWith(MOCK_DRAWING.id);
        expect(httpClientSpy.delete).toHaveBeenCalled();
    });

    it('deleteDrawing(): should return an observable on success channel if get request returns success', () => {
        service.deleteDrawing(MOCK_DRAWING.id).subscribe(() => {
            subscriberSpy.successChannel();
        });
        deleteSubject.next();
        expect(subscriberSpy.successChannel).toHaveBeenCalled();
    });

    it('deleteDrawing(): should return an observable on success channel if get request returns success', () => {
        service.deleteDrawing(MOCK_DRAWING.id).subscribe(
            () => {
                subscriberSpy.successChannel();
            },
            (error: HttpErrorResponse) => {
                subscriberSpy.errorChannel(error);
            },
        );
        deleteSubject.error(Constants.PUT_ERROR);
        expect(subscriberSpy.successChannel).not.toHaveBeenCalled();
        expect(subscriberSpy.errorChannel).toHaveBeenCalledWith(Constants.PUT_ERROR);
    });
});
