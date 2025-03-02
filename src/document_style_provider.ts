import * as vscode from 'vscode';

/**
 * Provides document symbols for R files, recognizing specific comment patterns
 * and organizes them into a hierarchical structure.
 */
class TargetsSymbolProvider implements vscode.DocumentSymbolProvider {
    
    /**
     * Provides document symbols for the given document.
     * @param document The document in which to provide symbols.
     * @param token A cancellation token.
     * @returns A promise that resolves to an array of document symbols.
     */
    public provideDocumentSymbols(
        document: vscode.TextDocument,
        token: vscode.CancellationToken): Promise<vscode.DocumentSymbol[]> {
        return new Promise((resolve, reject) => {

            let symbols: vscode.DocumentSymbol[] = [];
            const regex = /^[^#]*(?<level_indicator>#+)tgt\s*(?<label>[\w\s]*)/;

            let currentLevel1Symbol: vscode.DocumentSymbol | null = null;
            let currentLevel2Symbol: vscode.DocumentSymbol | null = null;

            for (let i = 0; i < document.lineCount; i++) {

                const line  = document.lineAt(i);
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


/**
 * Activates the document symbol provider for R files.
 * @param context The extension context.
 */
export function activate_document_style_provider(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider(
            {
                scheme: "file", 
                language: "r"
            }, 
            new TargetsSymbolProvider()
        ) 
    );
}
