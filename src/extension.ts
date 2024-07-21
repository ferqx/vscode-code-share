import * as vscode from 'vscode';

import { CodeMarketProvider } from './codeMarketView';
import { SavedCodeProvider, SavedCodeItem } from './savedCodeView';

export function activate(context: vscode.ExtensionContext) {
  const codeMarketProvider = new CodeMarketProvider();
  const savedCodeProvider = new SavedCodeProvider(context);

  vscode.window.registerTreeDataProvider('codeMarketView', codeMarketProvider);
  vscode.window.registerTreeDataProvider('savedCodeView', savedCodeProvider);

  const saveCodeCommand = vscode.commands.registerCommand(
    'extension.saveCode',
    () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const code = editor.document.getText(editor.selection);
        if (code) {
          const label = `Saved Code ${new Date().toLocaleString()}`;
          const item: SavedCodeItem = { label, content: code };
          savedCodeProvider.addSavedCode(item);
          vscode.window.showInformationMessage('Code saved successfully!');
        } else {
          vscode.window.showWarningMessage('No code selected to save.');
        }
      } else {
        vscode.window.showWarningMessage('No active editor.');
      }
    }
  );

  const showItemCommand = vscode.commands.registerCommand(
    'codeMarketView.showItem',
    async (item: any) => {
      const doc = await vscode.workspace.openTextDocument({
        content: item.content,
        language: 'javascript' // 根据需要设置代码语言
      });
      const editor = await vscode.window.showTextDocument(doc, {
        preview: false
      });

      // 设置为只读
      const editOptions = { undoStopAfter: false, undoStopBefore: false };
      await editor.edit(
        (editBuilder) =>
          editBuilder.delete(
            new vscode.Range(
              new vscode.Position(0, 0),
              new vscode.Position(doc.lineCount + 1, 0)
            )
          ),
        editOptions
      );
      await editor.edit(
        (editBuilder) =>
          editBuilder.insert(new vscode.Position(0, 0), item.content),
        editOptions
      );
    }
  );

  const publishCodeCommand = vscode.commands.registerCommand(
    'savedCodeView.publishCode',
    (item: SavedCodeItem) => {
      // 发布代码逻辑，比如将代码添加到市场中
      vscode.window.showInformationMessage(`Published code: ${item.label}`);
    }
  );

  const refreshMarketCommand = vscode.commands.registerCommand(
    'extension.refreshMarket',
    () => {
      codeMarketProvider.refresh();
      vscode.window.showInformationMessage('Code market refreshed!');
    }
  );

  const addCodeToSavedCommand = vscode.commands.registerCommand(
    'extension.addCodeToSaved',
    () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const code = editor.document.getText(editor.selection);
        if (code) {
          const label = `Saved Code ${new Date().toLocaleString()}`;
          const item: SavedCodeItem = { label, content: code };
          savedCodeProvider.addSavedCode(item);
          vscode.window.showInformationMessage(
            'Code added to saved codes successfully!'
          );
        } else {
          vscode.window.showWarningMessage('No code selected to save.');
        }
      } else {
        vscode.window.showWarningMessage('No active editor.');
      }
    }
  );

  let currentValue = '';
  const myScheme = 'cowsay';
  const myProvider = new (class implements vscode.TextDocumentContentProvider {
    // emitter and its event
    onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
    onDidChange = this.onDidChangeEmitter.event;

    provideTextDocumentContent(uri: vscode.Uri): vscode.ProviderResult<string> {
      // 提供虚拟文档的内容
      return currentValue;
    }
  })();

  context.subscriptions.push(
    vscode.workspace.registerTextDocumentContentProvider(myScheme, myProvider)
  );

  const editSavedCodeCommand = vscode.commands.registerCommand(
    'savedCodeView.editCode',
    async (item: SavedCodeItem) => {
      currentValue = item.content;
      const uri = vscode.Uri.parse(`${myScheme}:${item.label}.vue`); // 生成虚拟文档的 URI
      const doc = await vscode.workspace.openTextDocument(uri);
      const editor = await vscode.window.showTextDocument(doc, {
        preview: false
      });
    }
  );

  context.subscriptions.push(saveCodeCommand);
  context.subscriptions.push(showItemCommand);
  context.subscriptions.push(publishCodeCommand);
  context.subscriptions.push(refreshMarketCommand);
  context.subscriptions.push(addCodeToSavedCommand);
  context.subscriptions.push(editSavedCodeCommand);
}
