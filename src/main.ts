import {RootComponent} from './component/root-component/root.component';
import {Component} from './decorator';
import './style.less'
import {MyCapacitorAppController} from "@app/my-capacitor.controller.ts";

new MyCapacitorAppController().init();

// async function myFetch(): Promise<any> {

//   try {
//     const response = await fetch('http://localhost:5710/shutdown');
//     console.log(response)

//     // Always check if the response is okay
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const text = await response.text();


//     console.log(JSON.parse(text))
//     // Type the JSON data
//     //const data: User[] = await response.json();
//     return text;
//   } catch (error) {
//     console.error('Could not fetch users:', error);
//     return {};
//   }

// }

// myFetch()

new RootComponent().init('#app')