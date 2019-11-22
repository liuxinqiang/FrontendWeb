import {BrowserModule, Title} from '@angular/platform-browser';
import {ErrorHandler, LOCALE_ID, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppRouteComponents, AppRouterModule} from './app-router.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ErrorsHandler} from './common/handlers/errors-handler';
import {HttpCustomInterceptor} from './common/interceptors/http-custom.interceptor';
import localeZhHans from '@angular/common/locales/zh-hans';
import {registerLocaleData} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

registerLocaleData(localeZhHans, 'zh-Hans');

@NgModule({
    declarations: [
        AppComponent,
        ...AppRouteComponents,
    ],
    imports: [
        BrowserModule.withServerTransition({appId: 'my-app'}),
        BrowserAnimationsModule,
        AppRouterModule,
        HttpClientModule,
    ],
    providers: [
        Title,
        {
            provide: ErrorHandler,
            useClass: ErrorsHandler,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpCustomInterceptor,
            multi: true,
        },
        {
            provide: LOCALE_ID,
            useValue: 'zh-Hans',

        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
