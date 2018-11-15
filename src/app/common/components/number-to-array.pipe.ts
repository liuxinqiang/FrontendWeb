import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'numberToArray',
    pure: true,
})
export class NumberToArrayPipe implements PipeTransform {
    transform(value: any, startNum: string = '0'): any {
        const res = [];
        for (let i = Number(startNum); i <= value; i++) {
            res.push(i);
        }
        return res;
    }
}
