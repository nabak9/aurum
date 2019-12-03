import { AurumElement, AurumElementProps } from './aurum_element';
import { Callback } from '../utilities/common';

export interface TbodyProps extends AurumElementProps {
	onAttach?: Callback<Tbody>;
	onDetach?: Callback<Tbody>;
	onCreate?: Callback<Tbody>;
	onDispose?: Callback<Tbody>;
}

export class Tbody extends AurumElement {
	constructor(props: TbodyProps) {
		super(props, 'tbody');
	}
}