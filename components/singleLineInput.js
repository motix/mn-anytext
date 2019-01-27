import { Schema } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
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
            props.state = SingleLineInputState.create({ value: props.value, plugins: plugins });
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