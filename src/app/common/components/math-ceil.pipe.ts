import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'mathCeil',
    pure: true,
})
export class MathCeilPipe implements PipeTransform {

    transform(value: number[], type = 'ceil'): any {
        if (type === 'ceil') {
            return Math.ceil(value[0] / value[1]);
        }
        return 0;
    }

}
