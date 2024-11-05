// main.ts
import { Plugin, WorkspaceLeaf } from 'obsidian';

export default class ExplorerPlugin extends Plugin {
	async onload() {
		const style = document.createElement('style');
		style.id = 'explorer-plugin-style';
		style.textContent = `
            .workspace-tab-header-container {
                display: none !important;
            }
        `;
		document.head.appendChild(style);

		this.addRibbonIcon('folder', 'Toggle File Explorer', () => {
			this.toggleView('file-explorer');
		});

		this.addRibbonIcon('search', 'Toggle Search', () => {
			this.toggleView('search');
		});

		this.addRibbonIcon('bookmark', 'Toggle Bookmarks', () => {
			this.toggleView('bookmarks');
		});
	}

	private isViewActive(viewType: string): boolean {
		const leaves = this.app.workspace.getLeavesOfType(viewType);
		return leaves.length > 0 && leaves.some(leaf => leaf.view.containerEl.isShown());
	}

	private toggleView(viewType: string) {
		// @ts-ignore
		const leftSplit = this.app.workspace.leftSplit;

		if (!leftSplit.collapsed && this.isViewActive(viewType)) {
			this.app.workspace.getLeavesOfType(viewType).forEach((leaf: WorkspaceLeaf) => {
				leaf.detach();
			});
			leftSplit.collapse();
		} else {
			[ 'file-explorer', 'search', 'bookmarks' ].forEach(type => {
				this.app.workspace.getLeavesOfType(type).forEach((leaf: WorkspaceLeaf) => {
					leaf.detach();
				});
			});

			if (leftSplit.collapsed) {
				leftSplit.expand();
			}

			const leaf = this.app.workspace.getLeftLeaf(false);
			leaf.setViewState({
				type: viewType,
				active: true
			});
		}
	}

	onunload() {
		const style = document.getElementById('explorer-plugin-style');
		if (style) style.remove();
	}
}
