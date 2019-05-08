"use strict";
// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const shared_1 = require("../shared");
function genFileExt(language) {
    const ext = shared_1.langExt.get(language);
    if (!ext) {
        throw new Error(`The language "${language}" is not supported.`);
    }
    return ext;
}
exports.genFileExt = genFileExt;
function genFileName(node, language) {
    const slug = _.kebabCase(node.name);
    const ext = genFileExt(language);
    return `${node.id}.${slug}.${ext}`;
}
exports.genFileName = genFileName;
//# sourceMappingURL=problemUtils.js.map