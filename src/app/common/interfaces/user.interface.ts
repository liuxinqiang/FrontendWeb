export interface IUserAuthToken {
    gitMidea?: {
        token: string;
        id: number;
    };
}
export interface IUserInterface {
    avatar: null | 'string';
    createTime: string;
    email: string;
    isActive: boolean;
    lang: 'zh-CN' | 'en-GB';
    loginName: string;
    metaData: object;
    authTokens: IUserAuthToken;
    name: string;
    phone: string;
    rule: number;
    timezone: 'Asia/Shanghai';
    updateTime: string;
}
