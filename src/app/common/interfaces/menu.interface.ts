export interface IMainMenuInterface {
    path: string;
    name: string;
    rule: number;
    children: IMainMenuInterface[];
}
