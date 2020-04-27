import { AurumElement, ChildNode, AurumElementProps } from './special/aurum_element';
import { Callback, AttributeValue } from '../utilities/common';

export interface LabelProps extends AurumElementProps<HTMLLabelElement> {
	onAttach?: Callback<HTMLLabelElement>;
	onDetach?: Callback<HTMLLabelElement>;
	onCreate?: Callback<HTMLLabelElement>;
	for?: AttributeValue;
}

/**
 * @internal
 */
export class Label extends AurumElement {
	public node: HTMLLabelElement;

	constructor(props: LabelProps, children: ChildNode[]) {
		super(props, children, 'label');
		if (props !== null) {
			this.bindProps(['for'], props);
		}
	}
}
