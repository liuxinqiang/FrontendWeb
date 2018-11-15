import { Component, OnInit } from '@angular/core';
import {ComponentsService} from '../services/components.service';
import {DataFilter, IResponseInterface} from '../../common/interfaces/response.interface';
import {IComponentInterface} from '../interfaces/component.interface';

@Component({
  selector: 'app-public-components',
  templateUrl: './public-components.component.html',
  styleUrls: ['./public-components.component.less']
})
export class PublicComponentsComponent implements OnInit {

    dataList: IComponentInterface[];

    dataFilter: DataFilter;

    constructor(
        private _componentsService: ComponentsService,
    ) {
    }

    getComponents(dataFilter = new DataFilter(1, 12)) {
        this._componentsService.getAllPublicComponentsList(dataFilter)
            .subscribe((res: IResponseInterface) => {
                this.dataList = res.data;
                this.dataFilter = res.dataFilter;
            });
    }

    ngOnInit() {
        this.getComponents();

    }

}
