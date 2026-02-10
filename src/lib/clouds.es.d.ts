export declare class Cloud {
    private cloudsContainerList;
    private childEls;
    private options;
    private cloudsAll;
    constructor(options?: Partial<CloudsOptions>);
    init(): void;
    update(options?: Partial<CloudsOptions>): void;
    private cloudsDraw;
    private getCloudBlock;
}

declare interface CloudsOptions {
    element: string | HTMLElement;
    density: number;
}

export {};
