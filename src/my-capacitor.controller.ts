import { App } from "@capacitor/app";
export class MyCapacitorAppController {
    init() {
        App.addListener("appStateChange", (state) => {
            if (!state.isActive) {
                // The app is moving to the background or being terminated
                console.log("App is ->>> inactive (background or terminating)");
                // Perform cleanup or save data here
            } else {
                console.log("App is ->>> active (foreground)");
            }
        });

        App.addListener("backButton", ({ canGoBack }) => {
            if (canGoBack) {
                // Если в истории браузера есть страницы, идем назад
                window.history.back();
            } else {
                // Если страниц нет (мы на главном экране), закрываем приложение
                App.exitApp();
            }
        });
    }
}