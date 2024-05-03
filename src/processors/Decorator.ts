import * as vscode from 'vscode';
import { window, Range } from 'vscode';
import StyleConstants from '../utils/StyleConstants';
import * as path from 'path';
import AppConstants from '../utils/AppConstants';

export default class Decorator {

    dateDecorations: vscode.DecorationOptions[] = [];
    projectDecorations: vscode.DecorationOptions[] = [];
    priorityDecorations: vscode.DecorationOptions[] = [];
    overdueDecorations: vscode.DecorationOptions[] = [];
    completedDecorations: vscode.DecorationOptions[] = [];
    contextDecorations: vscode.DecorationOptions[] = [];
    activeEditor?: vscode.TextEditor;

    private dateDecorationType = vscode.window.createTextEditorDecorationType({
        light: {
            color: StyleConstants.DATE_LIGHT
        },
        dark: {
            color: StyleConstants.DATE_DARK
        }
    });

    private projectDecorationType = vscode.window.createTextEditorDecorationType({
        light: {
            color: StyleConstants.PROJECT_LIGHT
        },
        dark: {
            color: StyleConstants.PROJECT_DARK
        }
    });

    private priorityDecorationType = vscode.window.createTextEditorDecorationType({
        light: {
            color: StyleConstants.PRIORITY_LIGHT
        },
        dark: {
            color: StyleConstants.PRIORITY_DARK
        }
    });

    private overdueDecorationType = vscode.window.createTextEditorDecorationType({

    });

    private contextDecorationType = vscode.window.createTextEditorDecorationType({
        light: {
            color: StyleConstants.CONTEXT_LIGHT
        },
        dark: {
            color: StyleConstants.CONTEXT_DARK
        }
    });

    private completedDecorationType = vscode.window.createTextEditorDecorationType({
        textDecoration: StyleConstants.COMPLETED_CSS
    });

    public handleDecoration() {
        vscode.workspace.onDidChangeTextDocument(event => {
            event.contentChanges.forEach(_change => {
                // Todo decorate only the line where the change happened
                // const changedLine = change.range.start.line;
            })
            this.doDecorateAll();
        });
        vscode.window.onDidChangeActiveTextEditor(document => {
            this.doDecorateAll();
        });
        this.doDecorateAll();
    }

    private doDecorateAll() {
        // Clear all current decorations and set active editor
        this.activeEditor = vscode.window.activeTextEditor;

        if (!this.activeEditor) return;
        
        // Clear all current decorations and set active editor
        this.clearAllDecorations();
        
        // check if the filename is correct
        const document = this.activeEditor.document;
        const fileName = path.basename(document.fileName);

        if (AppConstants.ACCEPTED_FILENAMES.lastIndexOf(fileName) >= 0) {
            // Iterate over each line and parse accordingly
            let totalLines = document.lineCount;
            for (var i = 0; i <= totalLines - 1; i++) {
                let lineObject = document.lineAt(i);
                this.parseLineObject(lineObject);
            }
        }
        // Set final decorations
        this.setDecorations();
    }

    private parseLineObject(inputLine: vscode.TextLine) {
        this.parseRegex(AppConstants.DATE_REGEX, this.dateDecorations, inputLine);
        this.parseRegex(AppConstants.PROJECT_REGEX, this.projectDecorations, inputLine);
        this.parseRegex(AppConstants.CONTEXT_REGEX, this.contextDecorations, inputLine);
        this.parseRegex(AppConstants.PRIORITY_REGEX, this.priorityDecorations, inputLine);

        if (inputLine.text.startsWith("x ") || inputLine.text.startsWith("X ")) {
            let decoration = { range: inputLine.range };
            this.completedDecorations.push(decoration);
        }
    }

    private clearAllDecorations() {
        this.dateDecorations = [];
        this.projectDecorations = [];
        this.priorityDecorations = [];
        this.contextDecorations = [];
        this.overdueDecorations = [];
        this.completedDecorations = [];
    }

    private setDecorations() {
        if (!this.activeEditor) return;
        this.activeEditor.setDecorations(this.dateDecorationType, this.dateDecorations);
        this.activeEditor.setDecorations(this.projectDecorationType, this.projectDecorations);
        this.activeEditor.setDecorations(this.contextDecorationType, this.contextDecorations);
        this.activeEditor.setDecorations(this.completedDecorationType, this.completedDecorations);
        this.activeEditor.setDecorations(this.priorityDecorationType, this.priorityDecorations);
    }

    private parseRegex(iRegExp: RegExp, decorationOptions: vscode.DecorationOptions[], inputLine: vscode.TextLine) {
        let result: RegExpExecArray | null;
        while (result = iRegExp.exec(inputLine.text)) {
            let beginPosition = new vscode.Position(inputLine.range.start.line, inputLine.firstNonWhitespaceCharacterIndex + result.index);
            let endPosition = new vscode.Position(inputLine.range.start.line, inputLine.firstNonWhitespaceCharacterIndex + result.index + result[0].length);
            let decoration = { range: new Range(beginPosition, endPosition) };
            decorationOptions.push(decoration);
        }
    }
}