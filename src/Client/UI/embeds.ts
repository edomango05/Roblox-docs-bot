import { EmbedBuilder, EmbedData } from "discord.js";

type EmojiLike = `<:${string}:${number}>`

class BasicEmbed extends EmbedBuilder{
    constructor(emoji:EmojiLike,data:EmbedData) {
        super(data)
        this.setTitle(data.title ? `${emoji} | ${data.title}` : null)
        if(data.fields) {
            this.setFields(data.fields.map(field => {
                return {
                    name:`<:greydot:1026830500360364062> ${field.name || "‎‎ ‎ ‎"}`, 
                    value: `${field.value}`, 
                    inline: field.inline
                }
            }))
        }
    }
    addHyperLinks() {

    }
}

export class Info extends BasicEmbed{
    constructor(data:EmbedData) {
        data.color = 0x8b32a8
        super("<:verified:1021892577638748190>", data)
    }
}