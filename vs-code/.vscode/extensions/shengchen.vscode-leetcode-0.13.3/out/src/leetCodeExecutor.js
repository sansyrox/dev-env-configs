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
const fse = require("fs-extra");
const path = require("path");
const requireFromString = require("require-from-string");
const vscode_1 = require("vscode");
const shared_1 = require("./shared");
const cpUtils_1 = require("./utils/cpUtils");
const problemUtils_1 = require("./utils/problemUtils");
const uiUtils_1 = require("./utils/uiUtils");
const wsl = require("./utils/wslUtils");
const wslUtils_1 = require("./utils/wslUtils");
class LeetCodeExecutor {
    constructor() {
        this.leetCodeRootPath = path.join(__dirname, "..", "..", "node_modules", "vsc-leetcode-cli");
        this.leetCodeRootPathInWsl = "";
        this.nodeExecutable = this.getNodePath();
        this.configurationChangeListener = vscode_1.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration("leetcode.nodePath")) {
                this.nodeExecutable = this.getNodePath();
            }
        }, this);
    }
    getLeetCodeRootPath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (wsl.useWsl()) {
                if (!this.leetCodeRootPathInWsl) {
                    this.leetCodeRootPathInWsl = `${yield wsl.toWslPath(this.leetCodeRootPath)}`;
                }
                return `${this.leetCodeRootPathInWsl}`;
            }
            return `${this.leetCodeRootPath}`;
        });
    }
    getLeetCodeBinaryPath() {
        return __awaiter(this, void 0, void 0, function* () {
            return `"${path.join(yield this.getLeetCodeRootPath(), "bin", "leetcode")}"`;
        });
    }
    meetRequirements() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.nodeExecutable !== "node") {
                if (!(yield fse.pathExists(this.nodeExecutable))) {
                    throw new Error(`The Node.js executable does not exist on path ${this.nodeExecutable}`);
                }
                if (wslUtils_1.useWsl()) {
                    this.nodeExecutable = yield wslUtils_1.toWslPath(this.nodeExecutable);
                }
            }
            try {
                yield this.executeCommandEx(this.nodeExecutable, ["-v"]);
            }
            catch (error) {
                const choice = yield vscode_1.window.showErrorMessage("LeetCode extension needs Node.js installed in environment path", uiUtils_1.DialogOptions.open);
                if (choice === uiUtils_1.DialogOptions.open) {
                    uiUtils_1.openUrl("https://nodejs.org");
                }
                return false;
            }
            for (const plugin of shared_1.supportedPlugins) {
                try { // Check plugin
                    yield this.executeCommandEx(this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "plugin", "-e", plugin]);
                }
                catch (error) { // Download plugin and activate
                    yield this.executeCommandEx(this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "plugin", "-i", plugin]);
                }
            }
            return true;
        });
    }
    deleteCache() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.executeCommandEx(this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "cache", "-d"]);
        });
    }
    getUserInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.executeCommandEx(this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "user"]);
        });
    }
    signOut() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield yield this.executeCommandEx(this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "user", "-L"]);
        });
    }
    listProblems(showLocked) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.executeCommandEx(this.nodeExecutable, showLocked ?
                [yield this.getLeetCodeBinaryPath(), "list"] :
                [yield this.getLeetCodeBinaryPath(), "list", "-q", "L"]);
        });
    }
    showProblem(problemNode, language, outDir) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileName = problemUtils_1.genFileName(problemNode, language);
            const filePath = path.join(outDir, fileName);
            if (!(yield fse.pathExists(filePath))) {
                const codeTemplate = yield this.executeCommandWithProgressEx("Fetching problem data...", this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "show", problemNode.id, "-cx", "-l", language]);
                yield fse.writeFile(filePath, codeTemplate);
            }
            return filePath;
        });
    }
    showSolution(problemNode, language) {
        return __awaiter(this, void 0, void 0, function* () {
            const solution = yield this.executeCommandWithProgressEx("Fetching top voted solution from discussions...", this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "show", problemNode.id, "--solution", "-l", language]);
            return solution;
        });
    }
    getDescription(problemNode) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.executeCommandWithProgressEx("Fetching problem description...", this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "show", problemNode.id, "-x"]);
        });
    }
    listSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.executeCommandEx(this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "session"]);
        });
    }
    enableSession(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.executeCommandEx(this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "session", "-e", name]);
        });
    }
    createSession(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.executeCommandEx(this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "session", "-c", name]);
        });
    }
    submitSolution(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.executeCommandWithProgressEx("Submitting to LeetCode...", this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "submit", `"${filePath}"`]);
            }
            catch (error) {
                if (error.result) {
                    return error.result;
                }
                throw error;
            }
        });
    }
    testSolution(filePath, testString) {
        return __awaiter(this, void 0, void 0, function* () {
            if (testString) {
                return yield this.executeCommandWithProgressEx("Submitting to LeetCode...", this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "test", `"${filePath}"`, "-t", `${testString}`]);
            }
            return yield this.executeCommandWithProgressEx("Submitting to LeetCode...", this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "test", `"${filePath}"`]);
        });
    }
    switchEndpoint(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (endpoint) {
                case shared_1.Endpoint.LeetCodeCN:
                    return yield this.executeCommandEx(this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "plugin", "-e", "leetcode.cn"]);
                case shared_1.Endpoint.LeetCode:
                default:
                    return yield this.executeCommandEx(this.nodeExecutable, [yield this.getLeetCodeBinaryPath(), "plugin", "-d", "leetcode.cn"]);
            }
        });
    }
    getCompaniesAndTags() {
        return __awaiter(this, void 0, void 0, function* () {
            // preprocess the plugin source
            const companiesTagsPath = path.join(yield exports.leetCodeExecutor.getLeetCodeRootPath(), "lib", "plugins", "company.js");
            const companiesTagsSrc = (yield fse.readFile(companiesTagsPath, "utf8")).replace("module.exports = plugin", "module.exports = { COMPONIES, TAGS }");
            const { COMPONIES, TAGS } = requireFromString(companiesTagsSrc, companiesTagsPath);
            return { companies: COMPONIES, tags: TAGS };
        });
    }
    get node() {
        return this.nodeExecutable;
    }
    dispose() {
        this.configurationChangeListener.dispose();
    }
    getNodePath() {
        const extensionConfig = vscode_1.workspace.getConfiguration("leetcode", null);
        return extensionConfig.get("nodePath", "node" /* default value */);
    }
    executeCommandEx(command, args, options = { shell: true }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (wsl.useWsl()) {
                return yield cpUtils_1.executeCommand("wsl", [command].concat(args), options);
            }
            return yield cpUtils_1.executeCommand(command, args, options);
        });
    }
    executeCommandWithProgressEx(message, command, args, options = { shell: true }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (wsl.useWsl()) {
                return yield cpUtils_1.executeCommandWithProgress(message, "wsl", [command].concat(args), options);
            }
            return yield cpUtils_1.executeCommandWithProgress(message, command, args, options);
        });
    }
}
exports.leetCodeExecutor = new LeetCodeExecutor();
//# sourceMappingURL=leetCodeExecutor.js.map