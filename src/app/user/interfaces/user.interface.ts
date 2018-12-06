export interface IUserAuthToken {
    gitMidea?: {
        token: string;
        id: number;
    };
}

export interface IUserInterface {
    loginName: string;
    name: string;
    avatar: string;
    email: string;
    authTokens: IUserAuthToken;
    createTime?: string;
    updateTime?: string;
    timezone?: string;
    lang?: string;
    metaData?: object;
    rule?: number;
    password?: string;
}

export interface IIdentityInterface {
    provider: string;
    extern_uid: string;
}

export interface IUserInfoInterface {
    name: string;
    username: string;
    loginName: string;
    id: number;
    state: string;
    avatar_url: string;
    web_url: string;
    created_at: Date;
    bio: string;
    location: string;
    skype: string;
    linkedin: string;
    twitter: string;
    website_url: string;
    organization: string;
    last_sign_in_at: Date;
    confirmed_at: Date;
    last_activity_on: string;
    email: string;
    color_scheme_id: number;
    projects_limit: number;
    current_sign_in_at: Date;
    identities: IIdentityInterface[];
    can_create_group: boolean;
    can_create_project: boolean;
    two_factor_enabled: boolean;
    external: boolean;
}
