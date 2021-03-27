const Discord = require('discord.js');

exports.run = async (client, message) => {
  const yasak = client.emojis.cache.get('811958245094326372');
  const elmas = client.emojis.cache.get('810500929236500510');
  const onay = client.emojis.cache.get('816747101803380786');
      message.delete()
  const embed = new Discord.MessageEmbed()
     .setColor('RANDOM')
    .setDescription(`
 ${elmas}***<@${message.author.id}> Yardımcı Oluyoruz Size :)***
${elmas} ** Force Ban Komutu: \`.forceban [İD]\`**
${elmas} ** Force Ban Liste Komutu: \`.forceban liste\`**
${elmas} ** Ban Bilgisi Komutu: \`.ban-bilgi [İD]\`**

${elmas} ** Temizle Komutu: \`.temizle [MİKTAR]\`**
${elmas} ** Jail Komutu: \`.jail [ETİKET] [SÜRE] [SEBEP]\`**
${elmas} ** Kanal Koruma Komutu: \`.kanal-koruma aç/kapat\`**

${elmas} Kanal Koruma Sistemi ${onay}
${elmas} Rol Koruma Sistemi ${onay}
${elmas} Force Ban Uyarı Sistemi ${onay}

`,true)
        .setFooter(`Umarım Yardımcı Olabilmişimdir...`)
message.channel.send(embed).then(message => {setTimeout(() => {message.delete()}, 60000);message.react('810500661829042176')})  
  
};

exports.conf = {
  enabled: true,
  aliases: ['teyardım'],
  permLevel: 0,
};

exports.help = {
  name: "koruma-yardım",
  description: "Bot bulunduğunuz odaya girer.",
  usage: "koruma-yardım",
};