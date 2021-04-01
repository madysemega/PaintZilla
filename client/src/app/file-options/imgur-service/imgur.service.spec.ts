import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ImgurService } from './imgur.service';

describe('ImgurService', () => {
    let service: ImgurService;
    // tslint:disable:no-any
    let matDialogRefSpy: jasmine.SpyObj<any>;
    let matDialogSpy: jasmine.SpyObj<any>;
    let postSubject: Subject<any>;

    let httpClientSpy: jasmine.SpyObj<HttpClient>;

    const numberOfDialogs = 0;
    beforeEach(() => {
        matDialogRefSpy = jasmine.createSpyObj('MatDialogRef<DiscardChangesDialogComponent>', ['componentInstance']);

        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open'], { openDialogs: { length: numberOfDialogs } });
        matDialogSpy.open.and.callFake(() => {
            return matDialogRefSpy;
        });
        postSubject = new Subject<any>();
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
        httpClientSpy.post.and.returnValue(postSubject);

        TestBed.configureTestingModule({
            imports: [MatDialogModule],
            providers: [
                { provide: MatDialog, useValue: matDialogSpy },
                { provide: HttpClient, useValue: httpClientSpy },
            ],
        });
        service = TestBed.inject(ImgurService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('uploadToImgur() should call HttpClient post method', () => {
        service.uploadToImgur('', '');
        expect(httpClientSpy.post).toHaveBeenCalled();
    });

    it('openImgurLinkDialog() should open a ImgurLinkDialogComponent dialog and set the correct link', () => {
        service.openImgurLinkDialog('test');
        expect(matDialogSpy.open).toHaveBeenCalled();
        expect(matDialogRefSpy.componentInstance.link).toEqual('test');
    });
});
