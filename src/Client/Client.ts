import { ActivityType, Client, Collection, EmbedData, GatewayIntentBits, Guild, InteractionReplyOptions, MessageCreateOptions, RepliableInteraction, Webhook } from "discord.js"
import { CommandHandler } from "./handlers/commandHandler"
import { ContextHandler } from "./handlers/contexHandler"
import { ClientToServerEvents, EventHandler, ServerToClientEvents } from "./handlers/eventHandler"
import { ConfigurationHandler } from "./handlers/configurationHandler"

import { ErrorEmbed, Info, Warn } from "./UI/embeds"
// making extented client to automate some functions
export class ExtendedClient extends Client {
    // caching data to avoid excessive amount of requests
    static cache: Collection<string,Webhook> = new Collection()
    // sets up an utility I made that handles configurations in json format
    configurationManager:ConfigurationHandler = new ConfigurationHandler()
    // handlers for events and interactions (with a specific file format and typing)
    eventManager: EventHandler = new EventHandler(this)
    contextManager: ContextHandler = new ContextHandler()
    commandManager: CommandHandler = new CommandHandler()
    constructor() {
        //calling discord js Client constructor
        super({
            failIfNotExists: false,
            presence: {
                status: "dnd",
                afk: false,
                activities: [{
                    name: "Mango", 
                    type: ActivityType.Streaming
                }],
            },
            intents: [GatewayIntentBits.Guilds]
        })
        // making the bot login in the gateway
        this.login(process.env.DISCORD_TOKEN).catch(console.error);
    }
    // next methods implement an automated way for repling with error / warning / info embeds ( templates I made for uniformity )
    info(ctx:RepliableInteraction,data:EmbedData, other?:InteractionReplyOptions){
        return ctx.reply({
            embeds:[
                new Info(data)
            ], 
            ...other
        })
    }
    editInfo(ctx:RepliableInteraction,data:EmbedData, other?:InteractionReplyOptions){
        return ctx.editReply({
            embeds:[
                new Info(data)
            ], 
            ...other
        })
    }
    editWarn(ctx:RepliableInteraction,data:EmbedData, other?:InteractionReplyOptions){
        return ctx.editReply({
            embeds:[
                new Warn(data)
            ], 
            ...other
        })
    }
    warn(ctx:RepliableInteraction,data:EmbedData, other?:InteractionReplyOptions){
        return ctx.reply({
            embeds:[
                new Warn(data)
            ], 
            ...other
        })
    }
    // method for a query (sends the best result in a list of strings)
    bestResults(input:string, all:string[]){
        const first = all.filter(v => v.toLowerCase().includes(input))
        return first.length >= 25 ? first.slice(0, 24) : first
    }

    error(ctx:RepliableInteraction,error:Error){
        return ctx.reply({
            embeds:[
                new ErrorEmbed(error)
            ], 
            ephemeral:true
        })
    }
    async sendWebhook(url:string,data:EmbedData, other?:MessageCreateOptions){
        //fetch and send data to webhook
        const splittedstring = url.split("/")
        const webhook = await this.fetchWebhook(splittedstring[splittedstring.length - 2],splittedstring[splittedstring.length - 1])
        if (!webhook) return;
        return webhook.send({
            embeds:[
                new Info(data)
            ], 
            ...other
        })
    }
    async sendWebhookById(guild:Guild,id:string,data:EmbedData, other?:MessageCreateOptions){
        const webhooks = await guild.fetchWebhooks()
        const hook = webhooks.find(w=>w.id === id)
        return hook?.send({
            embeds:[
                new Info(data)
            ], 
            ...other
        })
    }
    edit(ctx:RepliableInteraction,data:EmbedData, other?:InteractionReplyOptions){
        return ctx.editReply({
            embeds:[
                new Info(data)
            ], 
            ...other
        })
    }
}

