import { IShodownResponce } from "./model";

export async function myFetch(): Promise<IShodownResponce> {
  try {
    //const response = await fetch("http://localhost:5710/shotdown");
    const response = await fetch("http://165.232.46.174:5710/shotdown");
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
