import { ActionRowData, ApplicationCommandAutocompleteStringOptionData, ApplicationCommandOptionType, ApplicationCommandOptionWithChoicesAndAutocompleteMixin, ChatInputApplicationCommandData, ComponentType, GuildMember, SelectMenuComponentOptionData, StringSelectMenuComponentData } from "discord.js"
import { CommandInterface } from "../../../Client/handlers/commandHandler"
import ExtendedSelectMenu from "../../../Client/utils/ExtendedSelectMenu"

export = <CommandInterface<ChatInputApplicationCommandData>>{
    data: {
        name: "mute",
        description: "timeouts user",
        options: [
            {
                name: "target",
                description: "target to be muted",
                required: true,
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "time",
                description: "timeout time",
                required: true,
                type: ApplicationCommandOptionType.Integer,
            },
            {
                name: "modifier",
                description: "time modifier",
                required: true,
                choices:[
                    {
                        name: "Minute",
                        value: 60000
                    },
                    {
                        name: "Hour",
                        value: 3600000
                    }, 
                    {
                        name: "Days",
                        value: 8.64e7
                    }
                ],
                type:ApplicationCommandOptionType.Integer
            },
            {
                name: "reason",
                description: "moderation reason",
                type:ApplicationCommandOptionType.String
            },
        ]
    },
    async run(client, interaction) {
        const member = interaction.options.getMember("target") as GuildMember
        const time = interaction.options.getInteger("time", true)
        const modifier = interaction.options.getInteger("modifier", true) 
        const reason = interaction.options.getString("reason") 
        if (!member) 
        {
            return await client.warn(interaction, {
                description: " Invalid guild member"
            })
        }
        await member.timeout(time * modifier, reason || undefined);
        await client.info(interaction, {
            description: " **user muted successfully**",
        }, {
            ephemeral: true
        })
    },
}