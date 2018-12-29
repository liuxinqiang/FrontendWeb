export class ExcludeConfig {
    constructor(name: string, reg: RegExp, desc: string, canConfig: boolean) {
        this.name = name;
        this.reg = reg;
        this.canConfig = canConfig;
        this.desc = desc;
    }

    name;
    reg;
    total = 0;
    pageIndex = 1;
    pageTotal = 0;
    skip = false;
    canConfig = true;
    desc = '';
    matchFiles: string[] = [];
}
