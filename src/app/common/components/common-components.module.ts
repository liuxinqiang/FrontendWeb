import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { HeaderbarComponent } from './headerbar/headerbar.component';
import {MainMenuComponent} from './main-menu/main-menu.component';
import { SearchComponent } from './main-menu/search/search.component';
import {RouterModule} from '@angular/router';
import { NumberToArrayPipe } from './number-to-array.pipe';
import { PaginationComponent } from './pagination/pagination.component';
import { MathCeilPipe } from './math-ceil.pipe';

@NgModule({
    declarations: [
        MainMenuComponent,
        HeaderbarComponent,
        SearchComponent,
        NumberToArrayPipe,
        PaginationComponent,
        MathCeilPipe,
    ],
    imports: [
        CommonModule,
        RouterModule,
    ],
    exports: [
        HeaderbarComponent,
        PaginationComponent,
        NumberToArrayPipe,
    ]
})
export class CommonComponentsModule {
}
