import { ActionRowData, ChannelSelectMenuComponentData, ComponentType, Interaction, ModalActionRowComponentData, StringSelectMenuInteraction, TextInputStyle } from "discord.js";
import { Config } from "../../../Client/handlers/configurationHandler";
import { InteractionInterface } from "../../../Client/handlers/contexHandler";
import { BotException, EnumExceptions } from "../../../Client/utils/Exceptions";
import ExtendedSelectMenu from "../../../Client/utils/ExtendedSelectMenu";

const Options = {
    [20]: async (interaction: Interaction) => {
        const webhooks = await interaction.guild?.fetchWebhooks()
        if (!webhooks) return;
        return webhooks.map(webhook => {
            return {
                description: `canale ${webhook.channel?.name}`,
                label: webhook.name,
                value: webhook.id,
            }
        })
    }
}


export = <InteractionInterface<StringSelectMenuInteraction>>{
    name: "configuration",
    async run(client, interaction) {
        const key = interaction.values[0] as keyof Config
        const conf = client.configurationManager.configurationMap.get(key)!
        switch (conf.type) {
            case 0:
                await interaction.showModal({
                    customId: `setstringkey:${key}`,
                    title: "Modifica chiave",
                    components: [
                        <ActionRowData<ModalActionRowComponentData>>{
                            type: ComponentType.ActionRow,
                            components: [
                                {
                                    type: ComponentType.TextInput,
                                    customId: "newkey",
                                    style: TextInputStyle.Short,
                                    label: key,
                                    required: true,
                                    placeholder: "Inserisci il valore",
                                },
                            ]
                        },
                    ]
                })
                break
            case 20:
                const all = await Options[conf.type](interaction)
                if (!all) return;
                const selectMenu = new ExtendedSelectMenu(client, {
                    type: ComponentType.StringSelect,
                    customId: `selectnewkey:${key}`,
                    disabled: false,
                    placeholder: "Vedi lista",
                    ...conf.metadata,
                    options: all
                })
                await client.info(interaction, {
                    description: " **Scegli**",
                }, {
                    components: selectMenu.renderComponent(),
                    ephemeral: true
                })
                break
            default:

                const isArray = conf.data instanceof Array
                await client.info(interaction, {
                    description: "**Scegli la chiave da modificare**",
                }, {
                    components: [
                        <ActionRowData<ChannelSelectMenuComponentData>>{
                            type: ComponentType.ActionRow,
                            components: [
                                {
                                    type: conf.type,
                                    customId: `selectnewkey:${key}`,
                                    minValues: 1,
                                    maxValues: isArray ? 10 : 1,
                                    placeholder: "Seleziona",
                                    ...conf.metadata
                                },
                            ]
                        },
                    ],
                    ephemeral: true
                })
        }
    },
}