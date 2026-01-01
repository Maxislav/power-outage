
export type TGpv = "no" | "yes" | "second" | "first";

export enum EGpv{
    "yes" = "yes",
    "no" = 'no',
    "second" = 'second',
    "first" = 'first'
}

export interface IHour{
    [key: number]: EGpv
}

export interface IGpv{
    [key: string]: IHour;
}

export interface IData{
    [key: string]: IGpv
}
export interface IShodownResponce{
    data: IData,
    today: number,
    update: string
}
