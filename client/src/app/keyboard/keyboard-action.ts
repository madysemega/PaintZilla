export type KeyboardAction = {
    uniqueName: string;
    contexts: string[];

    trigger: string;
    invoke: () => void;
};
