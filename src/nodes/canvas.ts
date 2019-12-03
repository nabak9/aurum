import { AurumElement, AurumElementProps } from './aurum_element';
import { StringSource, Callback } from '../utilities/common';

export interface CanvasProps extends AurumElementProps {
	onAttach?: Callback<Canvas>;
	onDetach?: Callback<Canvas>;
	onCreate?: Callback<Canvas>;
	onDispose?: Callback<Canvas>;
	width?: StringSource;
	height?: StringSource;
}

export class Canvas extends AurumElement {
	public readonly node: HTMLCanvasElement;

	constructor(props: CanvasProps) {
		super(props, 'canvas');
		this.bindProps(['width', 'height'], props);
	}
}