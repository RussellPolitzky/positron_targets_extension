// The module 'vscode' contains the VS Code extensibility API
import * as vscode   from 'vscode';
import { activate_document_style_provider } from './document_style_provider';
import { activate_targets_commands        } from './targets_execution';

/**
 * Activates the extension.
 * @param context - The extension context.
 */
export function activate(context: vscode.ExtensionContext): void {
  console.log("Targets helper extension is now active!");
  activate_document_style_provider(context);
  activate_targets_commands(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}
