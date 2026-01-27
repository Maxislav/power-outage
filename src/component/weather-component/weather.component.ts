import html from "./weather.component.html?raw";
import {Component, Viewchild} from "@app/decorator.ts";
import './weather.component.less'
import {IOpenMeteo} from "@app/model.ts";

@Component({
    template: html
})
export class WeatherComponent {
    public sectionElement: HTMLElement;
    appEl: HTMLElement;
    @Viewchild('temperature') temperatureEl: HTMLElement;
    @Viewchild('clouds') cloudsEl: HTMLElement;

    async init() {
        this.appEl = document.querySelector('#app')

        this.getData()
    }

    async getData(): Promise<void> {
        const url = "https://api.open-meteo.com/v1/forecast?" +
            "latitude=52.45&longitude=30.52" +
            "&current=" +
            "temperature_2m," +
            "wind_speed_10m," +
            "wind_direction_10m," +
            "rain," +
            "showers," +
            "snowfall," +
            "wind_speed_10m," +
            "wind_direction_10m," +
            "cloud_cover," +
            "is_day," +
            "precipitation";
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json: IOpenMeteo = await response.json();
            console.log(json);
            this.temperatureEl.innerText = String(json.current.temperature_2m);
            this.cloudsEl.style.transform= `scale(${json.current.cloud_cover/100})`;
            this.appEl.style.setProperty('--cloud-scale', `${json.current.cloud_cover/100}`);
        } catch (error: any) {
            console.error("Fetch error:", error.message);
        }
    }

    destroy() {
    }
}