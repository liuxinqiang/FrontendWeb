import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {switchMap} from 'rxjs/internal/operators';
import {ComponentsService} from 'src/app/components/services/components.service';
import {IComponentInterface} from 'src/app/components/interfaces/component.interface';

@Component({
    selector: 'app-component-detail',
    templateUrl: './component-detail.component.html',
    styleUrls: ['./component-detail.component.less']
})
export class ComponentDetailComponent implements OnInit, OnDestroy {
    component: IComponentInterface;
    componentSubscription$: Subscription;
    constructor(
        private _route: ActivatedRoute,
        private _componentService: ComponentsService,
        public router: Router,
    ) {
    }

    ngOnInit() {
        this.componentSubscription$ = this._route.paramMap.pipe(
            switchMap(
                (params: ParamMap) => this._componentService.getComponent(params.get('componentName'))
            )
        )
            .subscribe(data => {
                this.component = data;
            });
    }
    ngOnDestroy() {
        this.componentSubscription$.unsubscribe();
    }
}
