import { AutoSubscription, Component, Viewchild } from "@app/decorator";
import template from "./slot.component.html?raw";
import { filter, firstValueFrom, Subscription, tap, timer } from "rxjs";
import { EslotType, ISlot } from "@app/model";
import { formatMinutes, timeUntil } from "@app/helper";

@Component({
    template,
})
export class SlotController {
    public slotElement: HTMLElement;
    @Viewchild("name") private nameEl: HTMLElement;
    @Viewchild("time") private timeEl: HTMLElement;
    @Viewchild("until") private untilEl: HTMLElement;
    @Viewchild("slot") private slotEl: HTMLElement;

    private slotData: ISlot;
    private active = false;
    private isNext = false;
    private type: EslotType;

    hashMap = {
        [EslotType.DEFINITE]: "Запланировано отключение",
        [EslotType.NOTPLANNED]: "Свет есть",
    };

    async init(selector?: string) {
        return Promise.resolve();
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

    setSlotType(type: EslotType): SlotController {
        this.type = type;
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
                    data.end,
                )}`;
                this.slotEl.classList.add(this.type?.toLowerCase());
                if (this.active) {
                    this.slotEl.classList.add("active");
                }

                if (this.active && data.type === EslotType.DEFINITE) {
                    //this.slotEl.classList.add("active");
                    this.untilEl.innerText = timeUntil(data.start, "");
                }

                if (this.isNext && data.type === EslotType.NOTPLANNED) {
                    this.untilEl.innerText = timeUntil(data.start, "Еще");
                }
                if (this.isNext && data.type === EslotType.DEFINITE) {
                    this.untilEl.innerText = timeUntil(data.start, "Осталось");
                }
            }),
        );
    }

    destroy() {}
}
