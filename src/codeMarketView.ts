import * as vscode from 'vscode';

interface CodeItem {
  avatar: string;
  name: string;
  description: string;
  content: string; // 新增字段
}

export class CodeMarketProvider implements vscode.TreeDataProvider<CodeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<CodeItem | undefined> =
    new vscode.EventEmitter<CodeItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<CodeItem | undefined> =
    this._onDidChangeTreeData.event;

  private items: CodeItem[];

  constructor() {
    this.items = [
      {
        avatar: 'https://example.com/avatar1.png',
        name: 'Developer 1',
        description: 'Description of code 1',
        content: 'Code content 1'
      },
      {
        avatar: 'https://example.com/avatar2.png',
        name: 'Developer 2',
        description: 'Description of code 2',
        content: 'Code content 2'
      }
    ];
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: CodeItem): vscode.TreeItem {
    const treeItem = new vscode.TreeItem(element.name);
    treeItem.description = element.description;
    treeItem.tooltip = element.description;
    treeItem.iconPath = vscode.Uri.parse(element.avatar);
    treeItem.command = {
      command: 'codeMarketView.showItem',
      title: 'Show Item',
      arguments: [element]
    };
    return treeItem;
  }

  getChildren(element?: CodeItem): Thenable<CodeItem[]> {
    if (element) {
      return Promise.resolve([]);
    } else {
      return Promise.resolve(this.items);
    }
  }
}
