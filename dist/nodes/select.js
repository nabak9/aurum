import { AurumElement } from './aurum_element';
const selectEvents = { change: 'onChange' };
export class Select extends AurumElement {
    constructor(props) {
        var _a;
        super(props, 'select');
        if (props !== null) {
            this.createEventHandlers(selectEvents, props);
            this.initialSelection = props.initialSelection;
            if (props.selectedIndexSource) {
                this.selectedIndexSource = props.selectedIndexSource;
                props.selectedIndexSource.unique().listenAndRepeat((value) => (this.node.selectedIndex = value), this.cancellationToken);
            }
            else {
                this.node.selectedIndex = (_a = props.initialSelection, (_a !== null && _a !== void 0 ? _a : -1));
            }
            if (props.selectedIndexSource) {
                this.needAttach = true;
                this.node.addEventListener('change', () => {
                    props.selectedIndexSource.update(this.node.selectedIndex);
                });
            }
        }
    }
    handleAttach(parent) {
        super.handleAttach(parent);
        if (this.node.isConnected) {
            if (this.selectedIndexSource) {
                this.node.selectedIndex = this.selectedIndexSource.value;
            }
            else if (this.initialSelection !== undefined) {
                this.node.selectedIndex = this.initialSelection;
            }
        }
    }
}
//# sourceMappingURL=select.js.map