import { ActionRowData, AnySelectMenuInteraction, Attachment, ChannelSelectMenuComponentData, ComponentType, ModalActionRowComponentData, ModalSubmitInteraction, RoleSelectMenuComponentData, StringSelectMenuInteraction, TextInputStyle } from "discord.js";
import { Config } from "../../../Client/handlers/configurationHandler";
import { InteractionInterface } from "../../../Client/handlers/contexHandler";
import ExtendedSelectMenu from "../../../Client/utils/ExtendedSelectMenu";


export = <InteractionInterface<StringSelectMenuInteraction>>{
    name: "next",
    async run(client, interaction, direction, customId) {
        const parsed = parseInt(direction)
        if (isNaN(parsed)) return;
        const menu = client.contextManager.customInteractions.get(customId)
        if (!menu) return;
        menu.nextTo(parsed as 1 | -1);
        await interaction.update({
            embeds: [interaction.message.embeds[0]],
            components:menu.renderComponent(),
        })
    },
}