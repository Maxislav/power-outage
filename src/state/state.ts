import { arealList } from "@app/available-areas";
import { AutoSubscription, Service } from "@app/decorator";
import { IArea } from "@app/model";
import { FirebaseAnalytics } from "@capacitor-firebase/analytics";
import { Preferences } from "@capacitor/preferences";
import { filter, from, ReplaySubject, switchMap } from "rxjs";
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { Capacitor } from "@capacitor/core";

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

        const v = value !== null ? Number(value) : 0;

        const area = arealList.find((a) => a.id === v);

        this.setArea(area, false);
        const platform = Capacitor.getPlatform();
        if (platform === "android") {
            //  return capGet(area);
        } else {
            const firebaseConfig = {
                apiKey: "AIzaSyBsSA1KtY_e8t5pioTE9i-JJmCdgSmsiog",
                authDomain: "propeerty-detail-test.firebaseapp.com",
                projectId: "propeerty-detail-test",
                storageBucket: "propeerty-detail-test.firebasestorage.app",
                messagingSenderId: "866627755554",
                appId: "1:866627755554:web:b8d8a59968e610bc94b47b",
                measurementId: "G-4P79Z9ZB7V",
            };

            // Initialize Firebase
            const app = initializeApp(firebaseConfig);
            const analytics = getAnalytics(app);
            logEvent(analytics, "app_type", {
                content_type: "image",
                type: "web",
            });
        }

        await this.logEvent("state_init", { name: "ololo" });
    }

    async logEvent(name: string, params: object) {
        await FirebaseAnalytics.logEvent({
            name: name,
            params: params,
        });
    }

    @AutoSubscription()
    areaIdSub() {
        return this.currentArea$.pipe(
            filter((area) => area.emit && !!area.value),
            switchMap((area) => {
                return from(this.saveAreaId(area.value.id));
            }),
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
