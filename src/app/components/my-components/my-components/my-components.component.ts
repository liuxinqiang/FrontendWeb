import {Component, OnInit} from '@angular/core';
import {DataFilter, IResponseInterface} from '../../../common/interfaces/response.interface';
import {ComponentsService} from '../../services/components.service';

@Component({
    selector: 'app-my-components',
    templateUrl: './my-components.component.html',
    styleUrls: ['./my-components.component.less']
})
export class MyComponentsComponent implements OnInit {

    dataList: any[];

    dataFilter: DataFilter;

    constructor(
        private _componentsService: ComponentsService,
    ) {
    }

    getComponents(dataFilter = new DataFilter(1, 12)) {
        this._componentsService.getComponentsListByUser(dataFilter)
            .subscribe((res: IResponseInterface) => {
                this.dataList = res.data;
                this.dataFilter = res.dataFilter;
            }, error => {
                console.log('get error....');
            });
    }

    ngOnInit() {
        this.getComponents();

    }
}
