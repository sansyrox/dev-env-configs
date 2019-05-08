"use strict";
// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
var UserStatus;
(function (UserStatus) {
    UserStatus[UserStatus["SignedIn"] = 1] = "SignedIn";
    UserStatus[UserStatus["SignedOut"] = 2] = "SignedOut";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
exports.languages = [
    "bash",
    "c",
    "cpp",
    "csharp",
    "golang",
    "java",
    "javascript",
    "kotlin",
    "mysql",
    "php",
    "python",
    "python3",
    "ruby",
    "rust",
    "scala",
    "swift",
];
exports.langExt = new Map([
    ["bash", "sh"],
    ["c", "c"],
    ["cpp", "cpp"],
    ["csharp", "cs"],
    ["golang", "go"],
    ["java", "java"],
    ["javascript", "js"],
    ["kotlin", "kt"],
    ["mysql", "sql"],
    ["php", "php"],
    ["python", "py"],
    ["python3", "py"],
    ["ruby", "rb"],
    ["rust", "rs"],
    ["scala", "scala"],
    ["swift", "swift"],
]);
var ProblemState;
(function (ProblemState) {
    ProblemState[ProblemState["AC"] = 1] = "AC";
    ProblemState[ProblemState["NotAC"] = 2] = "NotAC";
    ProblemState[ProblemState["Unknown"] = 3] = "Unknown";
})(ProblemState = exports.ProblemState || (exports.ProblemState = {}));
var Endpoint;
(function (Endpoint) {
    Endpoint["LeetCode"] = "leetcode";
    Endpoint["LeetCodeCN"] = "leetcode-cn";
})(Endpoint = exports.Endpoint || (exports.Endpoint = {}));
exports.defaultProblem = {
    isFavorite: false,
    locked: false,
    state: ProblemState.Unknown,
    id: "",
    name: "",
    difficulty: "",
    passRate: "",
    companies: [],
    tags: [],
};
var Category;
(function (Category) {
    Category["Difficulty"] = "Difficulty";
    Category["Tag"] = "Tag";
    Category["Company"] = "Company";
    Category["Favorite"] = "Favorite";
})(Category = exports.Category || (exports.Category = {}));
exports.supportedPlugins = [
    "company",
    "solution.discuss",
    "leetcode.cn",
];
//# sourceMappingURL=shared.js.map