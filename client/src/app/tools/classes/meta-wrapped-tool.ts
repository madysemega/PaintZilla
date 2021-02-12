import { Tool } from './tool';

export type MetaWrappedTool = {
    displayName: string;
    icon: string;
    keyboardShortcut: string;
    tool: Tool;
};
