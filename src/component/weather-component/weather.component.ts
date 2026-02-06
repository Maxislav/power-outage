import html from "./weather.component.html?raw";
import {AutoSubscription, Component, Viewchild} from "@app/decorator.ts";
import './weather.component.less'
import {IOpenMeteo, IOpenWeather} from "@app/model.ts";
import {fromEvent, map, switchMap, takeUntil, tap, timer} from "rxjs";
import {getRandom, getRandomCenter} from "@app/helper.ts";

@Component({
    template: html
})
export class WeatherComponent {
    public sectionElement: HTMLElement;
    private hostElement: HTMLElement;
    appEl: HTMLElement;
    @Viewchild('temperature') temperatureEl: HTMLElement;
    @Viewchild('clouds') cloudsEl: HTMLElement;
    @Viewchild('wind') windEl: HTMLElement;
    @Viewchild('windDirection') windDirectionEl: HTMLElement;

    private cloudsContainerList: HTMLElement[] = [];
    private cloudsAll = 0; // 0.9

    async init() {
        this.appEl = document.querySelector('#app')

        await this.getData()
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

        const url = 'https://api.openweathermap.org/data/2.5/weather?' +
            // 'lat=50.358399' +
            // '&lon=30.473383' +
            'q=Kyiv' +
            '&exclude=current' +
            '&appid=19e738728f18421f2074f369bdb54e81' +
            '&units=metric'
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            //const json: IOpenMeteo = await response.json();
            const json: IOpenWeather = await response.json();
            console.log(json);
            //json.clouds.all = 10
            this.cloudsAll = json.clouds.all/100;
            // json.clouds.all = 50
            this.temperatureEl.innerText = json.main.temp > 0 ? `+${json.main.temp.toFixed(1)}` : `${json.main.temp.toFixed(1)}`;
            this.windEl.innerText = `${json.wind.speed.toFixed(1)}`;
            this.windDirectionEl.style.transform = `rotate(${(json.wind.deg + 180) % 360}deg)`;
            this.cloudsEl.style.transform = `scale(${json.clouds.all / 100})`;
            this.appEl.style.setProperty('--cloud-scale', `${json.clouds.all / 100}`);

            const viewportWidth = window.innerWidth;

            //console.log(viewportWidth);
            const cloudAfterTop = 120 - viewportWidth * json.clouds.all * 0.4 / 100;
            const beforeTop = 120 - viewportWidth * json.clouds.all * 0.25 / 100;
            // console.log(top);
            this.appEl.style.setProperty('--cloud-after-top', `${cloudAfterTop}`);
            this.appEl.style.setProperty('--cloud-before-top', `${beforeTop}`);

            this.cloudsContainerList.forEach(cloud => {
                this.cloudsDraw(cloud);
            })

        } catch (error: any) {
            console.error("Fetch error:", error.message);
        }
    }

    @AutoSubscription()
    hostElementSub() {
        return fromEvent(this.hostElement, 'touchstart')
            .pipe(
                tap((event) => {
                    this.hostElement.classList.add('weather--active');
                    this.getData()
                }),
                switchMap((event) => {
                    return timer(1000)
                }),
                tap(() => {
                    this.hostElement.classList.remove('weather--active');
                }),
            )
    }

    public setCloudsContainers(els: HTMLElement[]): WeatherComponent {
        els.forEach(el => {
            this.cloudsContainerList.push(el);
        });
        return this
    }

    private getCloudBlock() {

        const r1 = getRandom(1, 8)
        const r2 = getRandom(10, 15)
        const cx1 = getRandomCenter(50-(80*this.cloudsAll), 50+70*this.cloudsAll);
        const dcx2 = getRandomCenter(1, 20)
        const cy1 = getRandom(40, 30);
        const cy2 = getRandom(cy1-10*this.cloudsAll, cy1-20*this.cloudsAll)
        const dur = getRandom(10, 20)
        const begin = getRandom(0, 20)
        return `
           <circle cx="${cx1}" cy="20" r="7">
                        <animate attributeName="opacity" values="0;1;1;0.2;0" begin="-${begin}s" dur="${dur}s" repeatCount="indefinite" ></animate>
                        <animate attributeName="cy" values="${cy1};${cy2}" begin="-${begin}s" dur="${dur}s" repeatCount="indefinite" ></animate>
                        <animate attributeName="cx" values="${cx1};${cx1 + dcx2}" begin="-${begin}s" dur="${dur}s" repeatCount="indefinite" ></animate>
                        <animate attributeName="r" values="${r1};${r2}" dur="${dur}s" begin="-${begin}s"  repeatCount="indefinite" ></animate>
           </circle>
        `
    }

    private cloudsDraw(el: any) {
        const svgNS = "http://www.w3.org/2000/svg";
        el.innerText = ''
        for (let i = 0; i < 50+(100*this.cloudsAll/0.5); i++) {
            const child = document.createElementNS(svgNS, "g");
            child.innerHTML = this.getCloudBlock()
            el.appendChild(child)
        }
    }

    destroy() {
    }
}