import { Attachment, AutocompleteInteraction, ModalSubmitInteraction } from "discord.js";
import { InteractionInterface } from "../../Client/handlers/contexHandler";


export = <InteractionInterface<AutocompleteInteraction>>{
    name: "roblox_doc_query",
    async run(client, interaction) {
        const category = interaction.options.getString("category",true)
        const value = interaction.options.getFocused()
        const response = await client.http.post("https://search-api.swiftype.com/api/v1/public/engines/search.json", {
            body: {
                "engine_key": "8yJmdrj9xxHQJcQ8NTmy",
                "q": value,
                "spelling": "retry",
                "document_types": ["article", "class", "datatype", "enum", "global", "library", "callback", "event", "function", "property", "constant", "method"],
                "filters": {
                    "article": { "Locale": "en-us" }, "class": { "Locale": "en-us" }, "codesample": { "Locale": "en-us" }, "datatype": { "Locale": "en-us" },
                    "enum": { "Locale": "en-us" }, "global": { "Locale": "en-us" },
                    "library": { "Locale": "en-us" }, "callback": { "Locale": "en-us" }, "event": { "Locale": "en-us" }, "function": { "Locale": "en-us" }, "property": { "Locale": "en-us" }, "method": { "Locale": "en-us" }, "constant": { "Locale": "en-us" }
                }
            }
        }).catch(console.error)

        if (response ) {
            interaction.respond(
                (response.body.records[category] as any[]).map(v => {
                    return {
                        name:v.Name,
                        value:v.Name 
                    }
                }).slice(0, 10)
            ).catch(console.error)
            
        }
    },
}