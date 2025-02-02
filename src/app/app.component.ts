import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {filter, map, mergeMap} from 'rxjs/internal/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styles: []
})
export class AppComponent implements OnInit {
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private titleService: Title
    ) {
    }

    ngOnInit(): void {
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                map(() => this.activatedRoute),
                map((route) => {
                    while (route.firstChild) { route = route.firstChild; }
                    return route;
                }),
                filter((route) => route.outlet === 'primary'),
                mergeMap((route) => route.data)
            )
            .subscribe((event) => this.titleService.setTitle(event['title']));
    }
}
