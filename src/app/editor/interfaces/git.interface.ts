export class GitStatus {
    constructor(unStaged = [], staged = []) {
        this.unStaged = unStaged;
        this.staged = staged;
    }

    unStaged: string[];
    staged: string[];
}