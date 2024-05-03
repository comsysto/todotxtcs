# todotxt README

Support for todo.txt format with code completion and auto-timestamping.

A full example of a todo item looks like this.
(B) 2024-05-02 Lorem ipsum dolor sit amet, consetetur sadipscing elitr +bar +blub @foo @maier 

And here is the same item, marked as done.
x (B) 2024-05-02 Lorem ipsum dolor sit amet, consetetur sadipscing elitr +bar +blub @foo @maier 

The most simple todo item would look like this.
say hello

Code completion is currently available for the token kinds Done, Priority,
Creation- & Completion-Date, while the dates support auto-timestamping.

The general format of Todo.txt is like this, with [<>] being optional tokens.
[<completion>] [<priority>] [<completion_date>] [<creation_date>] <description> [<project_tags>] [<context_tags>] [<special_key_value_tags>]
So in general only the <description> is obligatory.

# How to use
1. Navigate to a new line.
2. If you want to create a priority or a timestamp, bring up IntelliSense and choose from (A) to (D) or the current date.
Note that you can have 2 dates. By todo.txt convention, the left is the completion and the right the creation date.
(B) 2024-05-03
3. Provide a description for your todo.
(B) 2024-05-03 my todo
4. If you want to tag your todo item, you can do so by providing a context and/ or project tag with + and @
(B) 2024-05-03 my todo +projectA @ContextZ
5. As soon as you want to mark a todo item as done, just preceed the line with an 'x '
And you guessed it: there is IntellySense for 'x '
x (B) 2024-05-03 my todo +projectA @ContextZ

## Features

Syntax Highlighting
\!\[syntax highlighting\]\(assets/images/syntax_highlighting.png\)

IntelliSense
\!\[intelli sense 1\]\(assets/images/intelli_sense_01.png\)
\!\[intelli sense 2\]\(assets/images/intelli_sense_02.png\)

Timestamps
\!\[timestamps\]\(assets/images/timestamp.png\)

## Release Notes

### 0.0.1

Initial release of the extension as .vsix file

**⊂(◉‿◉)つ**
