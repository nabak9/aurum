import { AurumElement, AurumElementProps } from './aurum_element';
import { Callback } from '../utilities/common';

export interface H4Props extends AurumElementProps {
	onAttach?: Callback<H4>;
	onDetach?: Callback<H4>;
	onCreate?: Callback<H4>;
	onDispose?: Callback<H4>;
}

export class H4 extends AurumElement {
	constructor(props: H4Props) {
		super(props, 'h4');
	}
}