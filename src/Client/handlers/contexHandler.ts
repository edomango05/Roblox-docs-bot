import { ApplicationCommandData, ButtonInteraction, ChatInputApplicationCommandData, ChatInputCommandInteraction, ClientEvents, Collection, CommandInteraction, CommandInteractionResolvedData, Interaction, MessageInteraction, RoleResolvable, UserApplicationCommandData, UserContextMenuCommandInteraction } from "discord.js";
import { ExtendedClient } from "../Client";
import glob from "glob"
import { promisify } from "util";
import ExtendedSelectMenu from "../utils/ExtendedSelectMenu";

type Runner<InteractionType extends Interaction = Interaction > =  (client:ExtendedClient,interaction:InteractionType, ...args:string[]) => Promise<void>


export interface InteractionInterface<T extends Interaction = Interaction>{
    name:string,
    permissions?:RoleResolvable[]
    run:Runner<T>
}

export class ContextHandler{
    interactions:Collection<string , Runner> = new Collection()
    customInteractions: Collection<string , ExtendedSelectMenu> = new Collection()
    constructor(){
        this.initFiles()
    }
    private async initFiles(){
        const globPromise = promisify(glob);
        const contextFiles: string[] = await globPromise(
            `${__dirname}/../../Interactions/Context/**//*{.ts,.js}`
        );
        contextFiles.forEach(async (value: string) => {
            const file:InteractionInterface = await import(value);
            this.interactions.set(file.name, file.run)
        });
    }
}