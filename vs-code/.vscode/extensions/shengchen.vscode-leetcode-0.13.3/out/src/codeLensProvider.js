"use strict";
// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class CodeLensProvider {
    constructor() {
        this.validFileNamePattern = /\d+\..*\.(.+)/;
    }
    provideCodeLenses(document) {
        const fileName = document.fileName.trim();
        const matchResult = fileName.match(this.validFileNamePattern);
        if (!matchResult) {
            return undefined;
        }
        const range = new vscode.Range(document.lineCount - 1, 0, document.lineCount - 1, 0);
        const lens = new vscode.CodeLens(range, {
            title: "🙏 Submit to LeetCode",
            command: "leetcode.submitSolution",
        });
        return [lens];
    }
}
exports.codeLensProvider = new CodeLensProvider();
//# sourceMappingURL=codeLensProvider.js.map