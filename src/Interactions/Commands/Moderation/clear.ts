import { ActionRowData, ApplicationCommandAutocompleteStringOptionData, ApplicationCommandOptionType, ChatInputApplicationCommandData, ComponentType, GuildTextBasedChannel, NewsChannel, SelectMenuComponentOptionData, StringSelectMenuComponentData } from "discord.js"
import { CommandInterface } from "../../../Client/handlers/commandHandler"
import ExtendedSelectMenu from "../../../Client/utils/ExtendedSelectMenu"

export = <CommandInterface<ChatInputApplicationCommandData>>{
    data: {
        name: "clear",
        description: "elimina messaggi",
        options: [{
            name: "count",
            description: "message count to delete",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }]
    },
    async run(client, interaction) {
        let count:number = interaction.options.getInteger("count", true) 
        const text_channel = interaction.channel as Exclude<GuildTextBasedChannel,NewsChannel>
        do {
            const fetched = await text_channel.messages.fetch({limit:Math.min(100, count)});
            if (fetched.size == 0) {
                break
            }
            await text_channel.bulkDelete(fetched)
            count -= fetched.size
        }
        while(count > 0);
        await client.info(interaction, {
            description: ` Cleaned **${count}** messages`,
        }, {
            ephemeral:true
        })
    },
}