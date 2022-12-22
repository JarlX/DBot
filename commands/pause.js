const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { execute } = require("./play");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Çalan şarkıyı duraklatır."),
    execute: async ({ client, interaction }) => {

        const queue = client.player.getQueue(interaction.guild);

        if (!queue) {
            await interaction.reply("Herhangi bir şarkı çalmıyor.");
            return;
        }

        queue.setPaused(true);

        await interaction.reply("Şarkı duraklatıldı.");

    }
}