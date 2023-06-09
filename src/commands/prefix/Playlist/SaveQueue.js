const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Playlist = require("../../../plugins/schemas/playlist.js");

const TrackAdd = [];

module.exports = {
    name: "playlist-save-queue",
    description: "Save the current queue to a playlist",
    category: "Playlist",
    usage: "<playlist_name>",
    aliases: ["pl-sq", "pl-save-queue", "pl-save"],

    run: async (client, message, args, language, prefix) => {
        

        const value = args[0]
        const Plist = value.replace(/_/g, ' ');
        const playlist = await Playlist.findOne({ name: Plist, owner: message.author.id });

        if(!playlist) return message.channel.send(`${client.i18n.get(language, "playlist", "savequeue_notfound")}`);
        if(playlist.owner !== message.author.id) return message.channel.send(`${client.i18n.get(language, "playlist", "savequeue_owner")}`);

        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.channel.send(`${client.i18n.get(language, "noplayer", "no_player")}`);

        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return message.channel.send(`${client.i18n.get(language, "noplayer", "no_voice")}`);

        const queue = player.queue.map(track => track);
        const current = player.queue.current;

        TrackAdd.push(current);
        TrackAdd.push(...queue);
        
        const embed = new EmbedBuilder()
            .setDescription(`${client.i18n.get(language, "playlist", "savequeue_saved", {
                name: Plist,
                tracks: queue.length + 1
                })}`)
            .setColor(client.color)
        message.channel.send({ embeds: [embed] });

        TrackAdd.forEach(track => {
            playlist.tracks.push(
              {
                title: track.title,
                uri: track.uri,
                length: track.length,
                thumbnail: track.thumbnail,
                author: track.author,
                requester: track.requester // Just case can push
              }
            )
        });
        playlist.save().then(() => {
            TrackAdd.length = 0;
        });
    }
}