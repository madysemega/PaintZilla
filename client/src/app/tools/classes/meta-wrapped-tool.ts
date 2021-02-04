import { Tool } from './tool';

export type MetaWrappedTool = {
    name: string;
    icon: string;
    keyboardShortcut: string;
    tool: Tool;
};
