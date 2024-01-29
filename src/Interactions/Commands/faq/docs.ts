import { ApplicationCommandAutocompleteStringOptionData, ApplicationCommandChoicesOption, ApplicationCommandOptionType, ChatInputApplicationCommandData, CommandInteraction } from "discord.js";
import { CommandInterface } from "../../../Client/handlers/commandHandler"
import * as cheerio from 'cheerio';
import axios from "axios";
import { BotException, EnumExceptions } from "../../../Client/utils/Exceptions";

const CategoryToEmojie: any = {
    class: "<:class:1200811225978777640>",
    method: "<:method:1200811190926966824>",
    function: "<:method:1200811190926966824>",
    library: "📚",
    enum: "<:enum:1200811329389351015>",
    property: "<:prop:1200811142126260234>",
    event: "<:event:1200811267208781924>",
    article: "<:studio:1200811655525834812>",
    datatype: "<:enum:1200811329389351015>",
    global: "<:lua:1200973084816060538>"
}

function recursiveAddString(obj: any, isPrev?: boolean, blockListing?: boolean): string {
    let result = ""
    if (obj.children && obj.tagName !== "thead") {
        for (const value of obj.children) {
            if (value["children"]) {
                if (value.tagName === "thead") continue;
                const recursiveArray = recursiveAddString(value, isPrev || value.tagName === "pre", blockListing)
                result = result.concat(" ", recursiveArray)
            }
            
            if (value.type === "text") {
                if (isPrev) {
                    result = result.concat(" ", `\`\`\`lua\n${value.value}\`\`\``)
                    continue
                } else if (obj.tagName === "code") {
                    result = result.concat(" ", `\`${value.value}\``)
                    continue
                } else if (obj.tagName === "strong" || obj.tagName === "h2" || obj.tagName === "h3" || obj.tagName === "h4") {
                    result = result.concat(" ", `**${value.value}**`)
                    continue
                } else if (obj.tagName === "li" && !blockListing) {
                    result = result.concat(" ", `※ ${value.value}`)
                    blockListing = true
                    continue
                }
                result = result.concat(" ", value.value)
            }
        }
        return result === "undefined" ? ""  : result
    }
    result = result.concat(" ", obj.value)
    return result === "undefined" ? "" : result
}
export = <CommandInterface<ChatInputApplicationCommandData>>{
    data: {
        name: "docs",
        description: "search for roblox docs",
        options: [
            <ApplicationCommandChoicesOption>{
                type: ApplicationCommandOptionType.String,
                name: "category",
                description: "choose your branch",
                choices: [
                    {
                        name: "Articles",
                        value: "article"
                    },
                    {
                        name: "Classes",
                        value: "class"
                    },
                    {
                        name: "Enums",
                        value: "enum"
                    },
                    {
                        name: "Methods",
                        value: "method"
                    },
                    {
                        name: "Events",
                        value: "event"
                    },
                    {
                        name: "Properties",
                        value: "property"
                    },
                    {
                        name: "DataTypes",
                        value: "datatype"
                    },
                    {
                        name: "Libraries",
                        value: "library"
                    },
                    {
                        name: "Globals",
                        value: "global"
                    },
                ],
                required: true
            },
            <ApplicationCommandAutocompleteStringOptionData>{
                type: ApplicationCommandOptionType.String,
                autocomplete: true,
                name: "roblox_doc_query",
                description: "query search",
                required: true
            }
        ]
    },
    async run(client, interaction) {
        const query = interaction.options.getString("roblox_doc_query", true).split("$")
        const route = query[0]
        const response = await axios.get(`https://create.roblox.com/docs${route}`)
        const category = (query[2] === "" ? query[1] : query[2]).toLowerCase()
        if (response && response.data) {
            const parsedHtml = cheerio.load(response.data)
            const nextContent = parsedHtml("#__NEXT_DATA__").html()
            if (!nextContent) {
                await client.error(interaction, new BotException(EnumExceptions.DidNotRetriveNextTag))
                return 
            }
            const jsonContent = JSON.parse(nextContent)
            const embedContentArray = [`${((category && CategoryToEmojie[category]) ? CategoryToEmojie[category] : "")} [${route.split("/").pop()}](https://create.roblox.com/docs${route}) `]
            const splitted = route.split("/").pop()!
            if (jsonContent.props.pageProps.data.apiReference) {
                switch (category) {
                    case "method":
                        {
                            const name = splitted.replace("#", ":")
                            const foundMethod = jsonContent.props.pageProps.data.apiReference.methods.find((v: any) => v.name === name)
                            if (foundMethod.tags) {
                                embedContentArray.push(foundMethod.tags.join(" / ") + (foundMethod.threadSafety ? (" / " + foundMethod.threadSafety ):  ""))
                            }
                            if (foundMethod.deprecationMessage !== "") {
                                embedContentArray.push(recursiveAddString(foundMethod.deprecationMessage))
                            }
                            embedContentArray.push(`**${name}(${foundMethod.parameters.map((v: any) => `${v.name}: ${v.type}`).join(", ")}) -> ${foundMethod.returns.map((v: any) => `${v.type}`).join(" & ")}**`)
                            embedContentArray.push(recursiveAddString(foundMethod.description))
                            break;
                        }
                    case "function":
                        {
                            const name = query[1] === "Global" ? splitted.split("#").pop() : splitted.replace("#", ".")
                            const foundMethod = jsonContent.props.pageProps.data.apiReference.functions.find((v: any) => v.name === name)
                            
                            embedContentArray.push(`**${name}(${(foundMethod.parameters || []).map((v: any) => `${v.name}: ${v.type}`).join(", ")}) -> ${foundMethod.returns.map((v: any) => `${v.type}`).join(" & ")}**`)
                            embedContentArray.push(foundMethod.description)
                            break;
                        }
                    case "event":
                        {
                            const name = splitted.replace("#", ".")
                            const foundEvent = jsonContent.props.pageProps.data.apiReference.events.find((v: any) => v.name === name)
                            if (foundEvent.tags) {
                                embedContentArray.push(foundEvent.tags.join(" / ") + (foundEvent.threadSafety ? (" / " + foundEvent.threadSafety ):  ""))
                            }
                            if (foundEvent.deprecationMessage !== "") {
                                embedContentArray.push(recursiveAddString(foundEvent.deprecationMessage))
                            }
                            embedContentArray.push(`**${name}(${foundEvent.parameters.map((v: any) => `${v.name}: ${v.type}`).join(", ")}) ->  RBXScriptSignal**`)
                            embedContentArray.push(recursiveAddString(foundEvent.description))
                            break;
                        }
                    case "property":
                        {
                            const name = query[1] === "Global" ? splitted.split("#").pop() : splitted.replace("#", ".")
                            const foundProperty = jsonContent.props.pageProps.data.apiReference.properties.find((v: any) => v.name === name)
                            if (foundProperty.tags) {
                                embedContentArray.push(foundProperty.tags.join(" / ") + (foundProperty.threadSafety ? (" / " + foundProperty.threadSafety ):  ""))
                            }
                            if (foundProperty.deprecationMessage && foundProperty.deprecationMessage !== "") {
                                embedContentArray.push(recursiveAddString(foundProperty.deprecationMessage))
                            }
                            embedContentArray.push(recursiveAddString(foundProperty.description))
                            break;
                        }
                    case "enum":
                        {
                            const foundEnum = jsonContent.props.pageProps.data.apiReference.items.map((v: any) => `**${v.name}**     (${v.value})     ${v.summary}`)
                            embedContentArray.push(foundEnum.join("\n"))
                            break;
                        }
                    default:
                        {
                            embedContentArray.push(recursiveAddString(jsonContent.props.pageProps.data.apiReference.description))
                            break;
                        }
                }
            } else {
                embedContentArray.push(jsonContent.props.pageProps.data.description)
            }

            if (embedContentArray.join('\n').length > 4000) {
                embedContentArray.pop()
                embedContentArray.push(recursiveAddString(jsonContent.props.pageProps.data.apiReference.summary))
            }
            await client.info(interaction, {
                description: embedContentArray.join('\n')
            })
        }
    },
}
