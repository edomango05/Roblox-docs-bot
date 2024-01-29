import { EventInterface } from "../Client/handlers/eventHandler";
export = <EventInterface<"ready">>{
    name: "ready",
    async run(client) {
        /* (await client.guilds.fetch("825437201084579861")).commands.set([
            client.commandManager.commands.get("deploy")!.data
        ]);   */
        
        client.guilds.cache.forEach(async guild => {
            const guildCommands = await guild.commands.fetch();
            if (!guildCommands){
                return;
            }
            if (!guildCommands.find(command => command.name == "deploy")){
                guild.commands.set([
                    client.commandManager.commands.get("deploy")!.data
                ])
            }
        })
        console.log("Bot online")
    },
}