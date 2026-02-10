import { RootComponent } from "./component/root-component/root.component";
import { Component } from "./decorator";
import { State } from "./state/state";
import "./style/style.less";
import { MyCapacitorAppController } from "@app/my-capacitor.controller.ts";

new MyCapacitorAppController().init();

new State().init();
new RootComponent().init("#app");
