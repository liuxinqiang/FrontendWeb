import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from './not-found.component';
import {ErrorComponent} from './error.component';
import {AuthGuard} from './common/guards/auth.guard';

const mainRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'components',
    },
    {
        path: 'projects',
        loadChildren: './projects/projects.module#ProjectsModule',
        canActivate: [AuthGuard],
    },
    {
        path: 'components',
        loadChildren: './components/components.module#ComponentsModule',
        data: {
            mainMenu: {
                name: '组件库',
                path: '/components',
                rule: 0,
                children: [
                    {
                        name: '公有组件',
                        path: '/components/public',
                        rule: 0,
                    },
                    {
                        name: '我的组件',
                        path: '/components/my-components',
                        rule: 1,
                    },
                    {
                        name: '新建组件',
                        path: '/components/create-component',
                        rule: 1,
                    }
                ],
            },
        }
    },
    {
        path: 'user',
        loadChildren: './user/user.module#UserModule',
    },
    {
        path: 'error',
        component: ErrorComponent,
    },
    {
        path: '**',
        component: NotFoundComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(mainRoutes),
    ],
    exports: [
        RouterModule,
    ],
})
export class AppRouterModule {
}

export const AppRouteComponents = [
    ErrorComponent,
    NotFoundComponent,
];
