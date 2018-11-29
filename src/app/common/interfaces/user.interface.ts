export interface IUserMetaData {
    gitMidea?: {
        token: string;
    };
}
export interface IUserInterface {
    avatar: null | 'string';
    createTime: string;
    email: string;
    isActive: boolean;
    lang: 'zh-CN' | 'en-GB';
    loginName: string;
    metaData: IUserMetaData;
    name: string;
    phone: string;
    rule: number;
    timezone: 'Asia/Shanghai';
    updateTime: string;
}
