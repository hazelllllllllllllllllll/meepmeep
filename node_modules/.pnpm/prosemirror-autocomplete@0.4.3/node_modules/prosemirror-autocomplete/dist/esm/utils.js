import { PluginKey } from 'prosemirror-state';
export const pluginKey = new PluginKey('autocomplete');
export function inSuggestion(selection, decorations) {
    return decorations.find(selection.from, selection.to).length > 0;
}
//# sourceMappingURL=utils.js.map