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
const _ = require("lodash");
const os = require("os");
const path = require("path");
const vscode = require("vscode");
const list = require("../commands/list");
const leetCodeChannel_1 = require("../leetCodeChannel");
const leetCodeManager_1 = require("../leetCodeManager");
const shared_1 = require("../shared");
const workspaceUtils_1 = require("../utils/workspaceUtils");
const LeetCodeNode_1 = require("./LeetCodeNode");
class LeetCodeTreeDataProvider {
    constructor(context) {
        this.context = context;
        this.onDidChangeTreeDataEvent = new vscode.EventEmitter();
        // tslint:disable-next-line:member-ordering
        this.onDidChangeTreeData = this.onDidChangeTreeDataEvent.event;
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getProblemData();
            this.onDidChangeTreeDataEvent.fire();
        });
    }
    getTreeItem(element) {
        if (element.id === "notSignIn") {
            return {
                label: element.name,
                id: element.id,
                collapsibleState: vscode.TreeItemCollapsibleState.None,
                command: {
                    command: "leetcode.signin",
                    title: "Sign in to LeetCode",
                },
            };
        }
        const idPrefix = Date.now();
        return {
            label: element.isProblem ? `[${element.id}] ${element.name}` : element.name,
            tooltip: this.getSubCategoryTooltip(element),
            id: `${idPrefix}.${element.parentName}.${element.id}`,
            collapsibleState: element.isProblem ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Collapsed,
            contextValue: element.isProblem ? "problem" : element.id.toLowerCase(),
            iconPath: this.parseIconPathFromProblemState(element),
            command: element.isProblem ? element.previewCommand : undefined,
        };
    }
    getChildren(element) {
        if (!leetCodeManager_1.leetCodeManager.getUser()) {
            return [
                new LeetCodeNode_1.LeetCodeNode(Object.assign({}, shared_1.defaultProblem, {
                    id: "notSignIn",
                    name: "Sign in to LeetCode",
                }), "ROOT", false),
            ];
        }
        if (!element) { // Root view
            return [
                new LeetCodeNode_1.LeetCodeNode(Object.assign({}, shared_1.defaultProblem, {
                    id: shared_1.Category.Difficulty,
                    name: shared_1.Category.Difficulty,
                }), "ROOT", false),
                new LeetCodeNode_1.LeetCodeNode(Object.assign({}, shared_1.defaultProblem, {
                    id: shared_1.Category.Tag,
                    name: shared_1.Category.Tag,
                }), "ROOT", false),
                new LeetCodeNode_1.LeetCodeNode(Object.assign({}, shared_1.defaultProblem, {
                    id: shared_1.Category.Company,
                    name: shared_1.Category.Company,
                }), "ROOT", false),
                new LeetCodeNode_1.LeetCodeNode(Object.assign({}, shared_1.defaultProblem, {
                    id: shared_1.Category.Favorite,
                    name: shared_1.Category.Favorite,
                }), "ROOT", false),
            ];
        }
        else {
            switch (element.name) { // First-level
                case shared_1.Category.Favorite:
                    const nodes = this.treeData[shared_1.Category.Favorite];
                    return nodes.map((p) => new LeetCodeNode_1.LeetCodeNode(p, shared_1.Category.Favorite));
                case shared_1.Category.Difficulty:
                case shared_1.Category.Tag:
                case shared_1.Category.Company:
                    return this.composeSubCategoryNodes(element);
                default: // Second and lower levels
                    return element.isProblem ? [] : this.composeProblemNodes(element);
            }
        }
    }
    getProblemData() {
        return __awaiter(this, void 0, void 0, function* () {
            // clear cache
            this.treeData = {
                Difficulty: new Map(),
                Tag: new Map(),
                Company: new Map(),
                Favorite: [],
            };
            for (const problem of yield list.listProblems()) {
                // Add favorite problem, no matter whether it is solved.
                if (problem.isFavorite) {
                    this.treeData[shared_1.Category.Favorite].push(problem);
                }
                // Hide solved problem in other category.
                if (problem.state === shared_1.ProblemState.AC && workspaceUtils_1.getWorkspaceConfiguration().get("hideSolved")) {
                    continue;
                }
                this.addProblemToTreeData(problem);
            }
        });
    }
    composeProblemNodes(node) {
        const map = this.treeData[node.parentName];
        if (!map) {
            leetCodeChannel_1.leetCodeChannel.appendLine(`Category: ${node.parentName} is not available.`);
            return [];
        }
        const problems = map.get(node.name) || [];
        const problemNodes = [];
        for (const problem of problems) {
            problemNodes.push(new LeetCodeNode_1.LeetCodeNode(problem, node.name));
        }
        return problemNodes;
    }
    composeSubCategoryNodes(node) {
        const category = node.name;
        if (category === shared_1.Category.Favorite) {
            leetCodeChannel_1.leetCodeChannel.appendLine("No sub-level for Favorite nodes");
            return [];
        }
        const map = this.treeData[category];
        if (!map) {
            leetCodeChannel_1.leetCodeChannel.appendLine(`Category: ${category} is not available.`);
            return [];
        }
        return this.getSubCategoryNodes(map, category);
    }
    parseIconPathFromProblemState(element) {
        if (!element.isProblem) {
            return "";
        }
        switch (element.state) {
            case shared_1.ProblemState.AC:
                return this.context.asAbsolutePath(path.join("resources", "check.png"));
            case shared_1.ProblemState.NotAC:
                return this.context.asAbsolutePath(path.join("resources", "x.png"));
            case shared_1.ProblemState.Unknown:
                if (element.locked) {
                    return this.context.asAbsolutePath(path.join("resources", "lock.png"));
                }
                return this.context.asAbsolutePath(path.join("resources", "blank.png"));
            default:
                return "";
        }
    }
    getSubCategoryTooltip(element) {
        // return '' unless it is a sub-category node
        if (element.isProblem || !this.treeData[element.parentName]) {
            return "";
        }
        const problems = this.treeData[element.parentName].get(element.id);
        let acceptedNum = 0;
        let failedNum = 0;
        for (const prob of problems) {
            switch (prob.state) {
                case shared_1.ProblemState.AC:
                    acceptedNum++;
                    break;
                case shared_1.ProblemState.NotAC:
                    failedNum++;
                    break;
                default:
                    break;
            }
        }
        return [
            `AC: ${acceptedNum}`,
            `Failed: ${failedNum}`,
            `Total: ${problems.length}`,
        ].join(os.EOL);
    }
    addProblemToTreeData(problem) {
        this.putProblemToMap(this.treeData.Difficulty, problem.difficulty, problem);
        for (const tag of problem.tags) {
            this.putProblemToMap(this.treeData.Tag, _.startCase(tag), problem);
        }
        for (const company of problem.companies) {
            this.putProblemToMap(this.treeData.Company, _.startCase(company), problem);
        }
    }
    putProblemToMap(map, key, problem) {
        const problems = map.get(key);
        if (problems) {
            problems.push(problem);
        }
        else {
            map.set(key, [problem]);
        }
    }
    getSubCategoryNodes(map, category) {
        const subCategoryNodes = Array.from(map.keys()).map((subCategory) => {
            return new LeetCodeNode_1.LeetCodeNode(Object.assign({}, shared_1.defaultProblem, {
                id: subCategory,
                name: subCategory,
            }), category.toString(), false);
        });
        this.sortSubCategoryNodes(subCategoryNodes, category);
        return subCategoryNodes;
    }
    sortSubCategoryNodes(subCategoryNodes, category) {
        switch (category) {
            case shared_1.Category.Difficulty:
                subCategoryNodes.sort((a, b) => {
                    function getValue(input) {
                        switch (input.name.toLowerCase()) {
                            case "easy":
                                return 1;
                            case "medium":
                                return 2;
                            case "hard":
                                return 3;
                            default:
                                return Number.MAX_SAFE_INTEGER;
                        }
                    }
                    return getValue(a) - getValue(b);
                });
                break;
            case shared_1.Category.Tag:
            case shared_1.Category.Company:
                subCategoryNodes.sort((a, b) => {
                    if (a.name === "Unknown") {
                        return 1;
                    }
                    else if (b.name === "Unknown") {
                        return -1;
                    }
                    else {
                        return Number(a.name > b.name) - Number(a.name < b.name);
                    }
                });
                break;
            default:
                break;
        }
    }
}
exports.LeetCodeTreeDataProvider = LeetCodeTreeDataProvider;
//# sourceMappingURL=LeetCodeTreeDataProvider.js.map