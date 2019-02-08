import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

export default (options = {}) => {
    const defaultOptions = {
        emptyInputCssClass: 'empty-input',
        emptyInputText: '',
        align: 'left'
    };

    options = {
        ...defaultOptions,
        ...options
    };

    return new Plugin({
        props: {
            decorations({ doc }) {
                const decorations = [];

                if (doc.textContent === '' && doc.childCount <= 1 && doc.content.size <= 2) {
                    doc.descendants((node, pos) => {
                        const decoration = Decoration.node(pos, pos + node.nodeSize, {
                            class: options.emptyInputCssClass,
                            'data-empty-input-text': options.emptyInputText,
                            'data-empty-input-align': options.align
                        });
                        decorations.push(decoration);
                    });
                }

                return DecorationSet.create(doc, decorations);
            }
        }
    });
};