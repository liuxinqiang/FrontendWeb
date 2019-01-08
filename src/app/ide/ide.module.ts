import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IdeRouterComponents, IdeRouterModule} from './ide-router.module';
import {AsyncDbService} from './services/async-db.service';

@NgModule({
    declarations: [
        ...IdeRouterComponents,
    ],
    imports: [
        CommonModule,
        IdeRouterModule,
    ],
    providers: [
        AsyncDbService,
    ],
})
export class IdeModule {
}
