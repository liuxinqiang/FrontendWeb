import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { HeaderbarComponent } from './headerbar/headerbar.component';
import {MainMenuComponent} from './main-menu/main-menu.component';
import { SearchComponent } from './main-menu/search/search.component';
import {RouterModule} from '@angular/router';
import { NumberToArrayPipe } from './number-to-array.pipe';
import { PaginationComponent } from './pagination/pagination.component';
import { MathCeilPipe } from './math-ceil.pipe';
import {ObjectFirstKeyPipe} from './object-first-key.pipe';
import { ReadableFileSizePipe } from './readable-file-size.pipe';

@NgModule({
    declarations: [
        MainMenuComponent,
        HeaderbarComponent,
        SearchComponent,
        NumberToArrayPipe,
        PaginationComponent,
        MathCeilPipe,
        ObjectFirstKeyPipe,
        ReadableFileSizePipe,
    ],
    imports: [
        CommonModule,
        RouterModule,
    ],
    exports: [
        HeaderbarComponent,
        PaginationComponent,
        NumberToArrayPipe,
        ObjectFirstKeyPipe,
        ReadableFileSizePipe,
    ]
})
export class CommonComponentsModule {
}
