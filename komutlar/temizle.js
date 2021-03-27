const Discord = require('discord.js');
exports.run = function (client, message, args) {
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(":x: Yetersiz İzin Hatası. Bu Komut İçin Mesajları Yönet Yetkim Olması Gerekiyor");
  if (!args[0]) return message.channel.send("Silinecek mesajın miktarını yaz!");
  if (args[0] > 100) return message.channel.send("Hoopp! Maksimum 100 Tane Silebilirsin.!").then(message => {setTimeout(() => {message.delete()}, 60000);message.react('810500661829042176')})  
  message.delete()
  message.channel.bulkDelete(args[0]).then(() => {
    message.channel.send(`:white_check_mark: ${args[0]} tane mesaj silindi`)
  })
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['clear'],
  permLevel: 1
};

exports.help = {
  name: 'temizle',
  description: 'Belirlenen miktarda mesajı siler.',
  usage: 'temizle '
};