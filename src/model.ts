
export type TGpv = "no" | "yes" | "second" | "first";

export enum EGpv{
    "yes" = "yes",
    "no" = 'no',
    "second" = 'second',
    "first" = 'first'
}

export interface ISlot{
    start: number,
    end: number,
    type: string
}

export interface IDay{
    date: string,
    slots: ISlot[],
    status: string
}

export interface ITodayTomorrow{
    today: IDay,
    tomorrow: IDay,
    updatedOn: string
}

export interface IData{
    [key: string]:  ITodayTomorrow
}