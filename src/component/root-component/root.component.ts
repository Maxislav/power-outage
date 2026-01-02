import {AutoSubscription, Component, Viewchild} from "@app/decorator";
import html from "./root.component.html?raw";
import {myFetch} from "@app/request";
import {from, map, tap} from "rxjs";
import {EGpv, IData, ISlot} from "@app/model";

@Component({
    template: html,
})
export class RootComponent {
    @Viewchild("today") private readonly todayEl: HTMLElement;
    @Viewchild("tomorrow") private readonly tomorrowEl: HTMLElement;
    private readonly SEC_IN_DAY = 86400;

    init(selector: string) {
    }

    @AutoSubscription()
    myFetch() {
        return from(myFetch()).pipe(
            tap((d: IData) => {
                const day = d['3.1']['today']
                const slots = day.slots
               console.log(day);
                this.render(slots, this.todayEl);
              // debugger
            })
        );
    }

    checkSlots(slots: ISlot[], time: number): ISlot {
        return slots.find(slot => {
           return slot.start/60 <= time && time < slot.end/60 ;
        })
    }

    render(slots: ISlot[], el: HTMLElement): void{
        for (let i = 0; i < 24; i++) {
            //const currentSlot = this.checkSlots(slots, i);
            const firstSlot = this.checkSlots(slots, i);
            const secondSlot = this.checkSlots(slots, i+0.5);
            // debugger

            const rowEl = document.createElement("div");
            rowEl.classList.add("shutdown__column");
            const key = i
            const hhKeyEl = document.createElement("div");
            hhKeyEl.classList.add("shutdown__key");
            hhKeyEl.innerHTML = `${key}-${key+1}`;
            const hhValueEl = document.createElement("div");

            if(firstSlot.type === "NotPlanned" && secondSlot.type === "NotPlanned"){
                hhValueEl.classList.add("shutdown__value", "shutdown__value--work");
            }
            if(firstSlot.type === "NotPlanned" && secondSlot.type === "Definite"){
                hhValueEl.classList.add("shutdown__value", "shutdown__value--second");
            }
            if(firstSlot.type === "Definite" && secondSlot.type === "NotPlanned"){
                hhValueEl.classList.add("shutdown__value", "shutdown__value--first");
            }
            if(firstSlot.type === "Definite" && secondSlot.type === "Definite"){
                hhValueEl.classList.add("shutdown__value", "shutdown__value--hide");
            }





            rowEl.appendChild(hhKeyEl);
            rowEl.appendChild(hhValueEl);
            el.appendChild(rowEl);
        }
    }

}
