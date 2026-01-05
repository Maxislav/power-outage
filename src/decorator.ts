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
  // Описываем форму класса, который МЫ ОЖИДАЕМ (у него должен быть init)
  return function <
    T extends {
      new (...args: any[]): {
        init(...args: any[]): any;
        destroy(...args: any[]): any;
      };
    }
  >(originalConstructor: T, context?: ClassDecoratorContext) {
    return class extends originalConstructor {
      rootElement: HTMLElement;
      sectionElement: HTMLElement;
      __rootElement: HTMLElement;
      __mainSub: Subscription;
      __section: HTMLElement;
      AUTO_SUBSCRIBTION =
        originalConstructor.prototype["AUTO_SUBSCRIBTION"] || [];
      VIEW_CHILD_REFS = originalConstructor.prototype["VIEW_CHILD_REFS"] || [];

      constructor(...args: any[]) {
        super(...args);
        //console.log("Template:", props.template);
      }

      // Теперь TS знает, что super.init существует
      async init(...args: any[]) {
        // const originalInit = await super.init(...args)

        const selector = args[0];
        this.__mainSub = new Subscription();
        this.__rootElement = document.querySelector(selector);
        this.rootElement = this.__rootElement;
        this.__section = document.createElement("section");
        this.__section.style.display = "contents";
        this.__section.innerHTML = props.template;
        this.sectionElement = this.__section;
        const refSub = this["AUTO_SUBSCRIBTION"] || [];
        const refs = this["VIEW_CHILD_REFS"] || [];
        // debugger
        refs.forEach((ref: any) => {
          const found = this.__section.querySelector(`[\\#${ref.selector}]`);

          if (found) {
            (this as any)[ref.propertyKey] = found;
          }
        });
        if (this.__rootElement) {
          this.__rootElement.appendChild(this.__section);
        }
        const originalInit = await super.init(...args);
        refSub.forEach((ref: any) => {
          this.__mainSub.add((this as any)[ref.functionName]().subscribe());
        });

        //console.log("Логика до вызова оригинального init");
        return originalInit;
      }
      destroy(...args: any[]) {
        this.__section.remove();
        this.__mainSub.unsubscribe();
        return super.destroy(...args);
      }
    };
  };
}


export function Service() {
  // Описываем форму класса, который МЫ ОЖИДАЕМ (у него должен быть init)
  return function <
    T extends {
      new (...args: any[]): {
        init(...args: any[]): any;
        destroy(...args: any[]): any;
      };
    }
  >(originalConstructor: T, context?: ClassDecoratorContext) {
    return class extends originalConstructor {
    
      __mainSub: Subscription;
      AUTO_SUBSCRIBTION =
        originalConstructor.prototype["AUTO_SUBSCRIBTION"] || [];

      constructor(...args: any[]) {
        super(...args);
      }

      // Теперь TS знает, что super.init существует
      async init(...args: any[]) {
        // const originalInit = await super.init(...args)

       // const selector = args[0];
        this.__mainSub = new Subscription();
       
        const refSub = this["AUTO_SUBSCRIBTION"] || [];
       
        // debugger
       
        const originalInit = await super.init(...args);
        refSub.forEach((ref: any) => {
          this.__mainSub.add((this as any)[ref.functionName]().subscribe());
        });

        //console.log("Логика до вызова оригинального init");
        return originalInit;
      }
      destroy(...args: any[]) {
        this.__mainSub.unsubscribe();
        return super.destroy(...args);
      }
    };
  };
}
