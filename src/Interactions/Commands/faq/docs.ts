import { ApplicationCommandAutocompleteStringOptionData, ApplicationCommandChoicesOption, ApplicationCommandOptionType, ChatInputApplicationCommandData, CommandInteraction } from "discord.js";
import { CommandInterface } from "../../../Client/handlers/commandHandler"



const CategoryToPath:any = {
    class : "docs/reference/engine/classes/",
    enum: "docs/reference/engine/enums/",
    method: "docs/reference/engine/classes/",
    property: "docs/reference/engine/classes/",
    event: "docs/reference/engine/classes/"
}

function plural(str:string){
    return str === "property" ? "properties" : str + "s" 
}


const CategoryToEmojie:any = {
    class : "<:class:1026931075223658570>", 
    method : "<:method:1026932872914931873>",
    enum: "<:interface:1026931995542032444>",
    property: "<:property:1026932401705848953> ",
    event: "<:event:1026937063112708146> "
}

export = <CommandInterface<ChatInputApplicationCommandData>>{
    data:{
        name: "docs",
        description: "search for roblox docs",
        options: [
            <ApplicationCommandChoicesOption>{
                type: ApplicationCommandOptionType.String,
                name: "category",
                description:"choose your branch", 
                choices:[
                    {
                        name:"Articoli",
                        value:"article"
                    },
                    {
                        name:"Classi",
                        value:"class"
                    },
                    {
                        name:"Enumerabili",
                        value:"enum"
                    },
                    {
                        name:"Metodi",
                        value:"method"
                    },
                    {
                        name:"Eventi",
                        value:"event"
                    },
                    {
                        name:"Property",
                        value:"property"
                    },
                ],
                required : true
            }, 
            <ApplicationCommandAutocompleteStringOptionData>{
                type: ApplicationCommandOptionType.String,
                autocomplete:true,
                name: "roblox_doc_query",
                description:"query search",
                required : true
            }
        ]
    },
    async run(client, interaction) {
        const path = interaction.options.getString("category",true)
        const route = interaction.options.getString("roblox_doc_query",true)
        const response = await client.http.post("https://search-api.swiftype.com/api/v1/public/engines/search.json", {
            body: {
                "engine_key": "8yJmdrj9xxHQJcQ8NTmy",
                "q": route,
                "spelling": "retry",
                "document_types": [path],
                "filters": {
                    "article": { "Locale": "en-us" }, "class": { "Locale": "en-us" }, "codesample": { "Locale": "en-us" }, "datatype": { "Locale": "en-us" },
                    "enum": { "Locale": "en-us" }, "global": { "Locale": "en-us" },
                    "library": { "Locale": "en-us" }, "callback": { "Locale": "en-us" }, "event": { "Locale": "en-us" }, "function": { "Locale": "en-us" }, "property": { "Locale": "en-us" }, "method": { "Locale": "en-us" }, "constant": { "Locale": "en-us" }
                }
            }
        }).catch(console.error)
        if (response) {
            const info = (response.body.records[path] as any[]).find(v=>v.Name === route)

            let sample:string = ""
            if ( path !== "enum" && path !== "class"&& path!=="article")  { 
                const other = await client.http.get(`https://create.roblox.com/docs/_next/data/jK4n7jMNoksUI-Rw2ZH2Z/reference/engine/classes/${info.ContentIdentifier}.json`)
                
                if (other) {
                    console.log(other.body.pageProps.data.apiReference[plural(path)])
                    const found:any = other.body.pageProps.data.apiReference[plural(path)].find((v:any)=> v.name === route)
                    console.log(found)
                    sample = found && found.codeSamples && found.codeSamples[0] ?  found.codeSamples[0].codeSample :  ""
                }
            }
            client.info(interaction,{
                description:`${CategoryToEmojie[path] || ""} [${route.split("/").pop()}](https://create.roblox.com/${CategoryToPath[path] || ""}${route.replace(":", "#").replace(".", "#")})${info.Summary ?`\n${info.Summary}` : ""}${sample ? `\n\`\`\`lua\n${sample}\`\`\`` : ""}`
            })
        }
    },
}