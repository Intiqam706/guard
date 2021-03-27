const Discord = require('discord.js');
const db = require('quick.db');

exports.run = async (client, message, args) => {
  if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply('Bu komutu kullanabilmek için `Yönetici` iznine sahip olmalısın!')
  let kullanıcılar = await db.get(`forceban_${message.guild.id}`)
  let kullanıcı = args[0];
  if(args[0] === "liste") {
    message.channel.send(new Discord.MessageEmbed().setAuthor(client.user.username + " Force Ban", client.user.avatarURL()).setColor("RANDOM").setFooter(message.guild.name, message.guild.iconURL()).setTimestamp().addField('Belirlenen Kullanıcılar', kullanıcılar ? kullanıcılar.map(x => x.slice(1)).join('\n') + "\n\nBu kullanıcılar artık sunucuya giremeyecek." : "Bulunmuyor!"))
    return
  } // LİSTE BİTİŞ
  if(!kullanıcı || isNaN(kullanıcı) || kullanıcı.length > 20 || kullanıcı.length < 10) return message.reply('Force ban atılacak/kaldırılacak kişinin ID numarasını girmelisin! (**liste** yazarak force banlara bakabilirsin)')
  if(kullanıcılar && kullanıcılar.some(id => `k${kullanıcı}` === id)) {
    db.delete(`forceban_${message.guild.id}`, `k${kullanıcı}`)
      kullanıcılar.forEach(v => {
      if (!v.includes(`k${kullanıcı}`)) {
        db.push(`forceban_${message.guild.id}`, v)
      }
      })
    message.guild.members.unban(kullanıcı)
    message.channel.send(`**${kullanıcı}** ID'li kullanıcı artık sunucuya girebilecek!`)
  } else {
    await db.push(`forceban_${message.guild.id}`, `k${kullanıcı}`)
    if(message.guild.members.cache.has(kullanıcı)) {
      await message.guild.members.cache.get(kullanıcı).send(`\`${message.guild.name}\` sunucusundan kalıcı olarak yasaklandın!`)
      await message.guild.members.ban(kullanıcı, {reason: "Forceban"})
    }
    message.channel.send(`**${kullanıcı}** ID'li kullanıcı artık sunucuya giremeyecek!`)
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['force-ban', 'hackban', 'kalıcıyasak'],
  permLevel: 0,
};

exports.help = {
  name: 'forceban',
  description: 'Belirtilen üye banlanır ve artık banı kaldırılsa bile sunucuya giremez.',
  usage: 'forceban [id]',
  kategori: 'yetkili'
};