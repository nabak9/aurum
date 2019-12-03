import { AurumElement, AurumElementProps } from './aurum_element';
import { Callback } from '../utilities/common';
export interface DivProps extends AurumElementProps {
    onAttach?: Callback<Div>;
    onDetach?: Callback<Div>;
    onCreate?: Callback<Div>;
    onDispose?: Callback<Div>;
}
export declare class Div extends AurumElement {
    readonly node: HTMLDivElement;
    constructor(props: DivProps);
}
//# sourceMappingURL=div.d.ts.map