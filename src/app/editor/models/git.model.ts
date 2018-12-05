export class GitStatus {
    constructor(unStaged = [], staged = []) {
        this.unStaged = unStaged;
        this.staged = staged;
    }
    unStaged: string[];
    staged: string[];
}

export interface ICommitDescription {
    id: string;
    message: string;
    author_name: string;
    author_email: string;
    authored_date: string;
    parent_ids: string[];
    metaData: {
        location: string;
        tree?: string;
    };
}

export class GitAsyncStatus {
    constructor(toPull = [], toPush = []) {
        this.toPull = toPull;
        this.toPush = toPush;
    }
    toPull: ICommitDescription[];
    toPush: ICommitDescription[];
}
