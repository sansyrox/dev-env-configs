"use strict";
// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const hljs = require("highlight.js");
const MarkdownIt = require("markdown-it");
const os = require("os");
const path = require("path");
const vscode = require("vscode");
const leetCodeChannel_1 = require("../leetCodeChannel");
class MarkdownEngine {
    constructor() {
        this.engine = this.initEngine();
        this.extRoot = path.join(vscode.env.appRoot, "extensions", "markdown-language-features");
    }
    get localResourceRoots() {
        return [vscode.Uri.file(path.join(this.extRoot, "media"))];
    }
    get styles() {
        try {
            const stylePaths = require(path.join(this.extRoot, "package.json"))["contributes"]["markdown.previewStyles"];
            return stylePaths.map((p) => vscode.Uri.file(path.join(this.extRoot, p)).with({ scheme: "vscode-resource" }));
        }
        catch (error) {
            leetCodeChannel_1.leetCodeChannel.appendLine("[Error] Fail to load built-in markdown style file.");
            return [];
        }
    }
    getStylesHTML() {
        return this.styles.map((style) => `<link rel="stylesheet" type="text/css" href="${style.toString()}">`).join(os.EOL);
    }
    render(md, env) {
        return this.engine.render(md, env);
    }
    initEngine() {
        const md = new MarkdownIt({
            linkify: true,
            typographer: true,
            highlight: (code, lang) => {
                switch (lang && lang.toLowerCase()) {
                    case "mysql":
                        lang = "sql";
                        break;
                    case "json5":
                        lang = "json";
                        break;
                    case "python3":
                        lang = "python";
                        break;
                }
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(lang, code, true).value;
                    }
                    catch (error) { /* do not highlight */ }
                }
                return ""; // use external default escaping
            },
        });
        this.addCodeBlockHighlight(md);
        this.addImageUrlCompletion(md);
        this.addLinkValidator(md);
        return md;
    }
    addCodeBlockHighlight(md) {
        const codeBlock = md.renderer.rules["code_block"];
        // tslint:disable-next-line:typedef
        md.renderer.rules["code_block"] = (tokens, idx, options, env, self) => {
            // if any token uses lang-specified code fence, then do not highlight code block
            if (tokens.some((token) => token.type === "fence")) {
                return codeBlock(tokens, idx, options, env, self);
            }
            // otherwise, highlight with default lang in env object.
            const highlighted = options.highlight(tokens[idx].content, env.lang);
            return [
                `<pre><code ${self.renderAttrs(tokens[idx])} >`,
                highlighted || md.utils.escapeHtml(tokens[idx].content),
                "</code></pre>",
            ].join(os.EOL);
        };
    }
    addImageUrlCompletion(md) {
        const image = md.renderer.rules["image"];
        // tslint:disable-next-line:typedef
        md.renderer.rules["image"] = (tokens, idx, options, env, self) => {
            const imageSrc = tokens[idx].attrs.find((value) => value[0] === "src");
            if (env.host && imageSrc && imageSrc[1].startsWith("/")) {
                imageSrc[1] = `${env.host}${imageSrc[1]}`;
            }
            return image(tokens, idx, options, env, self);
        };
    }
    addLinkValidator(md) {
        const validateLink = md.validateLink;
        md.validateLink = (link) => {
            // support file:// protocal link
            return validateLink(link) || link.startsWith("file:");
        };
    }
}
exports.markdownEngine = new MarkdownEngine();
//# sourceMappingURL=markdownEngine.js.map