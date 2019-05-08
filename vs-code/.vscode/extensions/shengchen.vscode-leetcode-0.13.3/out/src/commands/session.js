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
const leetCodeExecutor_1 = require("../leetCodeExecutor");
const leetCodeManager_1 = require("../leetCodeManager");
const uiUtils_1 = require("../utils/uiUtils");
function getSessionList() {
    return __awaiter(this, void 0, void 0, function* () {
        const signInStatus = leetCodeManager_1.leetCodeManager.getUser();
        if (!signInStatus) {
            uiUtils_1.promptForSignIn();
            return [];
        }
        const result = yield leetCodeExecutor_1.leetCodeExecutor.listSessions();
        const lines = result.split("\n");
        const sessions = [];
        const reg = /(.?)\s*(\d+)\s+(.*)\s+(\d+ \(\s*\d+\.\d+ %\))\s+(\d+ \(\s*\d+\.\d+ %\))/;
        for (const line of lines) {
            const match = line.match(reg);
            if (match && match.length === 6) {
                sessions.push({
                    active: !!(match[1].trim()),
                    id: match[2].trim(),
                    name: match[3].trim(),
                    acQuestions: match[4].trim(),
                    acSubmits: match[5].trim(),
                });
            }
        }
        return sessions;
    });
}
exports.getSessionList = getSessionList;
function selectSession() {
    return __awaiter(this, void 0, void 0, function* () {
        const choice = yield vscode.window.showQuickPick(parseSessionsToPicks());
        if (!choice || choice.description === "Active") {
            return;
        }
        if (choice.value === ":createNewSession") {
            yield vscode.commands.executeCommand("leetcode.createSession");
            return;
        }
        try {
            yield leetCodeExecutor_1.leetCodeExecutor.enableSession(choice.value);
            vscode.window.showInformationMessage(`Successfully switched to session '${choice.label}'.`);
            yield vscode.commands.executeCommand("leetcode.refreshExplorer");
        }
        catch (error) {
            yield uiUtils_1.promptForOpenOutputChannel("Failed to switch session. Please open the output channel for details.", uiUtils_1.DialogType.error);
        }
    });
}
exports.selectSession = selectSession;
function parseSessionsToPicks() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            try {
                const sessions = yield getSessionList();
                const picks = sessions.map((s) => Object.assign({}, {
                    label: `${s.active ? "$(check) " : ""}${s.name}`,
                    description: s.active ? "Active" : "",
                    detail: `AC Questions: ${s.acQuestions}, AC Submits: ${s.acSubmits}`,
                    value: s.id,
                }));
                picks.push({
                    label: "$(plus) Create a new session",
                    description: "",
                    detail: "Click this item to create a new session",
                    value: ":createNewSession",
                });
                resolve(picks);
            }
            catch (error) {
                return yield uiUtils_1.promptForOpenOutputChannel("Failed to list sessions. Please open the output channel for details.", uiUtils_1.DialogType.error);
            }
        }));
    });
}
function createSession() {
    return __awaiter(this, void 0, void 0, function* () {
        const session = yield vscode.window.showInputBox({
            prompt: "Enter the new session name.",
            validateInput: (s) => s && s.trim() ? undefined : "Session name must not be empty",
        });
        if (!session) {
            return;
        }
        try {
            yield leetCodeExecutor_1.leetCodeExecutor.createSession(session);
            vscode.window.showInformationMessage("New session created, you can switch to it by clicking the status bar.");
        }
        catch (error) {
            yield uiUtils_1.promptForOpenOutputChannel("Failed to create session. Please open the output channel for details.", uiUtils_1.DialogType.error);
        }
    });
}
exports.createSession = createSession;
//# sourceMappingURL=session.js.map