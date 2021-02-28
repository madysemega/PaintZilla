import { IUserAction } from './user-action';

export class UserActionResizeDrawingSurface implements IUserAction {
    apply(): void {
        this.onResizeCallback(this.width, this.height);
    }

    constructor(private width: number, private height: number, private onResizeCallback: (width: number, height: number) => void) {}
}
