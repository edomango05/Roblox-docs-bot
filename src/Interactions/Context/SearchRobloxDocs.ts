import { Attachment, AutocompleteInteraction, ModalSubmitInteraction } from "discord.js";
import { InteractionInterface } from "../../Client/handlers/contexHandler";
import axios from "axios"

export = <InteractionInterface<AutocompleteInteraction>>{
    name: "roblox_doc_query",
    async run(client, interaction) {
        const category = interaction.options.getString("category", true)
        const value = interaction.options.getFocused()
        if (value.length < 2) {
            await interaction.respond([])
            return;
        }
        
        const isSubType = (category !== "property" && category !== "event" && category !== "method")
        const response = await axios.post("https://apis.roblox.com/creator-resources-search-api/v1/search/docsite", {
            documentationContentType: "",
            documentationSubType: isSubType ? category : "class",
            documentationThirdType: isSubType ? "" : category,
            isFuzzyMatch: false,
            keyword: value,
            locale: "en-US",
            pageSize: 10,
            tag: ""
        })
        if (response) {
            await interaction.respond(
                (response.data.results as any[]).map(v => {
                    return {
                        name: v.title,
                        value: `${v.resultTargetReference}$${v.documentationSubType}$${v.documentationThirdType}`
                    }
                }).slice(0, 10)
            )
        }
    },
}