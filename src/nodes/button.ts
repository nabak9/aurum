import { AurumElement, AurumElementProps } from './aurum_element';
import { StringSource } from '../utilities/common';

export interface ButtonProps extends AurumElementProps {
	disabled?: StringSource;
	onAttach?: (node: Button) => void;
	onDettach?: (node: Button) => void;
}

export class Button extends AurumElement {
	constructor(props: ButtonProps) {
		super(props, 'button');
		this.bindProps(['disabled'], props);
	}
}
