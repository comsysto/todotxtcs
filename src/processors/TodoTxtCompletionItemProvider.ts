import {
    CompletionItemProvider,
    TextDocument,
    Position,
    CompletionItem,
    CompletionList,
    CompletionItemKind
} from 'vscode';
import AppConstants from '../utils/AppConstants';

enum TokenKind {
    Done,
    Priority,
    Date,
    Description,
    ProjectTag,
    ContextTag,
    SpecialTag
}

export class TodoTxtCompletionItemProvider implements CompletionItemProvider {

    provideCompletionItems(document: TextDocument, position: Position): Thenable<CompletionList> {

        const suggestions = [
            ['x '], // Completion status
            this.buildABC('A', 'D'), // Priorities
            ['@context', '+project', '#tag'], // Contexts, projects, tags
            ['due:YYYY-MM-DD'], // Due date format
            ['⊂(◉‿◉)つ']
        ];

        const completionItemsFromIndex = (index: number) => completionItems.push(...(
            suggestions[index]
                .map(suggestion => new CompletionItem(suggestion, CompletionItemKind.Keyword))
        ));

        // figure out token type
        let completionItems: CompletionItem[] = [];
        this.possibleTokenKinds(document, position).forEach(tokenKind => {
            switch (tokenKind) {
                case TokenKind.Done:
                    completionItemsFromIndex(0);
                    break;
                case TokenKind.Priority:
                    completionItemsFromIndex(1);
                    break;
                case TokenKind.Date:
                    completionItems.push(
                        new CompletionItem(`${this.dateTokenFromDate(Date.now())} `, CompletionItemKind.Keyword)
                    );
                    break;
                default:
                    completionItemsFromIndex(4);
            }
        })
        return Promise.resolve(new CompletionList(completionItems));
    }

    /**
     * Figures out what the suggested token kind should be.
     * For now only these kinds are supported.
     * {@linkcode TokenKind.Done},
     * {@linkcode TokenKind.Priority},
     * {@linkcode TokenKind.Date},
     * The following kinds are not supported, yet.
     * {@linkcode TokenKind.Description},
     * {@linkcode TokenKind.ProjectTag},
     * {@linkcode TokenKind.ContextTag},
     * {@linkcode TokenKind.SpecialTag}
     * 
     * Format of todo.txt, with [<>] being optional tokens.
     * [<completion>] [<priority>] [<completion_date>] [<creation_date>] <description> [<project_tags>] [<context_tags>] [<special_key_value_tags>]
     * @param document 
     * @param position 
     * @returns 
     */
    private possibleTokenKinds(document: TextDocument, position: Position): TokenKind[] {
        // setup common constants
        const line = document.lineAt(position.line)
        const text = line.text
        const textToTheLeft = text.slice(0, position.character)
        const textToTheRight = text.slice(position.character)

        // define cases for each token kind
        const tokenKinds: TokenKind[] = [];

        // Done
        const isDoneKind =
            !this.hasTokenKinds(textToTheLeft, [
                TokenKind.Done,
                TokenKind.Priority,
                TokenKind.Date,
                TokenKind.Description,
                TokenKind.ProjectTag,
                TokenKind.ContextTag,
                TokenKind.SpecialTag
            ])
            && this.findTokenKinds(text, [TokenKind.Done]).length === 0;
        if (isDoneKind) {
            tokenKinds.push(TokenKind.Done);
        }
        // Priority
        const isPriorityKind =
            !this.hasTokenKinds(textToTheLeft, [
                TokenKind.ContextTag,
                TokenKind.Date,
                TokenKind.Priority,
                TokenKind.ProjectTag,
                TokenKind.SpecialTag
            ])
            && this.findTokenKinds(text, [TokenKind.Priority]).length === 0;
        if (isPriorityKind) {
            tokenKinds.push(TokenKind.Priority);
        }
        // Date
        const isDateKind =
            !this.hasTokenKinds(textToTheLeft, [
                TokenKind.Date,
                TokenKind.Description,
                TokenKind.ProjectTag,
                TokenKind.ContextTag,
                TokenKind.SpecialTag
            ])
            && !this.hasTokenKinds(textToTheRight, [
                TokenKind.Done,
                TokenKind.Priority,
            ])
            && this.findTokenKinds(text, [TokenKind.Date]).length <= 1;
        if (isDateKind) {
            tokenKinds.push(TokenKind.Date);
        }

        return tokenKinds;
    }

    private hasTokenKinds(text: string, toMatch: TokenKind[]): boolean {
        const matches = this.findTokenKinds(text, toMatch);
        return matches.length !== 0;
    }

    private findTokenKinds(text: string, toMatch: TokenKind[]): TokenKind[] {
        const currentTokens = this.breakIntoTokens(text);
        const matches = currentTokens
            .filter(token => {
                const tokenMatches = toMatch.filter(tokenToMatch => token === tokenToMatch);
                return tokenMatches.length > 0;
            });
        return matches;
    }

    private breakIntoTokens(text: string): TokenKind[] {
        const tokenKinds: TokenKind[] = []
        text.match(AppConstants.DONE_REGEX)?.forEach(() => tokenKinds.push(TokenKind.Done))
        text.match(AppConstants.PRIORITY_REGEX)?.forEach(() => tokenKinds.push(TokenKind.Priority))
        text.match(AppConstants.DATE_REGEX)?.forEach(() => tokenKinds.push(TokenKind.Date))
        text.match(AppConstants.CONTEXT_REGEX)?.forEach(() => tokenKinds.push(TokenKind.ContextTag))
        text.match(AppConstants.PROJECT_REGEX)?.forEach(() => tokenKinds.push(TokenKind.ProjectTag))
        return tokenKinds;
    }

    private dateTokenFromDate(milis: number): string {
        const date = new Date(milis);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`
    }

    private buildABC(startChar: string, endChar: string) {
        const result = [];
        for (let i = startChar.charCodeAt(0); i <= endChar.charCodeAt(0); i++) {
            result.push(`(${String.fromCharCode(i)}) `);
        }
        return result;
    }
}