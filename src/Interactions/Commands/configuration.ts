import { ChatInputApplicationCommandData, ComponentType } from "discord.js"
import { CommandInterface } from "../../Client/handlers/commandHandler"
import ExtendedSelectMenu from "../../Client/utils/ExtendedSelectMenu"
export = <CommandInterface<ChatInputApplicationCommandData>>{
    data:{
        name:"configure",
        description:"configura il bot",
    },
    async run(client, interaction) {
        const selectMenu = new ExtendedSelectMenu(client, {
            type: ComponentType.StringSelect,
            customId: `configuration`,
            disabled: false,
            placeholder: "Vedi lista chiavi",
            options: client.configurationManager.configurationMap.map((_,k) => {
                return {
                    label: k,
                    value: k
                }
            })
        })
        client.info(interaction, {
            description:" **Scegli la chiave da modificare**",
        },{
            components: selectMenu.renderComponent(),
            ephemeral:true
        })
    },
}