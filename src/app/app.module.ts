import {BrowserModule, Title} from '@angular/platform-browser';
import {ErrorHandler, LOCALE_ID, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {TransferHttpCacheModule} from '@nguniversal/common';
import {AppRouteComponents, AppRouterModule} from './app-router.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ErrorsHandler} from './common/handlers/errors-handler';
import {HttpCustomInterceptor} from './common/interceptors/http-custom.interceptor';
import localeZhHans from '@angular/common/locales/zh-Hans';
import {registerLocaleData} from '@angular/common';

registerLocaleData(localeZhHans, 'zh-Hans');

@NgModule({
    declarations: [
        AppComponent,
        ...AppRouteComponents,
    ],
    imports: [
        BrowserModule.withServerTransition({appId: 'my-app'}),
        AppRouterModule,
        TransferHttpCacheModule,
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
