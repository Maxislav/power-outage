import {IData} from "@app/model.ts";
import { CapacitorHttp } from '@capacitor/core';
const REQ_URL = {
    dev: 'http://165.232.46.174:5711/shutdown',
    prod: 'https://165.232.46.174:5710/shutdown'
}

export async function myFetch(): Promise<IData> {
    let reqUrl: string
    if (import.meta.env.DEV) {
        console.log('Running in development mode');
        reqUrl = REQ_URL.prod;
    } else {
        console.log('Running in production mode');
        reqUrl = REQ_URL.prod;
    }

    try {
    //const response = await fetch("http://localhost:5711/shutdown");
   const response = await fetch(reqUrl);
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

export const capGet = async () => {
    const options = {
        url: REQ_URL.prod,
        headers: { 'Content-Type': 'application/json' },
       // params: { user: '123' },
    };

    const response = await CapacitorHttp.get(options);
    console.log('Response:', response.data);
    return JSON.parse(response.data);
};
