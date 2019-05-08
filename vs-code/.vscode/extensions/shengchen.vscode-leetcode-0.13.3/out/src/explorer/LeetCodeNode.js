"use strict";
// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
class LeetCodeNode {
    constructor(data, parentNodeName, isProblemNode = true) {
        this.data = data;
        this.parentNodeName = parentNodeName;
        this.isProblemNode = isProblemNode;
    }
    get locked() {
        return this.data.locked;
    }
    get name() {
        return this.data.name;
    }
    get state() {
        return this.data.state;
    }
    get id() {
        return this.data.id;
    }
    get passRate() {
        return this.data.passRate;
    }
    get difficulty() {
        return this.data.difficulty;
    }
    get tags() {
        return this.data.tags;
    }
    get companies() {
        return this.data.companies;
    }
    get isFavorite() {
        return this.data.isFavorite;
    }
    get isProblem() {
        return this.isProblemNode;
    }
    get parentName() {
        return this.parentNodeName;
    }
    get previewCommand() {
        return {
            title: "Preview Problem",
            command: "leetcode.previewProblem",
            arguments: [this],
        };
    }
}
exports.LeetCodeNode = LeetCodeNode;
//# sourceMappingURL=LeetCodeNode.js.map