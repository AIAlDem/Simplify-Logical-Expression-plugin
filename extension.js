// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

const vscode = require('vscode');
const {
    parseExpression,
    simplifyNode,
    nodeToExpression
} = require('./logic.js');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * Активирует расширение VS Code и регистрирует команду упрощения
 * логического выражения.
 * 
 * @param {vscode.ExtensionContext} context Контекст расширения
 * @returns {void}
 */
function activate(context) {

	const command = vscode.commands.registerCommand(
		"plugin.helloWorld",
		function () {
			const editor = vscode.window.activeTextEditor;

			if(!editor) {
				vscode.window.showWarningMessage('Open the C++ editor');
				return;
			}

			const selection = editor.selection;
			if(selection.isEmpty) {
				vscode.window.showWarningMessage('Select the logical expression');
				return;
			}

			const expression = editor.document.getText(selection);

			const result = parseExpression(expression);

			if (!result.ok) {
				vscode.window.showWarningMessage('Selection text is not a logical expression');
				return;
			}

			const simplifierNode = simplifyNode(result.node);
			const simplifiedExpression = nodeToExpression(simplifierNode);

			editor.edit(function editBuilder(editBuilder) {
				editBuilder.replace(selection, simplifiedExpression);
			})
		}
	);

	context.subscriptions.push(command);
}

// This method is called when your extension is deactivated
/**
 * Деактивирует расширение
 * 
 * @returns {void}
 */
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
