import html from "./weather.component.html?raw";
import { AutoSubscription, Component, Viewchild } from "@app/decorator.ts";
import "./weather.component.less";
import { IOpenMeteo, IOpenWeather } from "@app/model.ts";
import { from, fromEvent, map, switchMap, takeUntil, tap, timer } from "rxjs";
import { Cloud } from "@app/lib/clouds.es.js";
import "./clouds.less";
@Component({
    template: html,
})
export class WeatherComponent {
    public sectionElement: HTMLElement;
    private hostElement: HTMLElement;
    appEl: HTMLElement;
    @Viewchild("temperature") temperatureEl: HTMLElement;
    @Viewchild("clouds") cloudsEl: HTMLElement;
    @Viewchild("wind") windEl: HTMLElement;
    @Viewchild("windDirection") windDirectionEl: HTMLElement;

    private cloudsAll = 0; // 0.1 .. 0.9
    private cloud: Cloud;

    async init() {
        this.appEl = document.querySelector("#app");
        await this.getData();
    }

    async getData(): Promise<void> {
        // const url = "https://api.open-meteo.com/v1/forecast?" +
        //     "latitude=52.45&longitude=30.52" +
        //     "&current=" +
        //     "temperature_2m," +
        //     "wind_speed_10m," +
        //     "wind_direction_10m," +
        //     "rain," +
        //     "showers," +
        //     "snowfall," +
        //     "wind_speed_10m," +
        //     "wind_direction_10m," +
        //     "cloud_cover," +
        //     "is_day," +
        //     "precipitation";

        const url =
            "https://api.openweathermap.org/data/2.5/weather?" +
            // 'lat=50.358399' +
            // '&lon=30.473383' +
            "q=Kyiv" +
            "&exclude=current" +
            "&appid=19e738728f18421f2074f369bdb54e81" +
            "&units=metric";
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            //const json: IOpenMeteo = await response.json();
            const json: IOpenWeather = await response.json();
            console.log(json);
            //json.clouds.all = 50
            this.cloudsAll = json.clouds.all / 100;
            this.temperatureEl.innerText =
                json.main.temp > 0
                    ? `+${json.main.temp.toFixed(1)}`
                    : `${json.main.temp.toFixed(1)}`;
            this.windEl.innerText = `${json.wind.speed.toFixed(1)}`;
            this.windDirectionEl.style.transform = `rotate(${(json.wind.deg + 180) % 360}deg)`;
            this.cloudsEl.style.transform = `scale(${json.clouds.all / 100})`;
            this.appEl.style.setProperty(
                "--cloud-scale",
                `${this.cloudsAll < 0.6 ? this.cloudsAll : 1}`,
            );

            const viewportWidth = window.innerWidth;

            //console.log(viewportWidth);
            const cloudAfterTop =
                120 - (viewportWidth * json.clouds.all * 0.4) / 100;
            const beforeTop =
                120 - (viewportWidth * json.clouds.all * 0.25) / 100;
            // console.log(top);
            this.appEl.style.setProperty(
                "--cloud-after-top",
                `${cloudAfterTop}`,
            );
            this.appEl.style.setProperty("--cloud-before-top", `${beforeTop}`);
        } catch (error: any) {
            console.error("Fetch error:", error.message);
        }
    }

    @AutoSubscription()
    hostElementSub() {
        return fromEvent(this.hostElement, "touchstart").pipe(
            switchMap(async (event) => {
                this.hostElement.classList.add("weather--active");
                return from(this.getData());
            }),
            switchMap((event) => {
                this.update();
                return timer(1000);
            }),
            tap(() => {
                this.hostElement.classList.remove("weather--active");
            }),
        );
    }

    public cloudsDraw(el: HTMLElement) {
        this.cloud = new Cloud({ element: el, density: this.cloudsAll }).init();
    }

    public update() {
        this.cloud.update({
            density: this.cloudsAll,
        });
    }

    destroy() {}
}
