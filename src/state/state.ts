import { arealList } from "@app/available-areas";
import { AutoSubscription, Service } from "@app/decorator";
import { IArea } from "@app/model";
import { Preferences } from "@capacitor/preferences";
import { filter, from, ReplaySubject, switchMap } from "rxjs";

@Service()
export class State {
  private static instance: State;
  private readonly currentArea$ = new ReplaySubject<{
    value: IArea;
    emit: boolean;
  }>(1);
  constructor() {
    if (State.instance) {
      return this;
    }
    State.instance = this;
  }
  public static getInstance(): State {
    if (!State.instance) {
      State.instance = new State();
    }
    return State.instance;
  }
  async init() {
    let { value } = await Preferences.get({ key: "areaId" });
    console.log(value);
    const v = value!==null ? Number(value) : 0
    
    const area =  arealList.find(a => a.id === v);
    console.log(area);

    this.setArea(area, false)
    
  }

  @AutoSubscription()
  areaIdSub() {
    return this.currentArea$.pipe(
      filter((area) => area.emit && !!area.value),
      switchMap((area) => {
        return from(this.saveAreaId(area.value.id));
      })
    );
  }

  async saveAreaId(id: number): Promise<void> {
    return await Preferences.set({
      key: "areaId",
      value: String(id),
    });
  }

  getArea() {
    return this.currentArea$.asObservable();
  }

  setArea(area: IArea, emit = true) {
    this.currentArea$.next({
      value: area,
      emit,
    });
  }

  destroy() {}
}
