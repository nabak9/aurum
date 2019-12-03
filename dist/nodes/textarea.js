import { AurumElement } from './aurum_element';
export class TextArea extends AurumElement {
    constructor(props) {
        var _a, _b, _c;
        super(props, 'textArea');
        if (props.inputValueSource) {
            this.node.value = (_b = (_a = props.initialValue, (_a !== null && _a !== void 0 ? _a : props.inputValueSource.value)), (_b !== null && _b !== void 0 ? _b : ''));
            props.inputValueSource.unique().listen((value) => (this.node.value = value), this.cancellationToken);
        }
        else {
            this.node.value = (_c = props.initialValue, (_c !== null && _c !== void 0 ? _c : ''));
        }
        this.bindProps(['placeholder', 'readonly', 'disabled', 'rows', 'wrap', 'autocomplete', 'autofocus', 'max', 'maxLength', 'min', 'minLength', 'required', 'type'], props);
        this.createEventHandlers(['input', 'change'], props);
        if (props.inputValueSource) {
            this.onInput.map((p) => this.node.value).pipe(props.inputValueSource);
        }
    }
}
//# sourceMappingURL=textarea.js.map