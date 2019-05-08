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
class LeetCodeSolutionProvider {
    initialize(context) {
        this.context = context;
    }
    show(solutionString, problem) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.panel) {
                this.panel = vscode_1.window.createWebviewPanel("leetCode.solution", "Top Voted Solution", vscode_1.ViewColumn.Active, {
                    retainContextWhenHidden: true,
                    enableFindWidget: true,
                    localResourceRoots: markdownEngine_1.markdownEngine.localResourceRoots,
                });
                this.panel.onDidDispose(() => {
                    this.panel = undefined;
                }, null, this.context.subscriptions);
            }
            const solution = this.parseSolution(solutionString);
            this.panel.title = `${problem.name}: Solution`;
            this.panel.webview.html = this.getWebViewContent(solution);
            this.panel.reveal(vscode_1.ViewColumn.Active);
        });
    }
    dispose() {
        if (this.panel) {
            this.panel.dispose();
        }
    }
    parseSolution(raw) {
        const solution = new Solution();
        // [^] matches everything including \n, yet can be replaced by . in ES2018's `m` flag
        raw = raw.slice(1); // skip first empty line
        [solution.title, raw] = raw.split(/\n\n([^]+)/); // parse title and skip one line
        [solution.url, raw] = raw.split(/\n\n([^]+)/); // parse url and skip one line
        [solution.lang, raw] = raw.match(/\* Lang:\s+(.+)\n([^]+)/).slice(1);
        [solution.author, raw] = raw.match(/\* Author:\s+(.+)\n([^]+)/).slice(1);
        [solution.votes, raw] = raw.match(/\* Votes:\s+(\d+)\n\n([^]+)/).slice(1);
        solution.body = raw;
        return solution;
    }
    getWebViewContent(solution) {
        const styles = markdownEngine_1.markdownEngine.getStylesHTML();
        const { title, url, lang, author, votes } = solution;
        const head = markdownEngine_1.markdownEngine.render(`# [${title}](${url})`);
        const auth = `[${author}](https://leetcode.com/${author}/)`;
        const info = markdownEngine_1.markdownEngine.render([
            `| Language |  Author  |  Votes   |`,
            `| :------: | :------: | :------: |`,
            `| ${lang}  | ${auth}  | ${votes} |`,
        ].join("\n"));
        const body = markdownEngine_1.markdownEngine.render(solution.body, {
            lang: solution.lang,
            host: "https://discuss.leetcode.com/",
        });
        return `
            <!DOCTYPE html>
            <html>
            <head>
                ${styles}
            </head>
            <body class="vscode-body 'scrollBeyondLastLine' 'wordWrap' 'showEditorSelection'" style="tab-size:4">
                ${head}
                ${info}
                ${body}
            </body>
            </html>
        `;
    }
}
// tslint:disable-next-line:max-classes-per-file
class Solution {
    constructor() {
        this.title = "";
        this.url = "";
        this.lang = "";
        this.author = "";
        this.votes = "";
        this.body = ""; // Markdown supported
    }
}
exports.leetCodeSolutionProvider = new LeetCodeSolutionProvider();
//# sourceMappingURL=leetCodeSolutionProvider.js.map