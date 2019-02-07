import { Schema } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Decoration, DecorationSet } from 'prosemirror-view';
import placeholder from '../plugins/placeholder';

export class SingleLineInputSchema extends Schema {
    constructor(spec) {
        const defaultSpec = {
            nodes: {
                doc: { content: 'div' },
                div: {
                    content: 'text*',
                    parseDOM: [{ tag: 'div' }],
                    toDOM() { return ['div', 0]; }
                },
                text: {}
            }
        };
        spec = {
            ...defaultSpec,
            ...spec
        };

        super(spec);
    }
}

export class SingleLineInputState extends EditorState {
    static create(config) {
        config.schema = config.schema ||
            (config.doc ? config.doc.schema : new SingleLineInputSchema());

        config.doc = config.doc ||
            config.schema.node('doc', null, [config.schema.node('div', null, config.value ? [config.schema.text(config.value)] : [])]);

        return super.create(config);
    }
}

export class SingleLineInputView extends EditorView {
    constructor(place, props) {
        if (!props.state) {
            const plugins = [
                placeholder(props.placeholder || {})
            ];

            const decorations = function ({ doc }) {
                const decorations = [];

                if (props.prefix) {
                    const decoration = Decoration.node(0, doc.firstChild.nodeSize, {
                        'data-prefix-text': props.prefix
                    });
                    decorations.push(decoration);
                }

                if (props.suffix) {
                    const decoration = Decoration.node(0, doc.firstChild.nodeSize, {
                        'data-suffix-text': props.suffix
                    });
                    decorations.push(decoration);
                }

                return DecorationSet.create(doc, decorations);
            };

            props.state = SingleLineInputState.create({ value: props.value, plugins: plugins });
            props.decorations = decorations;
        }

        super(place, props);
    }

    updateValue(value) {
        const tr = this.state.tr;
        tr.doc.descendants((node, pos) => {
            if (node.isTextblock) {
                tr.insertText(value, pos + 1, pos + 1 + node.content.size);
            }
        });
        this.dispatch(tr);
    }

    dispatch(tr) {
        super.dispatch(tr);

        if (tr.docChanged && this.props.onChange) {
            this.props.onChange.bind(this)(this, tr);
        }
    }
}

export class SingleLineInput {
    constructor(place, props) {
        props.value = typeof props.value === 'undefined' || props.value === null ? '' : String(props.value);
        props.wrapping = typeof props.wrapping === 'undefined' || props.wrapping === null ? true : props.wrapping;

        if (props.placeholder) {
            for (let i in props.placeholder) {
                if (typeof props.placeholder[i] === 'undefined' || props.placeholder[i] === null) {
                    delete props.placeholder[i];
                }
            }
        }

        this.view = new SingleLineInputView(place, props);

        const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if (props.wrapping) {
            this.view.dom.style.whiteSpace = isFirefox ? 'pre-wrap' : null;
        } else {
            this.view.dom.style.whiteSpace = isFirefox ? 'pre' : 'nowrap';
        }
    }

    get value() {
        return this.view.state.doc.textContent;
    }

    set value(value) {
        value = typeof value === 'undefined' || value === null ? '' : String(value);
        if (value !== this.value) {
            this.view.updateValue(value);
        }
    }
}