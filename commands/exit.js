const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { execute } = require("./play");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("exit")
        .setDescription("Ses kanalından çıkar."),
    execute: async ({ client, interaction }) => {

        const queue = client.player.getQueue(interaction.guild);

        if (!queue) {
            await interaction.reply("Herhangi bir şarkı çalmıyor.");
            return;
        }

        queue.destroy();

        await interaction.reply("Dövüş mü istiyorsun. Cmon!🥊");

    }
}