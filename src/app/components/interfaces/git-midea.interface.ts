export interface IGroup {
    id: number;
    name: string;
    path: string;
    description: string;
    visibility: string;
    lfs_enabled: boolean;
    avatar_url: string;
    web_url: string;
    request_access_enabled: boolean;
    full_name: string;
    full_path: string;
    parent_id?: any;
}

export interface IProjectLinks {
    self: string;
    issues: string;
    merge_requests: string;
    repo_branches: string;
    labels: string;
    events: string;
    members: string;
}

export interface IProjectNamespace {
    id: number;
    name: string;
    path: string;
    kind: string;
    full_path: string;
    parent_id?: any;
    members_count_with_descendants: number;
}

export interface IProject {
    id: number;
    description: string;
    default_branch: string;
    tag_list: any[];
    ssh_url_to_repo: string;
    http_url_to_repo: string;
    web_url: string;
    name: string;
    name_with_namespace: string;
    path: string;
    path_with_namespace: string;
    star_count: number;
    forks_count: number;
    created_at: Date;
    last_activity_at: Date;
    _links: IProjectLinks;
    archived: boolean;
    visibility: string;
    container_registry_enabled: boolean;
    issues_enabled: boolean;
    merge_requests_enabled: boolean;
    wiki_enabled: boolean;
    jobs_enabled: boolean;
    snippets_enabled: boolean;
    shared_runners_enabled: boolean;
    lfs_enabled: boolean;
    creator_id: number;
    namespace: IProjectNamespace;
    import_status: string;
    avatar_url?: any;
    open_issues_count: number;
    public_jobs: boolean;
    ci_config_path?: any;
    shared_with_groups: any[];
    only_allow_merge_if_pipeline_succeeds: boolean;
    request_access_enabled: boolean;
    only_allow_merge_if_all_discussions_are_resolved: boolean;
    printing_merge_request_link_enabled: boolean;
}

