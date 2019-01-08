import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './common/guards/auth.guard';
import {ErrorComponent} from './error/error.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {HomeComponent} from './home/home.component';

const mainRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: HomeComponent,
        data: {
            title: '首页',
        },
    },
    {
        path: 'projects',
        loadChildren: './projects/projects.module#ProjectsModule',
        canActivate: [AuthGuard],
        data: {
            title: '项目中心',
            mainMenu: {
                name: '项目中心',
                path: '/projects',
                rule: 0,
            },
        },
    },
    {
        path: 'components',
        loadChildren: './components/components.module#ComponentsModule',
        data: {
            title: '组件库',
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
                        path: '/components/component-create',
                        rule: 1,
                    }
                ],
            },
        }
    },
    {
        path: 'user',
        loadChildren: './user/user.module#UserModule',
        data: {
            title: '用户中心',
        },
    },
    {
        path: 'ide',
        loadChildren: './ide/ide.module#IdeModule',
        canActivate: [AuthGuard],
        data: {
            title: '在线编辑器',
        },
    },
    {
        path: 'error',
        component: ErrorComponent,
        data: {
            title: '出错了',
        },
    },
    {
        path: '**',
        component: NotFoundComponent,
        data: {
            title: '页面未找到',
        },
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
    HomeComponent,
];
