import { ClientEvents, Collection } from "discord.js";
import { ExtendedClient } from "../Client";
import glob from "glob"
import { promisify } from "util";

type Runner =  (client:ExtendedClient,...args:any[]) => Promise<void>

export interface EventInterface {
    name:keyof ClientEvents,
    run:Runner
}

export class EventHandler {
    constructor(client:ExtendedClient){
        this.initFiles(client)
    }
    private async initFiles(client:ExtendedClient){
        const globPromise = promisify(glob);
        const eventFiles: string[] = await globPromise(
            `${__dirname}/../../Events/**/*{.ts,.js}`
        );
        eventFiles.forEach(async (value: string) => {
            const file: EventInterface = await import(value);
            client.on(file.name, file.run.bind(null, client));
        });
    }
}