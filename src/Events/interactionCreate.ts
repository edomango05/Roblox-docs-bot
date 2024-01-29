import { Interaction } from "discord.js";
import { EventInterface } from "../Client/handlers/eventHandler";


export = <EventInterface<"interactionCreate">>{
    name: "interactionCreate",
    async run(client, interaction: Interaction) {
        
        if (interaction.isChatInputCommand() || interaction.isMessageContextMenuCommand() || interaction.isUserContextMenuCommand()) {
            const command = client.commandManager.commands.get(interaction.commandName);
            if (!command) return;
            try {
                await command.run(client, interaction);
            } catch (error) {
                console.error(error);
                if (error instanceof Error) {
                    await client.error(interaction, error);
                }
            }
            return
        }
        if (interaction.isAutocomplete()) {
            const focusedOption = interaction.options.getFocused(true);
            const ctx = client.contextManager.interactions.get(focusedOption.name);
            if (!ctx) return;
            try {
                await ctx(client, interaction);
            } catch (error) {
                console.log(error);
            }
            return
        }
        const [id, args] = interaction.customId.split(/:(.*)/s)
        const command = client.contextManager.interactions.get(id);
        if (!command) return;
        try {
            await command(client, interaction, ...(args || "").split(",") );
        } catch (error) {
            if (error instanceof Error) {
                await client.error(interaction, error);
            }
            console.log(error)
        }
    },
}