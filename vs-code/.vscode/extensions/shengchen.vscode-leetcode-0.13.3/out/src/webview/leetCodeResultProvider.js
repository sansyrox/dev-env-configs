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
const markdownEngine_1 = require("./markdownEngine");
class LeetCodeResultProvider {
    initialize(context) {
        this.context = context;
    }
    show(result) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.panel) {
                this.panel = vscode_1.window.createWebviewPanel("leetcode.result", "LeetCode Results", vscode_1.ViewColumn.Two, {
                    retainContextWhenHidden: true,
                    enableFindWidget: true,
                    localResourceRoots: markdownEngine_1.markdownEngine.localResourceRoots,
                });
                this.panel.onDidDispose(() => {
                    this.panel = undefined;
                }, null, this.context.subscriptions);
            }
            this.panel.webview.html = yield this.provideHtmlContent(result);
            this.panel.reveal(vscode_1.ViewColumn.Two);
        });
    }
    dispose() {
        if (this.panel) {
            this.panel.dispose();
        }
    }
    provideHtmlContent(result) {
        return __awaiter(this, void 0, void 0, function* () {
            return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                ${markdownEngine_1.markdownEngine.getStylesHTML()}
            </head>
            <body>
                <pre><code>${result.trim()}</code></pre>
            </body>
            </html>`;
        });
    }
}
exports.leetCodeResultProvider = new LeetCodeResultProvider();
//# sourceMappingURL=leetCodeResultProvider.js.map