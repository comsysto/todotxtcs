// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import Decorator from './processors/Decorator';
import { TodoTxtCompletionItemProvider } from './processors/TodoTxtCompletionItemProvider';
import { languages } from 'vscode';
import { initTodoFile } from './processors/Initializer';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "todotxt" is now active!');

	// By Default Decorate the document
	const toDoDecorator = new Decorator();
	toDoDecorator.handleDecoration();

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(
		vscode.commands.registerCommand('todotxt.initialize', () => {
			// The code you place here will be executed every time your command is executed
			// Display a message box to the user
			initTodoFile();
		})
	);

	// initialize suggestions
	context.subscriptions.push(
		languages.registerCompletionItemProvider(
			{ pattern: '**/todo.txt' },
			new TodoTxtCompletionItemProvider()
		)
	);
}

// This method is called when your extension is deactivated
export function deactivate() { }
