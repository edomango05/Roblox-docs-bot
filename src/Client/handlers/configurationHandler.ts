import { Collection, ThreadChannel } from "discord.js"
import config from "./config.json"
import fs from "fs"
import {join} from "path"

export type Config = typeof config

export enum ConfigurationType {
    Webhook = 20,
    
}

export class ConfigurationHandler<T extends keyof Config = keyof Config>{
    readonly configurationMap: Collection<T, Config[T]> = new Collection(Object.entries(config) as [T, Config[T]][])
    setData(key:T, data: Config[T]["data"]) {
        //@ts-ignore
        this.configurationMap.set(key,{
            type:config[key].type,
            data:data,
            metadata:config[key].metadata
        })
        const str = JSON.stringify(Object.fromEntries(this.configurationMap));
        
        fs.writeFile(join(__dirname,'config.json'), str, err => {
            if (err) {
              throw err
            }
        })
    }
    getType(key: T) {
        return this.configurationMap.get(key)?.type
    }
    getData(key: T) : Config[T]["data"]{
        return this.configurationMap.get(key)!.data
    }
}