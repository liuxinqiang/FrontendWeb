import {Component, OnInit} from '@angular/core';
import {ITag} from '../interfaces/tag.interface';
import {TagsService} from '../services/tags.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
    tags: ITag[];

    constructor(
        private _tagsService: TagsService,
    ) {}

    ngOnInit() {
        this._tagsService.getTags()
            .subscribe(data => {
                this.tags = data;
            });
    }

}
