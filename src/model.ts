
export type TGpv = "no" | "yes" | "second" | "first";

export enum EGpv{
    "yes" = "yes",
    "no" = 'no',
    "second" = 'second',
    "first" = 'first'
}

export enum EslotType{
    DEFINITE = "Definite",
    NOTPLANNED = "NotPlanned"
}

export enum EStatus{
    SCHEDULEAPPLIES = "ScheduleApplies",
    WAITINGFORSCHEDULE =  "WaitingForSchedule"
}

export interface ISlot{
    start: number,
    end: number,
    type: EslotType
}

export interface IDay{
    date: string,
    slots: ISlot[],
    status: EStatus
}

export interface ITodayTomorrow{
    today: IDay,
    tomorrow: IDay,
    updatedOn: string
}

export interface IData{
    [key: string]:  ITodayTomorrow
}