const db = require("quick.db");
const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  if (!args[0]) {
    const embed = new Discord.MessageEmbed()
      .setColor("BLACK")
      .setTitle("Kanal Koruma sistemi!")
      .setDescription(
        ":round_pushpin:Hatalı kullanım! örnek: !kanal-koruma aç && kapat"
      );

    message.channel.send(embed);
    return;
  }
  let kanal = await db.fetch(`kanalk_${message.guild.id}`)
  if (args[0] == "aç") {
    if (kanal) {
      const embed = new Discord.MessageEmbed()
        .setColor("BLACK")
        .setTitle("kanal Koruma sistemi!")
        .setDescription(":man_facepalming:Görünüşe göre kanal koruma zaten aktif!");

      message.channel.send(embed);
      return;
    } else {
      db.set(`kanalk_${message.guild.id}`, "acik");
      const embed = new Discord.MessageEmbed()
        .setColor("BLACK")
        .setTitle("Kanal Koruma sistemi!")
        .setDescription(":white_check_mark:Kanal koruma başarıyla açıldı!");

      message.channel.send(embed);
    }
  } else if (args[0] == "kapat") {
    db.delete(`kanalk_${message.guild.id}`);
    const embed = new Discord.MessageEmbed()
      .setColor("BLACK")
      .setTitle("Kanal Koruma sistemi!")
      .setDescription(":x: Kanal Koruma başarıyla kapandı!");

    message.channel.send(embed);
  }
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["kanal-k"],
  permLevel: 2,
  kategori: "sunucu"
};

exports.help = {
  name: "kanal-koruma",
  description: "kanal koruma",
  usage: "kanal-koruma"
};