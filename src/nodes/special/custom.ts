import { Callback, MapLike, AttributeValue } from '../../utilities/common';
import { AurumElement, AurumElementProps, ChildNode } from './aurum_element';

export interface CustomProps<T extends HTMLElement> extends AurumElementProps<T> {
	onAttach?: Callback<T>;
	onDetach?: Callback<T>;
	onCreate?: Callback<T>;

	attributes?: MapLike<AttributeValue>;
	tag: string;
}

export class Custom<T extends HTMLElement> extends AurumElement {
	public readonly node: T;

	constructor(props: CustomProps<T>, children: ChildNode[]) {
		super(props, children, props.tag);
		if (props.attributes) {
			if (props !== null) {
				this.bindProps(Object.keys(props.attributes), props.attributes);
			}
		}
	}
}
