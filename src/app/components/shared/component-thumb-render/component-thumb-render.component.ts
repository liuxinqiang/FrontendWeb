import {Component, Input, OnInit} from '@angular/core';
import {IComponentInterface} from '../../interfaces/component.interface';

@Component({
    selector: 'app-component-thumb-render',
    templateUrl: './component-thumb-render.component.html',
    styleUrls: ['./component-thumb-render.component.less']
})
export class ComponentThumbRenderComponent implements OnInit {

    @Input() component: IComponentInterface;

    constructor() {
    }

    ngOnInit() {
    }
}
