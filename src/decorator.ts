import { Subscription } from "rxjs";

export function Viewchild(selector: string) {
  return (target: any, propertyKey: string) => {
    if (!target["VIEW_CHILD_REFS"]) {
      target["VIEW_CHILD_REFS"] = [];
    }
    target["VIEW_CHILD_REFS"].push({ propertyKey, selector });
  };
}

export function AutoSubscription() {
  return (target: any, functionName: string) => {
    const fff = () => {};
    if (!target["AUTO_SUBSCRIBTION"]) {
      target["AUTO_SUBSCRIBTION"] = [];
    }
    target["AUTO_SUBSCRIBTION"].push({ functionName, fff });
  };
}

export function Controller() {
  return function (constructor: any) {
    const originalInit = constructor.prototype.init;
    const originalDestroy = constructor.prototype.destroy;
    let mainSub: Subscription = new Subscription();

    constructor.prototype.destroy = function () {
      //section.remove();
      mainSub.unsubscribe();
      if (originalDestroy) {
        return originalInit.apply(this, []);
      }
    };

    constructor.prototype.init = async function (...args: any[]) {
      mainSub = new Subscription();
      const refSub = this["AUTO_SUBSCRIBTION"] || [];
      //const arg =

      if (originalInit) {
        const rr = await originalInit.apply(this, args);
        refSub.forEach((ref: any) => {
          mainSub.add(this[ref.functionName]().subscribe());
        });

        return rr;
      }
    };
  };
}

export function Component(props: { template: string }) {
  return function (constructor: any) {
    console.log("constructor.name", constructor.name);
    const section = document.createElement("section");
    const originalInit = constructor.prototype.init;
    const originalDestroy = constructor.prototype.destroy;
    let mainSub: Subscription;

    constructor.prototype.destroy = function () {
      section.remove();
      mainSub.unsubscribe();
      if (originalDestroy) {
        return originalDestroy.apply(this, []);
      }
    };

    console.log();

    constructor.prototype.init = async function (selector: string) {
      mainSub = new Subscription();
      this.rootElement = document.querySelector(selector);
      const refSub = this["AUTO_SUBSCRIBTION"] || [];
      if (this.rootElement) {
        section.style.display = "contents";
        section.innerHTML = props.template;
        this.rootElement.appendChild(section);

        const refs = this["VIEW_CHILD_REFS"] || [];
        //debugger;

        refs.forEach((ref: any) => {
          const found = this.rootElement.querySelector(`[\\#${ref.selector}]`);

          if (found) {
            this[ref.propertyKey] = found;
          }
        });

        constructor.prototype.child = {};

        console.log(`[Авто-рендер]: Шаблон успешно вставлен.`);
      } else {
        console.warn(`[Ошибка]: Элемент ${selector} не найден.`);
      }

      if (originalInit) {
        const rr = await originalInit.apply(this, [selector]);
        refSub.forEach((ref: any) => {
          mainSub.add(this[ref.functionName]().subscribe());
        });

        return rr;
      }
    };
  };
}
