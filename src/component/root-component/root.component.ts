import { AutoSubscription, Component, Viewchild } from "@app/decorator";
import html from "./root.component.html?raw";
import { capGet, myFetch } from "@app/request";
import { distinctUntilChanged, from, map, take, tap, timer } from "rxjs";
import { EGpv, EslotType, EStatus, IData, IDay, ISlot } from "@app/model";
import { Capacitor } from "@capacitor/core";
import dateFormat, { masks } from "dateformat";
import {
  getCurrentSlot,
  getSunColor,
  getSunPosition,
  timerFormatHtml,
} from "@app/helper";
import { SlotController } from "../slot-component/slot.component";

@Component({
  template: html,
})
export class RootComponent {
  rootElement: HTMLDivElement;
  sectionElement: HTMLDivElement;
  @Viewchild("today") private readonly todayEl: HTMLElement;
  @Viewchild("tomorrow") private readonly tomorrowEl: HTMLElement;
  @Viewchild("refresh") private readonly refreshEl: HTMLElement;
  @Viewchild("updatedOn") private readonly updatedOnEl: HTMLElement;
  @Viewchild("slots") private readonly slotsEl: HTMLElement;
  @Viewchild("currentTime") private readonly currentTimeEl: HTMLElement;
  private readonly SEC_IN_DAY = 86400;
  dayEls: HTMLElement[] = [];

  slotList: SlotController[] = [];

  init(selector: string) {
    this.refreshEl.addEventListener("click", (e) => {
      this.todayEl.innerHTML = "";
      this.tomorrowEl.innerHTML = "";
      //this.slotsEl.innerHTML = "";
      this.slotList.forEach((s: SlotController) => {
        s.destroy();
      });
      this.slotList = [];
      this.myFetch().pipe(take(1)).subscribe();
    });
    this.dayEls = [
      ...this.sectionElement.querySelectorAll(".shutdown__day"),
    ] as HTMLElement[];
  }

  @AutoSubscription()
  currentTimeSub() {
    return timer(2, 200).pipe(
      map(() => dateFormat(new Date(), "HH:MM:ss")),
      distinctUntilChanged(),
      tap((dateText) => {
        this.currentTimeEl.innerHTML = timerFormatHtml(dateText);
      })
    );
  }

  @AutoSubscription()
  calcAngle() {
    let i = 0;
    return timer(0, 1000).pipe(
      tap(() => {
        const sunAngle = getSunPosition(
          new Date(), // new Date(Date.now() + i * 60 * 60 * 1000),
          //new Date(Date.now() + i * 60 * 60 * 1000),
          50.45,
          30.5
        );
        const skyColorTop = getSunColor(sunAngle);
        const skyColorBottom = getSunColor(sunAngle, false);
        //console.log(sunAngle);
        this.rootElement.style.setProperty("--sky-color-top", skyColorTop);
        this.rootElement.style.setProperty(
          "--sky-color-bottom",
          skyColorBottom
        );
        i++;
      })
    );
  }

  @AutoSubscription()
  myFetch() {
    this.dayEls.forEach((el) => {
      el.classList.add("loading");
    });
    return from(this.getReqFn()).pipe(
      tap((d: IData) => {
        this.updatedOnEl.innerText = dateFormat(
          new Date(d["3.1"].updatedOn),
          "yyyy-mmm-dd HH:MM"
        );
        const today = d["3.1"]["today"];
        const slotsToday = today.slots;
        const tomorrow = d["3.1"]["tomorrow"];
        console.log(d["3.1"]);
        this.render(today, this.todayEl);
        this.render(tomorrow, this.tomorrowEl);
        this.renderSlots(slotsToday);
        this.dayEls.forEach((el) => {
          el.classList.remove("loading");
        });
      })
    );
  }

  getReqFn(): Promise<any> {
    const platform = Capacitor.getPlatform();
    if (platform === "android") {
      return capGet();
    } else {
      return myFetch();
    }
  }

  renderSlots(slots: ISlot[]) {
    console.log(slots);
    const currentSlot = getCurrentSlot(slots);
    const currentIndex = slots.findIndex((slot) => slot === currentSlot);

    slots.forEach((slot, index) => {
      const slotCtrl = new SlotController();
      slotCtrl.init();
      this.slotList.push(slotCtrl);
      slotCtrl.sectionElement;
      this.slotsEl.appendChild(slotCtrl.sectionElement);

      slotCtrl.setData(slot);

      if (index == currentIndex) {
        slotCtrl.setActive(true);
      }
      if (currentIndex + 1 == index) {
        slotCtrl.setIsNext(true);
      }
      // const
      slot.start;
      slot.end;
    });
  }

  render(day: IDay, el: HTMLElement): void {
    const slots = day.slots;

    if (day.status == EStatus.WAITINGFORSCHEDULE) {
      const div = document.createElement("div");

      div.innerText = "Ожидаем обновления";
      el.appendChild(div);
      el.classList.add("shutdown__area-schedule--waiting");
      return;
    }

    for (let i = 0; i < 24; i++) {
      //const currentSlot = this.checkSlots(slots, i);
      const firstSlot = this.checkSlots(slots, i);
      const secondSlot = this.checkSlots(slots, i + 0.5);
      if (!firstSlot || !secondSlot) {
        return;
      }
      // debugger

      const rowEl = document.createElement("div");
      rowEl.classList.add("shutdown__column");
      const key = i;
      const hhKeyEl = document.createElement("div");
      hhKeyEl.classList.add("shutdown__key");
      hhKeyEl.innerHTML = `${key}-${key + 1}`;
      const hhValueEl = document.createElement("div");

      if (
        firstSlot.type === EslotType.NOTPLANNED &&
        secondSlot.type === EslotType.NOTPLANNED
      ) {
        hhValueEl.classList.add("shutdown__value", "shutdown__value--work");
      }
      if (firstSlot.type === "NotPlanned" && secondSlot.type === "Definite") {
        hhValueEl.classList.add("shutdown__value", "shutdown__value--second");
      }
      if (firstSlot.type === "Definite" && secondSlot.type === "NotPlanned") {
        hhValueEl.classList.add("shutdown__value", "shutdown__value--first");
      }
      if (firstSlot.type === "Definite" && secondSlot.type === "Definite") {
        hhValueEl.classList.add("shutdown__value", "shutdown__value--hide");
      }

      rowEl.appendChild(hhKeyEl);
      rowEl.appendChild(hhValueEl);
      el.appendChild(rowEl);
    }
  }
  private checkSlots(slots: ISlot[], time: number): ISlot {
    return slots.find((slot) => {
      return slot.start / 60 <= time && time < slot.end / 60;
    });
  }

  destroy() {}
}
