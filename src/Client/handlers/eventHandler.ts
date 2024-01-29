import { ClientEvents } from "discord.js";
import { ExtendedClient } from "../Client";
import glob from "glob"
import { promisify } from "util";



export interface ServerToClientEvents {
    authGranted:(code:string)=>void
}

export interface ClientToServerEvents {
    //get service status
    pingServerStatus:()=>void,
    getAllHosts:()=>void,
    makeImage:(socketId:string,tag:string)=>void,
    getSocket:(socketId:string)=>void,
    removeImage:(socketId:string,tag:string)=>void,
    remoteShell:(socketId:string,cmd:string)=>void,
    searchImageMetadata:(query:{[key:string]:string})=>void,
    getUserRepositories:(username:string)=>void,
    hasUserInstallation:(username:string)=>void,
    makeNetwork:(socketId:string,name:string,type:string,ack:any)=>void
    manageImageNetwork:(socketId:string,tag:string,net:string,ack:any)=>void
    removeNetwork:(socketId:string,name:string,ack:any)=>void
}

type EventsKeysType = (keyof ClientEvents) | (keyof ServerToClientEvents)
type EventListener<T> =
    T extends keyof ClientEvents
    ? ClientEvents[T]
    : (
        T extends keyof ServerToClientEvents
        ? Parameters<ServerToClientEvents[T]> 
        : []
    )
type Runner<T extends EventsKeysType = EventsKeysType> = (client: ExtendedClient, ...args: EventListener<T>) => Promise<void>

export interface EventInterface<T extends EventsKeysType = EventsKeysType> {
    name: T,
    run: Runner<T>
}

export class EventHandler {
    constructor(client: ExtendedClient) {
        this.initFiles(client)
    }
    private async initFiles(client: ExtendedClient) {
        const globPromise = promisify(glob);
        const eventFiles: string[] = await globPromise(
            `${__dirname}/../../Events/**/*{.ts,.js}`
        );
        eventFiles.forEach(async (value: string) => {
            const file: EventInterface<keyof ClientEvents> = await import(value);
            client.on(file.name, async (...args: any) => {
                try {
                    await file.run(client, ...args)
                } catch (e) {
                    console.error(e)
                }
            });
        });
    }
}