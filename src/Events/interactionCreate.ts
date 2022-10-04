import { Interaction } from "discord.js";
import { EventInterface } from "../Client/handlers/eventHandler";


export = <EventInterface>{
    name: "interactionCreate",
    async run(client, interaction: Interaction) {
        if (interaction.isChatInputCommand() || interaction.isMessageContextMenuCommand() || interaction.isUserContextMenuCommand()) {
            const command = client.commandManager.commands.get(interaction.commandName);
            if (!command) return;
            try {
                await command.run(client, interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Errore durante l\'esecuzione del comando!', ephemeral: true });
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
               
            }
            return
        }
        const [id, args] = interaction.customId.split(/:(.*)/s)
        const command = client.contextManager.interactions.get(id);
        if (!command) return;
        try {
            await command(client, interaction, ...args.split(","));
        } catch (error) {
            await interaction.reply({ content: 'Errore durante l\'esecuzione del comando!', ephemeral: true });
        }
    },
}