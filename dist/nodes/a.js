import { AurumElement } from './aurum_element';
export class A extends AurumElement {
    constructor(props) {
        super(props, 'a');
        this.bindProps(['href', 'target'], props);
    }
}
//# sourceMappingURL=a.js.map