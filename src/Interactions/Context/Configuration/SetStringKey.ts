import { ActionRowData, Attachment, ButtonComponentData, ButtonStyle, ComponentType, ModalSubmitInteraction, TextBasedChannel } from "discord.js";
import { Config } from "../../../Client/handlers/configurationHandler";
import { InteractionInterface } from "../../../Client/handlers/contexHandler";


export = <InteractionInterface<ModalSubmitInteraction>>{
    name: "setstringkey",
    async run(client, interaction,key:keyof Config) {
        const newkey = interaction.fields.getTextInputValue('newkey');
        client.configurationManager.setData(key,newkey)
        await client.info(interaction,{
            description:"configurazione aggiornata"
        },{ephemeral:true})
    },
}