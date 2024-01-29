import { ApplicationCommandData, ApplicationCommandDataResolvable, ChatInputApplicationCommandData, ChatInputCommandInteraction, ClientEvents, Collection, CommandInteraction, CommandInteractionResolvedData, Guild, MessageInteraction, UserApplicationCommandData, UserContextMenuCommandInteraction } from "discord.js";
import { ExtendedClient } from "../Client";
import glob from "glob"
import { promisify } from "util";

type Runner<InteractionType = ChatInputCommandInteraction> =  (client:ExtendedClient,interaction:InteractionType) => Promise<void>
type FromDataToInteractionType<DataType extends ApplicationCommandData> = DataType extends ChatInputApplicationCommandData
    ? ChatInputCommandInteraction
    : (DataType extends UserApplicationCommandData ? UserContextMenuCommandInteraction : MessageInteraction)

export interface CommandInterface<T extends ApplicationCommandData = ApplicationCommandData>{
    data:T,
    run:Runner<FromDataToInteractionType<T>>
}

export class CommandHandler{
    commands:Collection<string , CommandInterface> = new Collection()
    constructor(){
        this.initFiles()
    }
    private async initFiles(){
        const globPromise = promisify(glob);
        const commandFiles: string[] = await globPromise(
            `${__dirname}/../../Interactions/Commands/**//*{.ts,.js}`
        );
        commandFiles.forEach(async (value: string) => {
            const file:CommandInterface = await import(value);
            this.commands.set(file.data.name, file)
        });
    }
    async deploy(guild:Guild, commands:ApplicationCommandDataResolvable[]){
        guild.commands.set([
            this.commands.get("deploy")!.data,
            ...commands
        ])
    }
}