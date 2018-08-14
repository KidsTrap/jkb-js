exports.run = async function (client, msg, args) {

    if (guilds[msg.channel.guild.id].queue.length === 0)
        return msg.channel.createMessage({ embed: {
            color: config.options.embedColour,
            title: 'Nothing is queued.'
        }});

    const dmc = await msg.author.getDMChannel()
        .catch(() => null);

    if (!dmc) return msg.channel.createMessage({ embed: {
        color: config.options.embedColour,
        title: 'There was an error fetching a DM channel.'
    }});

    if (args[0] && args[0] === '-q') {
        const m = await msg.channel.createMessage({ embed: {
            color: config.options.embedColour,
            title: 'Compiling queue...'
        }});

        const queue = guilds[msg.channel.guild.id].queue.map(s => `${s.title} (${s.permalink})`).join('\r\n');

        dmc.createMessage('', {
            name: 'queue.txt',
            file: Buffer.from(queue, 'utf8')
        })
            .then(() => {
                m.edit({ embed: {
                    color: config.options.embedColour,
                    title: 'You have been DM\'d the queue.'
                }});
            })
            .catch(err => {
                m.edit({ embed: {
                    color: config.options.embedColour,
                    title: err.message
                }});
            });
    } else {
        const song = guilds[msg.channel.guild.id].queue[0];

        dmc.createMessage({ embed: {
            color: config.options.embedColour,
            title: song.title,
            url  : song.permalink
        }});
    }
};

exports.usage = {
    main: '{prefix}{command}',
    args: '[-q]',
    description: 'DMs you info about the currently playing song (or queue, if \'-q\' is specified)'
};
