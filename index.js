console.clear(); // Clear Console

require('dotenv').config();
const Discord = require("discord.js");
const intents = new Discord.Intents(32767);
const {
    MessageEmbed
} = require('discord.js');
const {
    on
} = require('nodemon');
const request = require('request');
const client = new Discord.Client({
    intents
});
const PREFIX = "!";
client.on("ready", () => console.log("Cfx Finder | Bot started!"));

client.on("messageCreate", message => {
    if (message.guild)
        if (message.content.startsWith(PREFIX)) {
            const [CMD_NAME, ...args] = message.content
                .trim()
                .substring(PREFIX.length)
                .split(/\s+/);
            if (CMD_NAME === "cfx") {
                if (args.length === 0) {

                    // Error mesage (Only the "!cfx" command was send)!
                    // People usually say "Don't touch if you don't know what you are doing!", but touch all you want, is the only way to learn!
                    const embed = new MessageEmbed()
                        .setAuthor('Cfx Finder', 'https://avatars.githubusercontent.com/u/58943239?v=4')
                        .addField('Please enter a cfx address!', 'Example: !cfx 6lgqdd')
                        .setColor("#08d665")
                        .setFooter("Enjoy Using")
                    return message.channel.send({
                        embeds: [embed]
                    })
                }

                // Request to fivem server api (https://servers-frontend.fivem.net/api/servers/single/cfx)
                request.get({
                    url: `https://servers-frontend.fivem.net/api/servers/single/${args[0]}`,
                    json: true,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0'
                    }
                }, (err, res, data) => {
                    if (err) {
                        console.log('Error:', err);
                    } else if (res.statusCode !== 200) {

                        // Error mesage (Api did not response with statuscode 200)
                        const embed = new MessageEmbed()
                            .setAuthor('Cfx Finder', 'https://avatars.githubusercontent.com/u/58943239?v=4')
                            .addField('Cfx Address is unavaible!', 'Please try again later...')
                            .setColor("#08d665")
                            .setFooter("Enjoy Using")
                        return message.channel.send({
                            embeds: [embed]
                        })

                    } else {

                        // Some shit json i think.. idk, got it to work i guess
                        var iplort = data['Data']['connectEndPoints']['0'];
                        if (iplort.startsWith("http")) {
                            var serverAddress = 'Server is cfx protected!'
                            var ip = 'Cfx Protected!'
                            var port = 'Cfx Protected!'
                        } else {
                            var serverAddress = data['Data']['connectEndPoints']['0']
                            var splitAddresse = serverAddress.split(":")
                            var ip = splitAddresse[0]
                            var port = splitAddresse[1]
                        }

                        if (data['Data']['vars']['onesync_enabled'] === 'true') {
                            var onesync = 'Enabled'
                        } else {
                            var onesync = 'Disabled'
                        }

                        // Another shit api request to some api lookup.
                        request.get({
                            url: `http://ip-api.com/json/${ip}`,
                            json: true,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0'
                            }
                        }, (error, response, dataip) => {
                            if (error) {
                                console.log('Error:', error);
                            } else if (response.statusCode !== 200) {

                                // Idk, still working i guess
                                var country = 'Timeout'
                                var isp = 'Timeout'
                                var city = 'Timeout'

                                // Embed dog shit
                                const embed = new MessageEmbed()
                                    .setAuthor('Cfx Finder', 'https://avatars.githubusercontent.com/u/58943239?v=4')
                                    .addField(':electric_plug: Server Address & Port :electric_plug:', `\`\`\`${serverAddress}\`\`\``)
                                    .addField(':earth_africa: Network Information :earth_africa:', `▸Server Cfx | \`${args[0]}\`\n▸Server Address | \`${ip}\`\n▸Server Port | \`${port}\``)
                                    .addField(':link: Server Information :link:', `▸Online Players | \`${data['Data']['clients']}/${data['Data']['sv_maxclients']}\`\n▸Gamebuild | \`${data['Data']['vars']['sv_enforceGameBuild']}\`\n▸Onesync | \`${onesync}\``)
                                    .addField(':mag_right: IP Information :mag_right:', `▸Country | \`${country}\`\n▸ISP | \`${isp}\`\n▸City | \`${city}\``)
                                    .setColor("#08d665")
                                    .setFooter("Enjoy Using")
                                return message.channel.send({
                                    embeds: [embed]
                                })

                            } else {
                                if (dataip['country'] === undefined) {
                                    var country = 'Timeout'
                                    var isp = 'Timeout'
                                    var city = 'Timeout'
                                } else {
                                    var country = dataip['country']
                                    var isp = dataip['isp']
                                    var city = dataip['city']
                                }

                                const embed = new MessageEmbed()
                                    .setAuthor('Cfx Finder', 'https://avatars.githubusercontent.com/u/58943239?v=4')
                                    .addField(':electric_plug: Server Address & Port :electric_plug:', `\`\`\`${serverAddress}\`\`\``)
                                    .addField(':earth_africa: Network Information :earth_africa:', `▸Server Cfx | \`${args[0]}\`\n▸Server Address | \`${ip}\`\n▸Server Port | \`${port}\``)
                                    .addField(':link: Server Information :link:', `▸Online Players | \`${data['Data']['clients']}/${data['Data']['sv_maxclients']}\`\n▸Gamebuild | \`${data['Data']['vars']['sv_enforceGameBuild']}\`\n▸Onesync | \`${onesync}\``)
                                    .addField(':mag_right: IP Information :mag_right:', `▸Country | \`${country}\`\n▸ISP | \`${isp}\`\n▸City | \`${city}\``)
                                    .setColor("#08d665")
                                    .setFooter("Enjoy Using")
                                return message.channel.send({
                                    embeds: [embed]
                                })
                            }
                        })
                    }
                });
            }
        }
});

client.login(process.env.TOKEN);
