import { AutoSubscription, Component, Viewchild } from "@app/decorator";
import template from "./slot.component.html?raw";
import { filter, Subscription, tap, timer } from "rxjs";
import { EslotType, ISlot } from "@app/model";
import { formatMinutes, timeUntil } from "@app/helper";

@Component({
  template,
})
export class SlotController {
  sectionElement: HTMLElement;
  @Viewchild("name") nameEl: HTMLElement;
  @Viewchild("time") timeEl: HTMLElement;
  @Viewchild("until") untilEl: HTMLElement;
  @Viewchild("slot") slotEl: HTMLElement;

  slotData: ISlot;
  active = false;
  isNext = false;

  hashMap = {
    [EslotType.DEFINITE]: "Запланировано отключение",
    [EslotType.NOTPLANNED]: "Свет есть",
  };

  init(selector?: string) {
    return this;
  }

  setData(data: ISlot): SlotController {
    this.slotData = data;
    return this;
  }

  setActive(active: boolean): SlotController {
    this.active = active;
    return this;
  }
  setIsNext(isNext: boolean): SlotController {
    this.isNext = isNext;
    return this;
  }

  @AutoSubscription()
  calcSub() {
    return timer(2, 20 * 1000).pipe(
      filter(() => !!this.slotData),
      tap(() => {
        const data = this.slotData;
        this.nameEl.innerText = this.hashMap[data.type];
        this.timeEl.innerText = `${formatMinutes(data.start)}-${formatMinutes(
          data.end
        )}`;

        if (this.active) {
          this.slotEl.classList.add("active");
        }

        if (this.isNext) {
          this.untilEl.innerText = timeUntil(data.start);
        }
      })
    );
  }
}
