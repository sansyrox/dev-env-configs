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
const vscode = require("vscode");
const codeLensProvider_1 = require("./codeLensProvider");
const cache = require("./commands/cache");
const language_1 = require("./commands/language");
const plugin = require("./commands/plugin");
const session = require("./commands/session");
const show = require("./commands/show");
const submit = require("./commands/submit");
const test = require("./commands/test");
const LeetCodeTreeDataProvider_1 = require("./explorer/LeetCodeTreeDataProvider");
const leetCodeChannel_1 = require("./leetCodeChannel");
const leetCodeExecutor_1 = require("./leetCodeExecutor");
const leetCodeManager_1 = require("./leetCodeManager");
const leetCodeStatusBarController_1 = require("./statusbar/leetCodeStatusBarController");
const uiUtils_1 = require("./utils/uiUtils");
const leetCodePreviewProvider_1 = require("./webview/leetCodePreviewProvider");
const leetCodeResultProvider_1 = require("./webview/leetCodeResultProvider");
const leetCodeSolutionProvider_1 = require("./webview/leetCodeSolutionProvider");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!(yield leetCodeExecutor_1.leetCodeExecutor.meetRequirements())) {
                throw new Error("The environment doesn't meet requirements.");
            }
            leetCodeManager_1.leetCodeManager.on("statusChanged", () => {
                leetCodeStatusBarController_1.leetCodeStatusBarController.updateStatusBar(leetCodeManager_1.leetCodeManager.getStatus(), leetCodeManager_1.leetCodeManager.getUser());
                leetCodeTreeDataProvider.refresh();
            });
            const leetCodeTreeDataProvider = new LeetCodeTreeDataProvider_1.LeetCodeTreeDataProvider(context);
            leetCodePreviewProvider_1.leetCodePreviewProvider.initialize(context);
            leetCodeResultProvider_1.leetCodeResultProvider.initialize(context);
            leetCodeSolutionProvider_1.leetCodeSolutionProvider.initialize(context);
            context.subscriptions.push(leetCodeStatusBarController_1.leetCodeStatusBarController, leetCodeChannel_1.leetCodeChannel, leetCodePreviewProvider_1.leetCodePreviewProvider, leetCodeResultProvider_1.leetCodeResultProvider, leetCodeSolutionProvider_1.leetCodeSolutionProvider, leetCodeExecutor_1.leetCodeExecutor, vscode.window.createTreeView("leetCodeExplorer", { treeDataProvider: leetCodeTreeDataProvider, showCollapseAll: true }), vscode.languages.registerCodeLensProvider({ scheme: "file" }, codeLensProvider_1.codeLensProvider), vscode.commands.registerCommand("leetcode.deleteCache", () => cache.deleteCache()), vscode.commands.registerCommand("leetcode.toggleLeetCodeCn", () => plugin.switchEndpoint()), vscode.commands.registerCommand("leetcode.signin", () => leetCodeManager_1.leetCodeManager.signIn()), vscode.commands.registerCommand("leetcode.signout", () => leetCodeManager_1.leetCodeManager.signOut()), vscode.commands.registerCommand("leetcode.selectSessions", () => session.selectSession()), vscode.commands.registerCommand("leetcode.createSession", () => session.createSession()), vscode.commands.registerCommand("leetcode.previewProblem", (node) => leetCodePreviewProvider_1.leetCodePreviewProvider.preview(node)), vscode.commands.registerCommand("leetcode.showProblem", (node) => show.showProblem(node)), vscode.commands.registerCommand("leetcode.searchProblem", () => show.searchProblem()), vscode.commands.registerCommand("leetcode.showSolution", (node) => show.showSolution(node)), vscode.commands.registerCommand("leetcode.refreshExplorer", () => leetCodeTreeDataProvider.refresh()), vscode.commands.registerCommand("leetcode.testSolution", (uri) => test.testSolution(uri)), vscode.commands.registerCommand("leetcode.submitSolution", (uri) => submit.submitSolution(uri)), vscode.commands.registerCommand("leetcode.switchDefaultLanguage", () => language_1.switchDefaultLanguage()));
            yield leetCodeExecutor_1.leetCodeExecutor.switchEndpoint(plugin.getLeetCodeEndpoint());
            leetCodeManager_1.leetCodeManager.getLoginStatus();
        }
        catch (error) {
            leetCodeChannel_1.leetCodeChannel.appendLine(error.toString());
            uiUtils_1.promptForOpenOutputChannel("Extension initialization failed. Please open output channel for details.", uiUtils_1.DialogType.error);
        }
    });
}
exports.activate = activate;
function deactivate() {
    // Do nothing.
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map