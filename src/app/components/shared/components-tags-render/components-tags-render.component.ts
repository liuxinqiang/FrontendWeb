import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ITag, ITagSimple} from '../../interfaces/tag.interface';
import {MarkTreeBaseOnSelected} from '../../../common/methods/tree';

@Component({
    selector: 'app-components-tags-render',
    templateUrl: './components-tags-render.component.html',
    styleUrls: ['./components-tags-render.component.less']
})
export class ComponentsTagsRenderComponent implements OnInit, OnChanges {
    @Input() tags: ITag[] = [];

    @Input() styClass = 'ui-nav ui-nav-default';

    @Input() selectMode: 'none' | 'single' | 'multiple' = 'none';

    @Output() nodeClick: EventEmitter<ITag> = new EventEmitter();

    @Output() selectedChange: EventEmitter<ITagSimple[]> = new EventEmitter();

    @Input() selectedTags: ITagSimple[] = [];

    selectTagChange(tag: ITag) {
        let existSelectedTagId, existSelectedTagIndex;
        for (let i = 0; i < this.selectedTags.length; i++) {
            if (tag.id === this.selectedTags[i].id) {
                existSelectedTagId = tag.id;
                existSelectedTagIndex = i;
            }
        }
        // 取消选择
        if (!tag.selected && existSelectedTagIndex !== undefined) {
            this.selectedTags.splice(existSelectedTagIndex, 1);
        } else if (tag.selected && !existSelectedTagId) {
            // 添加选择
            this.selectedTags.push({
                id: tag.id,
                name: tag.name,
            });
        }
        this.selectedChange.emit(this.selectedTags);
    }

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
       if (changes.selectedTags) {
          this.tags = MarkTreeBaseOnSelected(Array.from(this.tags), 'selected', true, false, 'id', this.selectedTags);
       }
    }

}
