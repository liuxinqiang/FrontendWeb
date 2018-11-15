import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataFilter} from 'app/common/interfaces/response.interface';

@Component({
    selector: 'app-common-pagination',
    templateUrl: './pagination.component.html',
    styles: []
})
export class PaginationComponent implements OnInit {
    @Input() dataFilter: DataFilter;
    @Output() changed: EventEmitter<DataFilter> = new EventEmitter();

    change(newIndex: number) {
        this.dataFilter.pageIndex = newIndex;
        this.changed.emit(this.dataFilter);
    }

    ngOnInit() {
    }

}
