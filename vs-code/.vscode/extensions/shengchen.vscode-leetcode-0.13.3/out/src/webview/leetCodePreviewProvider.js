"use strict";
// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const leetCodeExecutor_1 = require("../leetCodeExecutor");
class LeetCodePreviewProvider {
    initialize(context) {
        this.context = context;
    }
    preview(node) {
        return __awaiter(this, void 0, void 0, function* () {
            this.node = node;
            if (!this.panel) {
                this.panel = vscode_1.window.createWebviewPanel("leetcode.preview", "Preview Problem", vscode_1.ViewColumn.Active, {
                    enableScripts: true,
                    enableCommandUris: true,
                    enableFindWidget: true,
                    retainContextWhenHidden: true,
                });
                this.panel.webview.onDidReceiveMessage((message) => __awaiter(this, void 0, void 0, function* () {
                    switch (message.command) {
                        case "ShowProblem":
                            yield vscode_1.commands.executeCommand("leetcode.showProblem", this.node);
                            this.dispose();
                            return;
                    }
                }), this, this.context.subscriptions);
                this.panel.onDidDispose(() => {
                    this.panel = undefined;
                }, null, this.context.subscriptions);
            }
            this.panel.webview.html = yield this.provideHtmlContent(node);
            this.panel.title = `${node.name}: Preview`;
            this.panel.reveal();
        });
    }
    dispose() {
        if (this.panel) {
            this.panel.dispose();
        }
    }
    provideHtmlContent(node) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.renderHTML(node);
        });
    }
    renderHTML(node) {
        return __awaiter(this, void 0, void 0, function* () {
            const description = yield leetCodeExecutor_1.leetCodeExecutor.getDescription(node);
            const descriptionHTML = description.replace(/\n/g, "<br>");
            const htmlTemplate = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Preview Problem</title>
            </head>
            <style>
                #solve {
                    position: fixed;
                    bottom: 1rem;
                    right: 1rem;
                    border: 0;
                    margin: 1rem 0;
                    padding: 0.2rem 1rem;
                    color: white;
                    background-color: var(--vscode-button-background);
                }
                #solve:hover {
                    background-color: var(--vscode-button-hoverBackground);
                }
                #solve:active {
                    border: 0;
                }
            </style>
            <body>
                <div >
                    ${descriptionHTML}
                </div>
                <button id="solve">Code Now</button>
                <script>
                    (function() {
                        const vscode = acquireVsCodeApi();
                        let button = document.getElementById('solve');
                        button.onclick = solveHandler;
                        function solveHandler() {
                            vscode.postMessage({
                                command: 'ShowProblem',
                            });
                        }
                    }());
                </script>
            </body>
        </html>
        `;
            return htmlTemplate;
        });
    }
}
exports.leetCodePreviewProvider = new LeetCodePreviewProvider();
//# sourceMappingURL=leetCodePreviewProvider.js.map