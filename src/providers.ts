import {Injector, Provider, ReflectiveInjector} from "injection-js";
import {ClientGenerator} from "./client-generator/client-generator";

export const PROVIDERS: Provider[] = [
    ClientGenerator
];

export function injector(providers: Provider[] = []): Injector {
    return ReflectiveInjector.resolveAndCreate([PROVIDERS, providers]);
}
