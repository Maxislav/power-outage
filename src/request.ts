import { IArea, IData } from "@app/model.ts";
import { CapacitorHttp } from "@capacitor/core";
const REQ_URL = {
    dev: "http://localhost:5714/shutdown", //?slot=3.1&origin=region
    //dev: "https://165.232.46.174:5712/shutdown",
    prod: "https://206.189.114.217:5712/shutdown",
};

export async function myFetch(params: Partial<IArea> = {}): Promise<IData> {
    const queryParams = `?slot=${params.slot}&origin=${params.origin}`;
    let reqUrl: string;
    if (import.meta.env.DEV) {
        console.log("Running in development mode");
        reqUrl = REQ_URL.dev;
    } else {
        console.log("Running in production mode");
        reqUrl = REQ_URL.prod;
    }

    try {
        //const response = await fetch("http://localhost:5711/shutdown");
        const response = await fetch(reqUrl + queryParams);
        //console.log(response)

        // Always check if the response is okay
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();

        //console.log(JSON.parse(text))
        // Type the JSON data
        //const data: User[] = await response.json();
        return JSON.parse(text);
    } catch (error) {
        console.error("Could not fetch users:", error);
        return {} as any;
    }
}

export const capGet = async (params: Partial<IArea> = {}) => {
    const queryParams = `?slot=${params.slot}&origin=${params.origin}`;
    const options = {
        url: REQ_URL.prod + queryParams,
        headers: { "Content-Type": "application/json" },
        // params: { user: '123' },
    };

    const response = await CapacitorHttp.get(options);
    console.log("Response:", response.data);
    return JSON.parse(response.data);
};
