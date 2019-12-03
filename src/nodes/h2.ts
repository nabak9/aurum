import { AurumElement, AurumElementProps } from './aurum_element';
import { Callback } from '../utilities/common';

export interface H2Props extends AurumElementProps {
	onAttach?: Callback<H2>;
	onDetach?: Callback<H2>;
	onCreate?: Callback<H2>;
	onDispose?: Callback<H2>;
}

export class H2 extends AurumElement {
	constructor(props: H2Props) {
		super(props, 'h2');
	}
}