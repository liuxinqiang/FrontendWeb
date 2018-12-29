import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import * as jszip from 'jszip';
import {excludeMap} from './exclude-map';
import {ExcludeConfig} from './exclude-config';

function pageNumbers(count, current) {
    const shownPages = 3;
    const result = [];
    if (current > count - shownPages) {
        result.push(count - 2, count - 1, count);
    } else {
        result.push(current, current + 1, current + 2, '...', count);
    }
    return result;
}

@Component({
    selector: 'app-upload-zip-files',
    templateUrl: './upload-zip-files.component.html',
    styleUrls: ['./upload-zip-files.component.less']
})
export class UploadZipFilesComponent implements OnInit {

    @Output() complete: EventEmitter<any> = new EventEmitter();

    @ViewChild('inputFile') inputFile: ElementRef;

    @ViewChild('zipModal') zipModal: ElementRef;

    fileInfo = {
        name: '',
        size: 0,
        total: 0,
    };

    excludeConfig: ExcludeConfig[] = [];

    constructor() {
    }

    ngOnInit() {
    }

    getData(data: String[], pageIndex) {
        return data.slice((pageIndex - 1) * 16, pageIndex * 16);
    }

    getPagination(pageTotal, pageIndex) {
        return pageNumbers(pageTotal, pageIndex);
    }

    getFilesCount() {
        let total = this.fileInfo.total;
        this.excludeConfig.map(config => {
            if (!config.skip) {
                total = total - config.total;
            }
        });
        return total;
    }

    setExcludeConfig(fileNames) {
        const result = [];
        for (const rule in excludeMap) {
            if (excludeMap.hasOwnProperty(rule)) {
                const ruleMap = excludeMap[rule];
                const excludeConfig: ExcludeConfig = new ExcludeConfig(
                    ruleMap.name,
                    ruleMap.reg,
                    ruleMap.desc,
                    ruleMap.canConfig
                );
                result.push(excludeConfig);
            }
        }
        fileNames.forEach(f => {
            for (const ec of result) {
                if (ec.reg.test(f)) {
                    ec.total++;
                    ec.matchFiles.push(f);
                    break;
                }
            }
        });
        this.excludeConfig = result.filter((config: ExcludeConfig) => {
            if (config.total) {
                config.pageTotal = Math.ceil(config.total / 16);
            }
            return !!config.total;
        });
    }

    clearUploadFile() {
        const fileElement: HTMLInputElement = this.inputFile.nativeElement;
        fileElement.value = null;
    }

    async onUploadChange(event): Promise<void> {
        if (event.target.files && event.target.files.length) {
            const file: File = event.target.files[0];
            if (file.type !== 'application/zip') {
                TopUI.notification('只允许上传 zip 格式的文件', 'danger');
                return this.clearUploadFile();
            }
            this.fileInfo.name = file.name;
            this.fileInfo.size = file.size;
            const zip = new jszip();
            const data = await zip.loadAsync(file);
            TopUI.modal(this.zipModal.nativeElement).show();
            const {files} = data;
            const fileNames = Object.keys(files);
            this.fileInfo.total = fileNames.length;
            this.setExcludeConfig(fileNames);
            console.log(this.excludeConfig);
        }
    }

}
