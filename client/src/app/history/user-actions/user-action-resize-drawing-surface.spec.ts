import { UserActionResizeDrawingSurface } from "./user-action-resize-drawing-surface";

describe('UserActionRenderShape', () => {
    let action: UserActionResizeDrawingSurface;
    let callback: (width: number, height: number) => void;
    let callbackFlag: boolean;

    const WIDTH  = 420;
    const HEIGHT = 360

    it('apply should invoke callback with the right dimensions', () => {
        callbackFlag = false;
        callback = (width: number, height: number) => (callbackFlag = width === WIDTH && height === HEIGHT);

        action = new UserActionResizeDrawingSurface(WIDTH, HEIGHT, callback);

        action.apply();
        expect(callbackFlag).toBeTruthy();
    });
});