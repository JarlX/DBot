const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { execute } = require("./play");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Durdurulan şarkıyı devam ettirir."),
    execute: async ({ client, interaction }) => {

        const queue = client.player.getQueue(interaction.guild);

        if (!queue) {
            await interaction.reply("Herhangi bir şarkı çalmıyor.");
            return;
        }

        queue.setPaused(false);

        await interaction.reply("Şarkı devam ettirildi.");

    }
}