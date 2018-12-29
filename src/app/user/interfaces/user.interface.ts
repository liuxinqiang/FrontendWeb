export interface IUserInterface {
    loginName?: string;
    name?: string;
    avatar?: string;
    email?: string;
    phone?: string;
    createTime?: string;
    updateTime?: string;
    timezone?: string;
    lang?: string;
    metaData?: object;
    rule?: number;
    password?: string;
    tokens?: {
        github?: string;
        mideaGit?: string;
    };
}
