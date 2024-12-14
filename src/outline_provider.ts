import * as vscode from 'vscode';

class OutlineProvider implements vscode.TreeDataProvider<OutlineItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<OutlineItem | undefined | void> = new vscode.EventEmitter<OutlineItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<OutlineItem | undefined | void> = this._onDidChangeTreeData.event;

    constructor(private workspaceRoot: string | undefined) {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: OutlineItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: OutlineItem): Thenable<OutlineItem[]> {
        if (!this.workspaceRoot) {
            vscode.window.showInformationMessage('No workspace folder found');
            return Promise.resolve([]);
        }

        if (element) {
            return Promise.resolve([]);
        } else {
            const outlineItems = this.getOutlineItems();
            return Promise.resolve(outlineItems);
        }
    }

    private getOutlineItems(): OutlineItem[] {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.languageId !== 'r') {
            return [];
        }

        const text = editor.document.getText();
        const outlineItems: OutlineItem[] = [];

        const regex = /^(# .+? -+|## .+? -+|### .+? -+)$/gm;
        let match;
        while ((match = regex.exec(text)) !== null) {
            const line = editor.document.positionAt(match.index).line;
            const range = new vscode.Range(line, 0, line, match[0].length);
            const label = match[0].replace(/ -+$/, ''); // Remove trailing dashes
            const level = match[0].startsWith('###') ? 3 : match[0].startsWith('##') ? 2 : 1;
            const item = new OutlineItem(label, range, level);
            outlineItems.push(item);
        }

        return outlineItems;
    }
}

class OutlineItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        private readonly range: vscode.Range,
        public readonly level: number
    ) {
        super(label, level === 1 ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
        this.command = {
            command: 'vscode.open',
            title: 'Open File',
            arguments: [vscode.window.activeTextEditor?.document.uri, { selection: range }]
        };
    }
}

export function activateOutlineProvider(context: vscode.ExtensionContext) {
    const outlineProvider = new OutlineProvider(vscode.workspace.rootPath);
    vscode.window.registerTreeDataProvider('outlineView', outlineProvider);
    vscode.commands.registerCommand('outlineView.refresh', () => outlineProvider.refresh());
}
