import { Attachment, ModalSubmitInteraction } from "discord.js";
import { InteractionInterface } from "../../Client/handlers/contexHandler";


export = <InteractionInterface<ModalSubmitInteraction>>{
    name: "build_modal",
    async run(client, interaction, url) {
        const title = interaction.fields.getTextInputValue('title_input');
        const description = interaction.fields.getTextInputValue('description_input');
        client.info(interaction, {
            description:`:small_blue_diamond: **${title}**\n ${description}`,
            
        }, {
            files: url ? [{
                attachment: "https://cdn.discordapp.com/ephemeral-attachments/" + url,
            }] : [],
        })
    },
}