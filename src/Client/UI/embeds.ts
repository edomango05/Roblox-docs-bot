import { EmbedBuilder, EmbedData } from "discord.js";

type EmojiLike = `<:${string}:${number}>` | `:${string}:` | ""

class BasicEmbed extends EmbedBuilder{
    constructor(data:EmbedData, emoji:EmojiLike) {
        super(data)
        this.setTitle(data.title ? `${emoji} | ${data.title}` : null)
        this.setDescription(`${!data.title ?  emoji : ""} ${data.description}`)
        if(data.fields) {
            this.setFields(data.fields.map(field => {
                return {
                    name:`${field.name || "‎‎ ‎ ‎"}`, 
                    value: `${field.value}`, 
                    inline: field.inline
                }
            }))
        }
    }
}
export class Info extends BasicEmbed{
    constructor(data:EmbedData) {
        data.color = 0xca03fc
        super(data, "")
    }
}

export class InfoMango extends BasicEmbed{
    constructor(data:EmbedData) {
        data.color = 0xc2d91a
        super(data, ":mango:")
    }
}

export class Warn extends BasicEmbed{
    constructor(data:EmbedData) {
        data.color = 0xFFFF00
        super( data,":triangular_ruler:")
    }
}

export class ErrorEmbed extends BasicEmbed{
    constructor(error:Error) {
        super({
            color : 0xba3a0b,
            description: `${error.name !== "" ? `**${error.name}** |` : ""}__${error.message}__${error.stack!== "" ? `\n \`\`\`json\n${error.stack}\n\`\`\`` : ""}`
        },":small_red_triangle:")
    }
}