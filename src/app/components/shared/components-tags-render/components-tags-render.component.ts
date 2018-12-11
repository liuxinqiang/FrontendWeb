import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ITag, ITagSimple} from '../../interfaces/tag.interface';
import {MarkTreeBaseOnSelected} from '../../../common/methods/tree';
import {TagsService} from '../../services/tags.service';

@Component({
    selector: 'app-components-tags-render',
    templateUrl: './components-tags-render.component.html',
    styleUrls: ['./components-tags-render.component.less']
})
export class ComponentsTagsRenderComponent implements OnInit, OnChanges {
    @Input() tags: ITag[] = [];

    @Input() parentId = -1;

    @Input() styClass = 'ui-nav ui-nav-default';

    @Input() selectMode: 'none' | 'single' | 'multiple' = 'none';

    @Input() editorMode = false;

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

    constructor(
        private _tagsService: TagsService,
    ) {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.selectedTags) {
            this.tags = MarkTreeBaseOnSelected(Array.from(this.tags), 'selected', true, false, 'id', this.selectedTags);
        }
    }

    addAction(parentTag: ITag) {
        const newTag: ITag = {
            name: '',
            editing: true,
        };
        if (parentTag) {
            newTag.parentId = parentTag.id;
            parentTag.children.push(newTag);
        } else {
            if (this.parentId !== -1) {
                newTag.parentId = this.parentId;
            }
            this.tags.push(newTag);
        }
    }

    add(tag: ITag) {
        this._tagsService.addTag(tag.name, tag.parentId)
            .subscribe(data => {
                tag.id = data.id;
                tag.children = [];
                delete tag.editing;
                tag.selected = false;
            });
    }

}
