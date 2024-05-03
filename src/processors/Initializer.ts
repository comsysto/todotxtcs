import * as vscode from 'vscode';
import AppConstants from '../utils/AppConstants';

export function initTodoFile() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
        const currentWorkspaceFolder = workspaceFolders[0]; // Assuming only one workspace folder is opened
        const filePath = vscode.Uri.joinPath(currentWorkspaceFolder.uri, 'todo.txt');
        const fileContent = AppConstants.README;

        // Check if the file already exists
        vscode.workspace.fs.stat(filePath).then(
            _stat => {
                // File exists, do nothing
                vscode.window.showInformationMessage('todo.txt already exists.');
            },
            _error => {
                // File does not exist, create it
                vscode.workspace.fs.writeFile(filePath, Buffer.from(fileContent));
                vscode.window.showInformationMessage('Created todo.txt');
            });
    } else {
        vscode.window.showErrorMessage('No workspace folder opened.');
    }
}
