"use strict";
// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const shared_1 = require("../shared");
class LeetCodeStatusBarItem {
    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem();
        this.statusBarItem.command = "leetcode.selectSessions";
    }
    updateStatusBar(status, user) {
        switch (status) {
            case shared_1.UserStatus.SignedIn:
                this.statusBarItem.text = `LeetCode: ${user}`;
                this.statusBarItem.show();
                break;
            case shared_1.UserStatus.SignedOut:
            default:
                this.statusBarItem.hide();
                break;
        }
    }
    show() {
        this.statusBarItem.show();
    }
    hide() {
        this.statusBarItem.hide();
    }
    dispose() {
        this.statusBarItem.dispose();
    }
}
exports.LeetCodeStatusBarItem = LeetCodeStatusBarItem;
//# sourceMappingURL=LeetCodeStatusBarItem.js.map