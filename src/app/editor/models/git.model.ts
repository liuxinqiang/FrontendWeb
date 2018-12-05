export class GitStatus {
    constructor(unStaged = [], staged = []) {
        this.unStaged = unStaged;
        this.staged = staged;
    }
    unStaged: string[];
    staged: string[];
}

export class GitAsyncStatus {
    constructor(toPull = [], toPush = []) {
        this.toPull = toPull;
        this.toPush = toPush;
    }
    toPull: GitCommit[];
    toPush: GitCommit[];
}

export class GitCommit {
    constructor(id, name, email, message, time) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.message = message;
        this.time = time;
    }
    id: string;
    name: string;
    email: string;
    message: string;
    time: string;
}
