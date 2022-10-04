import { ActivityType, Client, EmbedData, GatewayIntentBits, Guild, InteractionReplyOptions, RepliableInteraction } from "discord.js"
import { CommandHandler } from "./handlers/commandHandler"
import { ContextHandler } from "./handlers/contexHandler"
import { EventHandler } from "./handlers/eventHandler"
import { Info } from "./UI/embeds"
import { HttpExtendedClient } from "./utils/http"

export class ExtendedClient extends Client {
    eventManager: EventHandler = new EventHandler(this)
    contextManager: ContextHandler = new ContextHandler()
    commandManager: CommandHandler = new CommandHandler()
    http: HttpExtendedClient = new HttpExtendedClient()
    guild!: Guild

    constructor() {
        super({
            failIfNotExists: false,
            presence: {
                status: "online",
                afk: false,
                activities: [{
                    name: "I hate", 
                    type: ActivityType.Playing
                }],
            },
            intents: [
                GatewayIntentBits.Guilds
            ]
        })
        this.login(process.env.DISCORD_TOKEN);
        
    }
    
    info(ctx:RepliableInteraction,data:EmbedData, other?:InteractionReplyOptions){
        ctx.reply({
            embeds:[
                new Info(data)
            ], 
            ...other
        })
    }
}