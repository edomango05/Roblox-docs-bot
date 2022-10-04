import { EventInterface } from "../Client/handlers/eventHandler";


export = <EventInterface>{
    name:"ready",
    async run(client) {
        client.guild = await client.guilds.fetch(process.env.GUILD_ID!)!
        console.log("Bot is ready")
    },
}