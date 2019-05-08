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
const cp = require("child_process");
const events_1 = require("events");
const vscode = require("vscode");
const leetCodeChannel_1 = require("./leetCodeChannel");
const leetCodeExecutor_1 = require("./leetCodeExecutor");
const shared_1 = require("./shared");
const cpUtils_1 = require("./utils/cpUtils");
const uiUtils_1 = require("./utils/uiUtils");
const wsl = require("./utils/wslUtils");
class LeetCodeManager extends events_1.EventEmitter {
    constructor() {
        super();
        this.currentUser = undefined;
        this.userStatus = shared_1.UserStatus.SignedOut;
    }
    getLoginStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield leetCodeExecutor_1.leetCodeExecutor.getUserInfo();
                this.currentUser = this.tryParseUserName(result);
                this.userStatus = shared_1.UserStatus.SignedIn;
            }
            catch (error) {
                this.currentUser = undefined;
                this.userStatus = shared_1.UserStatus.SignedOut;
            }
            finally {
                this.emit("statusChanged");
            }
        });
    }
    signIn() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userName = yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    let result = "";
                    const leetCodeBinaryPath = yield leetCodeExecutor_1.leetCodeExecutor.getLeetCodeBinaryPath();
                    const childProc = wsl.useWsl()
                        ? cp.spawn("wsl", [leetCodeExecutor_1.leetCodeExecutor.node, leetCodeBinaryPath, "user", "-l"], { shell: true })
                        : cp.spawn(leetCodeExecutor_1.leetCodeExecutor.node, [leetCodeBinaryPath, "user", "-l"], {
                            shell: true,
                            env: cpUtils_1.createEnvOption(),
                        });
                    childProc.stdout.on("data", (data) => {
                        data = data.toString();
                        result = result.concat(data);
                        leetCodeChannel_1.leetCodeChannel.append(data);
                    });
                    childProc.stderr.on("data", (data) => leetCodeChannel_1.leetCodeChannel.append(data.toString()));
                    childProc.on("error", reject);
                    const name = yield vscode.window.showInputBox({
                        prompt: "Enter user name.",
                        validateInput: (s) => s && s.trim() ? undefined : "User name must not be empty",
                    });
                    if (!name) {
                        childProc.kill();
                        return resolve(undefined);
                    }
                    childProc.stdin.write(`${name}\n`);
                    const pwd = yield vscode.window.showInputBox({
                        prompt: "Enter password.",
                        password: true,
                        validateInput: (s) => s ? undefined : "Password must not be empty",
                    });
                    if (!pwd) {
                        childProc.kill();
                        return resolve(undefined);
                    }
                    childProc.stdin.write(`${pwd}\n`);
                    childProc.stdin.end();
                    childProc.on("close", () => {
                        const match = result.match(/(?:.*) Successfully login as (.*)/i);
                        if (match && match[1]) {
                            resolve(match[1]);
                        }
                        else {
                            reject(new Error("Failed to sign in."));
                        }
                    });
                }));
                if (userName) {
                    vscode.window.showInformationMessage("Successfully signed in.");
                    this.currentUser = userName;
                    this.userStatus = shared_1.UserStatus.SignedIn;
                    this.emit("statusChanged");
                }
            }
            catch (error) {
                uiUtils_1.promptForOpenOutputChannel("Failed to sign in. Please open the output channel for details", uiUtils_1.DialogType.error);
            }
        });
    }
    signOut() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield leetCodeExecutor_1.leetCodeExecutor.signOut();
                vscode.window.showInformationMessage("Successfully signed out.");
                this.currentUser = undefined;
                this.userStatus = shared_1.UserStatus.SignedOut;
                this.emit("statusChanged");
            }
            catch (error) {
                // swallow the error when sign out.
            }
        });
    }
    getStatus() {
        return this.userStatus;
    }
    getUser() {
        return this.currentUser;
    }
    tryParseUserName(output) {
        const reg = /^\s*.\s*(.+?)\s*https:\/\/leetcode/m;
        const match = output.match(reg);
        if (match && match.length === 2) {
            return match[1].trim();
        }
        return "Unknown";
    }
}
exports.leetCodeManager = new LeetCodeManager();
//# sourceMappingURL=leetCodeManager.js.map