export type KeyboardAction = {
    trigger: string;
    invoke: () => void;
    contexts: string[];
};
