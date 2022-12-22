const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Bir şarkı çal ")
        .addSubcommand(subcommand =>
            subcommand
                .setName("search")
                .setDescription("Şarkı aramana yarar.")
                .addStringOption(option =>
                    option
                        .setName("searchterms")
                        .setDescription("Birkaç bir şey yaz.")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("playlist")
                .setDescription("YT üzerinden playlist çal.")
                .addStringOption(option =>
                    option
                        .setName("url")
                        .setDescription("playlist url")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("song")
                .setDescription("YT şarkı çal.")
                .addStringOption(option =>
                    option
                        .setName("url")
                        .setDescription("url of the song")
                        .setRequired(true)
                )
        ),
    execute: async ({ client, interaction }) => {
        if (!interaction.member.voice.channel) {
            await interaction.reply("Bu komutu kullanabilmek için sesli kanalda olmalısınız.");
            return;
        }

        const queue = await client.player.createQueue(interaction.guild);

        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new EmbedBuilder();
        if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url");

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO,
            });

            if (result.tracks.length === 0) {
                await interaction.reply("Hiç bir şey bulunamadı!");
                return
            }

            const song = result.tracks[0]
            await queue.addTrack(song);

            embed
                .setDescription(`**[${song.title}](${song.url})** sıraya eklendi`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration : ${song.duration}` });
        }

        else if (interaction.options.getSubcommand() === "playlist") {
            let url = interaction.options.getString("url");

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST,
            });

            if (result.tracks.length === 0) {
                await interaction.reply("Hiçbir şey bulunamadı.");
                return
            }

            const playlist = result.playlist;
            await queue.addTrack(playlist);

            embed
                .setDescription(`**[${playlist.title}](${playlist.url})** sıraya eklendi.`)
                .setThumbnail(playlist.thumbnail)
                .setFooter({ text: `Duration : ${playlist.duration}` });
        }

        else if (interaction.options.getSubcommand() === "search") {
            let url = interaction.options.getString("searchterms");

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            });

            if (result.tracks.length === 0) {
                await interaction.reply("Hiçbir şey bulunamadı.");
                return
            }

            const song = result.tracks[0]
            await queue.addTrack(song);

            embed
                .setDescription(`**[${song.title}](${song.url})** sıraya eklendi.`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration : ${song.duration}` });
        }

        if (!queue.playing) await queue.play();

        await interaction.reply({
            embeds: [embed]
        })


    }
}