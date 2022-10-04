import { ActionRow, ActionRowData, ApplicationCommandAttachmentOption, ApplicationCommandOptionType, ChatInputApplicationCommandData, ComponentType, ModalActionRowComponent, ModalActionRowComponentData, TextInputStyle } from "discord.js"
import { CommandInterface } from "../../Client/handlers/commandHandler"

export = <CommandInterface<ChatInputApplicationCommandData>>{
    data: {
        name: "deploy",
        description: "aggiorna i comandi"
    },
    async run(client, interaction) {
        client.commandManager.deploy(client)
        client.info(interaction, {
            title:"Inviata richiesta al server"
        })
    },
}