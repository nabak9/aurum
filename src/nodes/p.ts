import { AurumElement, AurumElementProps } from './aurum_element';
import { Callback } from '../utilities/common';

export interface PProps extends AurumElementProps {
	onAttach?: Callback<P>;
	onDetach?: Callback<P>;
	onCreate?: Callback<P>;
	onDispose?: Callback<P>;
}

export class P extends AurumElement {
	public node: HTMLParagraphElement;

	constructor(props: PProps) {
		super(props, 'p');
	}
}