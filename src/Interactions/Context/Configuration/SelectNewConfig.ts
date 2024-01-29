import { AnySelectMenuInteraction, Attachment, ModalSubmitInteraction, StringSelectMenuInteraction } from "discord.js";
import { Config } from "../../../Client/handlers/configurationHandler";
import { InteractionInterface } from "../../../Client/handlers/contexHandler";


export = <InteractionInterface<AnySelectMenuInteraction>>{
    name: "selectnewkey",
    async run(client, interaction,key:keyof Config) {
        const isArray = client.configurationManager.getData(key) instanceof Array
        client.configurationManager.setData(key,isArray ? interaction.values as never[] : interaction.values[0])
        await client.info(interaction,{
            description:"configurazione aggiornata"
        },{ephemeral:true})
    },
}