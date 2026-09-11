"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inSuggestion = exports.pluginKey = void 0;
const prosemirror_state_1 = require("prosemirror-state");
exports.pluginKey = new prosemirror_state_1.PluginKey('autocomplete');
function inSuggestion(selection, decorations) {
    return decorations.find(selection.from, selection.to).length > 0;
}
exports.inSuggestion = inSuggestion;
//# sourceMappingURL=utils.js.map