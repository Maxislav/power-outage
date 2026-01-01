import { AutoSubscription, Component, Viewchild } from "@app/decorator";
import html from "./root.component.html?raw";
import { myFetch } from "@app/request";
import { from, map, tap } from "rxjs";
import { EGpv, IData, IGpv, IHour, IShodownResponce, TGpv } from "@app/model";

@Component({
  template: html,
})
export class RootComponent {
  @Viewchild("today") private readonly todayEl: HTMLElement;
  @Viewchild("tomorrow") private readonly tomorrowEl: HTMLElement;
  private readonly SEC_IN_DAY = 86400;

  init(selector: string) {}

  @AutoSubscription()
  myFetch() {
    return from(myFetch()).pipe(
      //map((d) => JSON.parse(d)),
      tap((d: IShodownResponce) => {
        const data: IData = d.data;
        const todayGroup: IHour = data[d.today]["GPV3.1"];
        this.render(todayGroup, this.todayEl);

        const tomorrowGrout: IHour = data[d.today + this.SEC_IN_DAY]["GPV3.1"];
        console.log(d);
        this.render(tomorrowGrout, this.tomorrowEl);
      })
    );
  }

  render(group: IHour, el: HTMLElement) {
    const list = Object.keys(group).forEach((key) => {
      const rowEl = document.createElement("div");
      rowEl.classList.add("shotdown__column");
      const hhKeyEl = document.createElement("div");
      hhKeyEl.innerHTML = `${Number(key) - 1}-${key}`;
      hhKeyEl.classList.add("shotdown__key");
      const hhValueEl = document.createElement("div");
      const value: EGpv = group[Number(key)];

      switch (value) {
        case EGpv.yes: {
          hhValueEl.classList.add("shotdown__value", "shotdown__value--work");
          break;
        }
        case EGpv.no: {
          hhValueEl.classList.add("shotdown__value", "shotdown__value--hide");
          break;
        }
        case EGpv.first: {
          hhValueEl.classList.add("shotdown__value", "shotdown__value--first");
          break;
        }

        case EGpv.second: {
          hhValueEl.classList.add("shotdown__value", "shotdown__value--second");
          break;
        }
      }

      // hhKeyValue.classList.add("shotdown__value", "shotdown__value-work")
      rowEl.appendChild(hhKeyEl);
      rowEl.appendChild(hhValueEl);
      el.appendChild(rowEl);
    });
  }
}
