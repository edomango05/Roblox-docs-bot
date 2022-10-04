import { ChatInputApplicationCommandData } from "discord.js"
import { CommandInterface } from "../../Client/handlers/commandHandler"

export = <CommandInterface<ChatInputApplicationCommandData>>{
    data:{
        name:"test",
        description:"testa cose assurde inutili"
    },
    async run(client, interaction) {
        client.info(interaction, {
            title:"Test",
            description:"cmd inutile"
        })
    },
}