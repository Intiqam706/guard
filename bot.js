const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
const db = require('quick.db');
require('./util/eventLoader')(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);

client.once('ready', () => { //Client hazır olduğunda
    console.log('Bot hazır!'); //Konsola "Bot hazır!" yazdır
    client.user.setActivity("Blood ✨ Loz 'Bey'i", { //Bot hesabının aktivitesini "Bu bot da Discord'a katıldı" olarak ayarla.
    type: "WATCHING" //Aktivite tipi: Oynuyor
  });
});

// - ROL KORUMA - \\
client.on("roleDelete", async(role) => {
    const entry = await role.guild.fetchAuditLogs({
        type: 'ROLE_DELETE'
    }).then(audit => audit.entries.first());
    let yetkili = entry.executor;
    let cezaliRolu = "807320648401551381";
    let logKanali = "816710279495680040";
    await role.guild.member(yetkili).roles.set([cezaliRolu]);
    let yeniRol = await role.guild.roles.create({
      data:{
        name: role.name,
        color: role.color,
        hoist: role.hoist,
        position: role.position,
        permissions: role.permissions,
        mentionable: role.mentionable
      }
      });
    role.guild.channels.cache.get(logKanali).send(new Discord.MessageEmbed().setTimestamp().setDescription(`${yetkili} kişisi bir rol sildi ve cezalıya atıldı!\nRolü tekrar açtım ve üyelerine vermeye başladım!`));
    let mesaj = await role.guild.channels.cache.get(logKanali).send(new Discord.MessageEmbed().setDescription(`${role.name} adlı rol verilmeye başlanıyor!`));
    setTimeout(() => {
        let veri = roleDefender[role.id];
        let index = 0;
        setInterval(() => {
            veri = roleDefender[role.id];
            let kisi = role.guild.members.cache.get(veri.Üyeler[index]);
            try {
                kisi.roles.add(yeniRol, "Koruma meydana geldi");
            } catch (err) {};
            mesaj.edit(new Discord.MessageEmbed().setDescription(`${kisi} adlı üyeye ${yeniRol} rolü verildi!`));
            index++;
        }, 2000);
    }, 5000);
});
// Alosha & Yashinu tarafından, Discord.JS dersinde yazılmıştır. Paylaşılması yasaktır!
const roleDefender = {};
client.on("guildMemberUpdate", async(oldMember, newMember) => {
    oldMember.roles.cache.forEach(async role => {
        if (newMember.roles.cache.some(r => r.id == role.id)) return;
        if (!roleDefender[role.id]) {
            roleDefender[role.id] = {
                Rol: role,
                Üyeler: [newMember.id],
                Silindi: false
            };
        } else {
            roleDefender[role.id].Üyeler.push(newMember.id);
        };
    });
});
// - ROL KORUMA - \\

// - FORCEBAN - \\
client.on("guildMemberAdd", async(member) => {
  let djstürkiye = await db.get(`forceban_${member.guild.id}`)
  if(djstürkiye && djstürkiye.some(id => `k${member.user.id}` === id)) {
    try {
      await member.guild.owner.user.send(new Discord.MessageEmbed().setTimestamp().setFooter(client.user.username + " Force Ban", client.user.avatarURL()).setDescription(`Bir kullanıcı **${member.guild.name}** adlı sunucuna girmeye çalıştı! Force banı olduğu için tekrar yasaklandı. \n**Kullanıcı:** ${member.user.id} | ${member.user.tag}`))
      await member.user.send(new Discord.MessageEmbed().setTimestamp().setFooter(client.user.username + " Force Ban", client.user.avatarURL()).setDescription(`**${member.guild.name}** sunucusundan force banlı olduğun için yasaklandın!`))
      member.members.ban({reason: 'Forceban'})
    } catch(err) { console.log(err) }
  }
})
// - FORCEBAN - \\

// - KANAL KORUMA - \\
client.on('channelDelete', (channel) => {
    if(db.has(`kanalk_${channel.guild.id}`) === false) return;
    let kategoriID = channel.parentID;
    channel.clone({ name: channel.name, reason: 'izinsiz silindi.' }).then(channels => {
    channels.setParent(channel.guild.channels.cache.find(channelss => channelss.id === kategoriID));
    channels.send(`Bu kanal silindi ve kanal koruma sistemi sayesinde başarıyla tekrardan açıldı!\nKanalın adı, kanalın konusu, kanalın kategorisi, kanalın izinleri başarıyla ayarlandı.`);                     
  }); 
});
// - KANAL KORUMA - \\