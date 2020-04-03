import { AttributeValue, Callback, DataDrain } from '../utilities/common';
import { AurumElement, AurumElementProps, ChildNode } from './special/aurum_element';
import { DataSource } from '../stream/data_source';
import { DuplexDataSource } from '../stream/duplex_data_source';
export interface InputProps extends AurumElementProps {
    onAttach?: Callback<HTMLInputElement>;
    onDetach?: Callback<HTMLInputElement>;
    onCreate?: Callback<HTMLInputElement>;
    placeholder?: AttributeValue;
    readonly?: AttributeValue;
    disabled?: AttributeValue;
    onChange?: DataDrain<InputEvent>;
    onInput?: DataDrain<InputEvent>;
    value?: DataSource<string> | DuplexDataSource<string> | string;
    accept?: AttributeValue;
    alt?: AttributeValue;
    autocomplete?: AttributeValue;
    autofocus?: AttributeValue;
    checked?: DataSource<boolean> | DuplexDataSource<boolean> | boolean;
    defaultChecked?: AttributeValue;
    formAction?: AttributeValue;
    formEnctype?: AttributeValue;
    formMethod?: AttributeValue;
    formNoValidate?: AttributeValue;
    formTarget?: AttributeValue;
    max?: AttributeValue;
    maxLength?: AttributeValue;
    min?: AttributeValue;
    minLength?: AttributeValue;
    pattern?: AttributeValue;
    multiple?: AttributeValue;
    required?: AttributeValue;
    type?: AttributeValue;
}
export declare class Input extends AurumElement {
    node: HTMLInputElement;
    constructor(props: InputProps, children: ChildNode[]);
}
//# sourceMappingURL=input.d.ts.map