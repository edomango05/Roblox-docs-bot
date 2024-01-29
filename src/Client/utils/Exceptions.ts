export enum EnumExceptions { 
    MissingPermissions = "Don't have permission!",
    BadConfig = "Configuration compromised",
    DidNotRetriveNextTag = "Cannot get info about roblox document module"
}

export class BotException extends Error { 
    constructor(ex:EnumExceptions){
        super(ex)
        this.name = ""
        this.stack = ""
    }
}