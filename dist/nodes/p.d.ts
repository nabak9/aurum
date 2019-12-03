import { AurumElement, AurumElementProps } from './aurum_element';
import { Callback } from '../utilities/common';
export interface PProps extends AurumElementProps {
    onAttach?: Callback<P>;
    onDetach?: Callback<P>;
    onCreate?: Callback<P>;
    onDispose?: Callback<P>;
}
export declare class P extends AurumElement {
    node: HTMLParagraphElement;
    constructor(props: PProps);
}
//# sourceMappingURL=p.d.ts.map