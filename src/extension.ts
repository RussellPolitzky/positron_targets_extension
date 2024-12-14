// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode   from 'vscode';
import * as positron from 'positron';
import { activate_document_style_provider } from './document_style_provider';

/**
 * Executes R code in the current R session.
 * @param {string} rCode - The R code to be executed.
 */
function executeRCodeInSession(rCode: string): void {
    console.log(`Executing R code: ${rCode}`);
    positron.runtime.executeCode(
        'r',                // languageId
        rCode,              // code
        true,               // focus
        false,              // allowIncomplete
        undefined,          // mode (optional)
        undefined           // errorBehavior (optional)
    ).then(
        (success: boolean) => {
            if (success) {
                console.log('R code execution was successful.');
            } else {
                console.error('Failed to send R code to the runtime.');
            }
        },
        (error: any) => {
            console.error('Error executing R code:', error);
        }
    );
}


/**
 * Executes the targets::tar_make function in the R session.
 */
function executeTargetsMake(): void {
	executeRCodeInSession("targets::tar_make()");
}


/**
 * Executes the targets::tar_watch function in the R session.
 */
function executeTargetsWatch(): void {
  executeRCodeInSession("targets::tar_watch()");
}


/**
 * Executes a given R code function on the selected text in the active text editor.
 * @param r_code_fn - A function that takes the selected text and returns the R code to be executed.
 */
function executeTargetsOnSelectedText(r_code_fn: (selectedText: string) => string): void {
    const editor = vscode.window.activeTextEditor;
	if (editor) {
		const document     = editor.document;
		const selection    = editor.selection;
		const selectedText = document.getText(selection);
		if (selectedText) {
		const rCode = r_code_fn(selectedText);
		executeRCodeInSession(rCode);
		} else {
		vscode.window.showInformationMessage('No text selected.');
		}
	} else {
		vscode.window.showInformationMessage('No active text editor.');
	}
}


/**
 * Executes the targets::tar_load function on the selected text in the R session.
 */
function executeTargetsLoad(): void {
	executeTargetsOnSelectedText((selectedText: string) => {
		return `targets::tar_load(${selectedText})`;
	});
}


/**
 * Executes the targets::tar_read function on the selected text in the R session.
 */
function executeTargetsRead(): void {
	executeTargetsOnSelectedText((selectedText: string) => {
		return `targets::tar_read(${selectedText})`;
	});
}


/**
 * Executes the targets::tar_make function on the selected text in the R session.
 */
function executeTargetsMakeSelected(): void {
	executeTargetsOnSelectedText((selectedText: string) => {
		return `targets::tar_make(${selectedText})`;
	});
}


/**
 * Executes the targets::tar_make function with debug information on the selected text in the R session.
 */
function executeTargetsDebugSelected(): void {
	executeTargetsOnSelectedText((selectedText: string) => {
		return `targets::tar_make(names = ${selectedText}, callr_function = NULL)`;
	});
}  


/**
 * Activates the extension.
 * @param context - The extension context.
 */
export function activate(context: vscode.ExtensionContext): void {

  // This generates outlines for targets.
  activate_document_style_provider(context);

  let disposableRead                 = vscode.commands.registerCommand('executeTargetsRead'         , executeTargetsRead         );
  let disposableLoad                 = vscode.commands.registerCommand('executeTargetsLoad'         , executeTargetsLoad         );
  let disposableTargetsMakeSelected  = vscode.commands.registerCommand('executeTargetsMakeSelected' , executeTargetsMakeSelected );
  let disposableTargetsMake          = vscode.commands.registerCommand('executeTargetsMake'         , executeTargetsMake         );
  let disposableTargetsDebugSelected = vscode.commands.registerCommand('executeTargetsDebugSelected', executeTargetsDebugSelected);
  let disposableTargetsWatch         = vscode.commands.registerCommand('executeTargetsWatch'        , executeTargetsWatch        );

  context.subscriptions.push(
    disposableRead,
    disposableLoad,
    disposableTargetsMakeSelected,
    disposableTargetsMake,
    disposableTargetsDebugSelected,
    disposableTargetsWatch
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
