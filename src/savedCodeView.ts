import * as vscode from 'vscode';

export interface SavedCodeItem {
  label: string;
  content: string;
}

export class SavedCodeProvider
  implements vscode.TreeDataProvider<SavedCodeItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<SavedCodeItem | undefined> =
    new vscode.EventEmitter<SavedCodeItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<SavedCodeItem | undefined> =
    this._onDidChangeTreeData.event;

  private items: SavedCodeItem[];

  constructor(private context: vscode.ExtensionContext) {
    this.items = context.globalState.get<SavedCodeItem[]>('savedCodes', []);
  }

  refresh(): void {
    this.items = this.context.globalState.get<SavedCodeItem[]>(
      'savedCodes',
      []
    );
    this._onDidChangeTreeData.fire(undefined);
  }

  addSavedCode(item: SavedCodeItem): void {
    this.items.push(item);
    this.context.globalState.update('savedCodes', this.items);
    this.refresh();
  }

  updateSavedCode(label: string, newContent: string): void {
    const item = this.items.find((i) => i.label === label);
    if (item) {
      item.content = newContent;
      this.context.globalState.update('savedCodes', this.items);
      this.refresh();
    }
  }

  getTreeItem(element: SavedCodeItem): vscode.TreeItem {
    const treeItem = new vscode.TreeItem(
      element.label,
      vscode.TreeItemCollapsibleState.None
    );
    treeItem.contextValue = 'savedCode';
    // tooltip html
    treeItem.tooltip = new vscode.MarkdownString(
      `**${element.label}**\n\n${element.content}`
    );
    return treeItem;
  }

  getChildren(element?: SavedCodeItem): Thenable<SavedCodeItem[]> {
    if (element) {
      return Promise.resolve([]);
    } else {
      return Promise.resolve(this.items);
    }
  }
}
