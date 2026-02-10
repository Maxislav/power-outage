export declare class Cloud {
    private cloudsContainerList;
    private childEls;
    private options;
    private cloudsAll;
    constructor(options?: Partial<CloudsOptions>);
    init(): Cloud;
    update(options?: Partial<CloudsOptions>): Cloud;
    private cloudsDraw;
    private getCloudBlock;
}

declare interface CloudsOptions {
    element: string | HTMLElement;
    density: number;
}

export { }
