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
const os = require("os");
const path = require("path");
const vscode = require("vscode");
const wsl = require("./wslUtils");
function selectWorkspaceFolder() {
    return __awaiter(this, void 0, void 0, function* () {
        let folder;
        if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
            if (vscode.workspace.workspaceFolders.length > 1) {
                folder = yield vscode.window.showWorkspaceFolderPick({
                    placeHolder: "Select the working directory you wish to use",
                });
            }
            else {
                folder = vscode.workspace.workspaceFolders[0];
            }
        }
        const workFolder = folder ? folder.uri.fsPath : path.join(os.homedir(), ".leetcode");
        return wsl.useWsl() ? wsl.toWslPath(workFolder) : workFolder;
    });
}
exports.selectWorkspaceFolder = selectWorkspaceFolder;
function getActiveFilePath(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        let textEditor;
        if (uri) {
            textEditor = yield vscode.window.showTextDocument(uri, { preview: false });
        }
        else {
            textEditor = vscode.window.activeTextEditor;
        }
        if (!textEditor) {
            return undefined;
        }
        if (textEditor.document.isDirty && !(yield textEditor.document.save())) {
            vscode.window.showWarningMessage("Please save the solution file first.");
            return undefined;
        }
        return wsl.useWsl() ? wsl.toWslPath(textEditor.document.uri.fsPath) : textEditor.document.uri.fsPath;
    });
}
exports.getActiveFilePath = getActiveFilePath;
function getWorkspaceConfiguration() {
    return vscode.workspace.getConfiguration("leetcode");
}
exports.getWorkspaceConfiguration = getWorkspaceConfiguration;
//# sourceMappingURL=workspaceUtils.js.map