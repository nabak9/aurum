import { AurumElement, AurumElementProps } from './aurum_element';
import { Callback } from '../utilities/common';

export interface HrProps extends AurumElementProps {
	onAttach?: Callback<Hr>;
	onDetach?: Callback<Hr>;
	onCreate?: Callback<Hr>;
	onDispose?: Callback<Hr>;
}

export class Hr extends AurumElement {
	public readonly node: HTMLHRElement;

	constructor(props: HrProps) {
		super(props, 'hr');
	}
}