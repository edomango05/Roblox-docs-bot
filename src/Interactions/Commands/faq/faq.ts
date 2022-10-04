import { ChatInputApplicationCommandData, CommandInteraction } from "discord.js";
import { CommandInterface } from "../../../Client/handlers/commandHandler"

export = <CommandInterface<ChatInputApplicationCommandData>>{
    data:{
        name:"faq",
        description:"domande frequenti",
    },
    async run(client, interaction) {
        
    },
}