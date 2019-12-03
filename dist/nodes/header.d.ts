import { AurumElement, AurumElementProps } from './aurum_element';
import { Callback } from '../utilities/common';
export interface HeaderProps extends AurumElementProps {
    onAttach?: Callback<Header>;
    onDetach?: Callback<Header>;
    onCreate?: Callback<Header>;
    onDispose?: Callback<Header>;
}
export declare class Header extends AurumElement {
    constructor(props: HeaderProps);
}
//# sourceMappingURL=header.d.ts.map