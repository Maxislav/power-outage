import { AutoSubscription, Component, Viewchild } from "@app/decorator";
import template from "./select-area.controller.html?raw";
import { State } from "@app/state/state";
import { arealList } from "@app/available-areas";
import { BehaviorSubject, fromEvent, map, merge, Observable, tap } from "rxjs";
import { IArea } from "@app/model";

@Component({
    template,
})
export class SelectAreaCtrl {
    public slotElement: HTMLElement;
    private readonly state = State.getInstance();

    @Viewchild("list") listEl: HTMLElement;
    @Viewchild("name") nameEl: HTMLElement;
    @Viewchild("areaSelector") areaSelectorEl: HTMLElement;
    areaItemElList: HTMLElement[] = [];
    events: Observable<IArea>[] = [];
    activeClass$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    private readonly NAME_MAP = {
        city: "Kyiv",
        region: "Область",
    };

    init() {
        this.areaItemElList = arealList.map((area) => {
            const areaItem = document.createElement("div");
            areaItem.setAttribute("data-area-id", String(area.id));
            areaItem.classList.add("area-selector__item");
            areaItem.innerText = `${this.NAME_MAP[area.origin]} ${area.slot}`;
            this.listEl.appendChild(areaItem);
            this.events.push(
                fromEvent(areaItem, "click").pipe(
                    map(() => {
                        return area;
                    }),
                ),
            );
            return areaItem;
        });
    }

    @AutoSubscription()
    activeClassSub() {
        return this.activeClass$.pipe(
            tap((v) => {
                if (v) {
                    this.areaSelectorEl.classList.add("active");
                } else {
                    this.areaSelectorEl.classList.remove("active");
                }
            }),
        );
    }

    @AutoSubscription()
    nameElSub() {
        return fromEvent(this.nameEl, "click").pipe(
            tap((e) => {
                e.stopPropagation();
                this.activeClass$.next(true);
            }),
        );
    }

    @AutoSubscription()
    docSub() {
        return fromEvent(document, "click").pipe(
            tap(() => {
                this.activeClass$.next(false);
            }),
        );
    }

    @AutoSubscription()
    selectSub() {
        return merge(...this.events).pipe(
            tap((area) => {
                this.state.setArea(area);
            }),
        );
    }

    @AutoSubscription()
    currentAreaSub() {
        return this.state.getArea().pipe(
            map((a) => a.value),
            tap((area) => {
                this.nameEl.innerText = `${this.NAME_MAP[area.origin]} ${area.slot}`;
            }),
        );
    }

    destroy() {}
}
