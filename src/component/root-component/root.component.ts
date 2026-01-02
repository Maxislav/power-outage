import {AutoSubscription, Component, Viewchild} from "@app/decorator";
import html from "./root.component.html?raw";
import {capGet, myFetch} from "@app/request";
import {from, map, take, tap} from "rxjs";
import {EGpv, IData, ISlot} from "@app/model";
import {Capacitor} from '@capacitor/core';
import dateFormat, {masks} from "dateformat";

@Component({
    template: html,
})
export class RootComponent {
    @Viewchild("today") private readonly todayEl: HTMLElement;
    @Viewchild("tomorrow") private readonly tomorrowEl: HTMLElement;
    @Viewchild("refresh") private readonly refreshEl: HTMLElement;
    @Viewchild("updatedOn") private readonly updatedOnEl: HTMLElement;
    private readonly SEC_IN_DAY = 86400;

    init(selector: string) {

        this.refreshEl.addEventListener('click', (e) => {
            this.todayEl.innerHTML = ''
            this.tomorrowEl.innerHTML = ''
            this.myFetch()
                .pipe(take(1))
                .subscribe()
        })
    }

    @AutoSubscription()
    myFetch() {
        return from(this.getReqFn()).pipe(
            tap((d: IData) => {


                this.updatedOnEl.innerText = dateFormat(new Date(d['3.1'].updatedOn), "yyyy-MM-dd hh:mm");
                const today = d['3.1']['today']
                const slotsToday = today.slots
                const slotsTomorrow = d['3.1']['tomorrow'].slots
                console.log(today);
                this.render(slotsToday, this.todayEl);
                this.render(slotsTomorrow, this.tomorrowEl);
                // debugger
            })
        );
    }

    getReqFn(): Promise<any> {

        const platform = Capacitor.getPlatform();
        if (platform === 'android') {
            return capGet()
        } else {
            return myFetch()
        }
    }

    checkSlots(slots: ISlot[], time: number): ISlot {
        return slots.find(slot => {
            return slot.start / 60 <= time && time < slot.end / 60;
        })
    }

    render(slots: ISlot[], el: HTMLElement): void {
        for (let i = 0; i < 24; i++) {
            //const currentSlot = this.checkSlots(slots, i);
            const firstSlot = this.checkSlots(slots, i);
            const secondSlot = this.checkSlots(slots, i + 0.5);
            // debugger

            const rowEl = document.createElement("div");
            rowEl.classList.add("shutdown__column");
            const key = i
            const hhKeyEl = document.createElement("div");
            hhKeyEl.classList.add("shutdown__key");
            hhKeyEl.innerHTML = `${key}-${key + 1}`;
            const hhValueEl = document.createElement("div");

            if (firstSlot.type === "NotPlanned" && secondSlot.type === "NotPlanned") {
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

}
