import { ActionRow, ActionRowData, ApplicationCommandAttachmentOption, ApplicationCommandOptionType, ChatInputApplicationCommandData, ChatInputCommandInteraction, ComponentType, ModalActionRowComponent, ModalActionRowComponentData, TextInputStyle } from "discord.js"
import { CommandInterface } from "../../../Client/handlers/commandHandler"

export = <CommandInterface<ChatInputApplicationCommandData>>{
    data: {
        name: "build",
        description: "send messages embed",
        options: [
            <ApplicationCommandAttachmentOption>{
                type: ApplicationCommandOptionType.Attachment,
                name: "attachment",
                description:"file"
            }
        ]
    },
    async run(client, interaction) {
        const attachment = interaction.options.getAttachment("attachment")
        console.log(attachment?.url)
        await interaction.showModal({
            customId: `build_modal:${attachment?.url.substring(49) || ""}`,
            title: "Build",
            components: [
                <ActionRowData<ModalActionRowComponentData>>{
                    type:ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.TextInput,
                            customId: "title_input",
                            style: TextInputStyle.Short,
                            label: "Titolo",
                            minLength: 1,
                            required:true,
                            placeholder: "Inserisci il titolo dell\'embed",
                        },
                    ]
                },
                <ActionRowData<ModalActionRowComponentData>>{
                    type:ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.TextInput,
                            customId: "description_input",
                            style: TextInputStyle.Paragraph,
                            label: "Descrizione",
                            placeholder: "Inserisci la descrizione dell\'embed",
                        }
                    ]
                }
            ]
        })
    },
}