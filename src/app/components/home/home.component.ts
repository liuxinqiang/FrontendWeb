import {Component} from '@angular/core';
import {ITag} from '../interfaces/tag.interface';
import {TagsService} from '../services/tags.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less']
})
export class HomeComponent {
    tags: ITag[];

    constructor(
        public tagsService: TagsService,
    ) {}

    selectedChange(e) {
        console.log('选择变化');
        console.log(e);
    }
}
