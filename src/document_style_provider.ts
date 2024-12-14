import * as vscode from 'vscode';


class SwmfConfigDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    
    public provideDocumentSymbols(
        document: vscode.TextDocument,
        token: vscode.CancellationToken): Promise<vscode.DocumentSymbol[]> {
        return new Promise((resolve, reject) => {

            let symbols: vscode.DocumentSymbol[] = [];
            const regex = /^\s*(?<level_indicator>#{1,3})tgt\s*(?<label>\w*)\s*-{4}/;

            let currentLevel1Symbol: vscode.DocumentSymbol | null = null;
            let currentLevel2Symbol: vscode.DocumentSymbol | null = null;

            for (let i = 0; i < document.lineCount; i++) {
                const line = document.lineAt(i);
                const match = regex.exec(line.text);

                if (match && match.groups) {
                    const level = match.groups['level_indicator'].length; // Determine the level based on the number of hashes
                    const label = match.groups['label'];

                    let symbol = new vscode.DocumentSymbol(
                        label,
                        'Target',
                        vscode.SymbolKind.Function,
                        line.range,
                        line.range
                    );

                    if (level === 1) { // Level 1 heading (#tgt)
                        currentLevel1Symbol = symbol;
                        currentLevel2Symbol = null;
                        symbols.push(symbol);
                    } else if (level === 2) { // Level 2 heading (##tgt)
                        currentLevel2Symbol = symbol;
                        if (currentLevel1Symbol) {
                            currentLevel1Symbol.children.push(symbol);
                        } else {
                            symbols.push(symbol);
                        }
                    } else if (level === 3) { // Level 3 heading (###tgt)
                        if (currentLevel2Symbol) {
                            currentLevel2Symbol.children.push(symbol);
                        } else if (currentLevel1Symbol) {
                            currentLevel1Symbol.children.push(symbol);
                        } else {
                            symbols.push(symbol);
                        }
                    }
                }
            }

            resolve(symbols);
        });
    }
}


export function activate_document_style_provider(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider(
            {
                scheme: "file", 
                language: "r"
            }, 
            new SwmfConfigDocumentSymbolProvider()
        ) 
    );
}
