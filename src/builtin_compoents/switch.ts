import { AurumComponentAPI, AurumElementModel, aurumElementModelIdentitiy, Renderable } from '../rendering/aurum_element';
import { GenericDataSource } from '../stream/data_source';
import { CancellationToken } from '../utilities/cancellation_token';
import { dsUnique } from '../stream/data_source_operators';

export interface SwitchProps<T = boolean> {
	state: GenericDataSource<T>;
}

export function Switch<T = boolean>(props: SwitchProps<T>, children: Renderable[], api: AurumComponentAPI) {
	children = [].concat.apply(
		[],
		children.filter((c) => !!c)
	);
	if (
		children.some(
			(c) =>
				!c[aurumElementModelIdentitiy] ||
				!((c as AurumElementModel<any>).factory === SwitchCase || (c as AurumElementModel<any>).factory === DefaultSwitchCase)
		)
	) {
		throw new Error('Switch only accepts SwitchCase as children');
	}
	if (children.filter((c) => (c as AurumElementModel<any>).factory === DefaultSwitchCase).length > 1) {
		throw new Error('Too many default switch cases only 0 or 1 allowed');
	}

	const cleanUp = new CancellationToken();
	api.onDetach(() => {
		cleanUp.cancel();
	});

	const u = props.state.transform(dsUnique(), cleanUp);
	return u.withInitial(props.state.value).map((state) => selectCase(state, children as AurumElementModel<SwitchCaseProps<any>>[]));
}

function selectCase<T>(state: T, children: AurumElementModel<SwitchCaseProps<any>>[]) {
	return children.find((c) => c.props?.when === state)?.children ?? children.find((p) => p.factory === DefaultSwitchCase)?.children;
}

export interface SwitchCaseProps<T> {
	when: T;
}

export function SwitchCase<T>(props: SwitchCaseProps<T>, children): undefined {
	return undefined;
}

export function DefaultSwitchCase(props: {}, children): undefined {
	return undefined;
}
