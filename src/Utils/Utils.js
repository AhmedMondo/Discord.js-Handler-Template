const event = require("events")
const { Collection } = require("discord.js")
class Util {
    constructor(bot) {
        this.client = bot
    }

    isClass(input) {
        return typeof input === 'function' &&
            typeof input.prototype === 'object' &&
            input.toString().substring(0, 5) === 'class';
    }; 

    formatDate(date) {
        let formats = {
            days: {
                0: 'Sunday',
                1: 'Monday',
                2: 'Tuesday',
                3: 'Wednesday',
                4: 'Thursday',
                5: 'Friday',
                6: 'Saturday'
            },
            month: {
                0: 'January',
                1: 'February',
                2: 'March',
                3: 'April',
                4: 'May',
                5: 'June',
                6: 'July',
                7: 'August',
                8: 'September',
                9: 'October',
                10: 'November',
                11: 'December'
            },
            date: {
                1: 'st',
                2: 'nd',
                3: 'rd',
                4: 'th',
                5: 'th',
                6: 'th',
                7: 'th',
                8: 'th',
                9: 'th',
                0: 'th'
            }
        }
        let dayOfWeek = formats.days[date.getDay()];
        let dayOfMonth = date.getDate().toString();
        let month = formats.month[date.getMonth()];
        return `${dayOfWeek} ${dayOfMonth} ${month} | ${date.toLocaleTimeString('en-US')}`;
    }

     runCooldown(message, command) {

        if (!this.client.cooldowns.has(command.name)) {
          this.client.cooldowns.set(command.name, new Collection());
        }
        const now = Date.now(); 
        const cooldowntimes = this.client.cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || this.client.defaultCooldown); 
        if (cooldowntimes.has(message.member.id)) { 
          const expirationTime = cooldowntimes.get(message.member.id) + cooldownAmount;
          if (now < expirationTime) { 
            const timeLeft = (expirationTime - now);
            return timeLeft
          }
          else {
            cooldowntimes.set(message.member.id, now); 
            setTimeout(() => cooldowntimes.delete(message.member.id), cooldownAmount); 
            return false;
          }
          
        }
        else {
          cooldowntimes.set(message.member.id, now); 
          setTimeout(() => cooldowntimes.delete(message.member.id), cooldownAmount); 
          return false;
        }
      }

    async error(interaction, error, custom = false, ephemeral = false , slash = false) {
        try {
            if(slash == true) {
                if (interaction.deferred && !interaction.replied) {
                    await interaction.editReply({ content: `An Error Occurred: \`${error.message}\`!` });
                    return custom ? await interaction.followUp({ content: `Custom Error Message: ${custom}` }) : null;
                } else if (interaction.replied) {
                    await interaction.followUp({ content: `An Error Occurred: \`${error.message}\`!` });
                    return custom ? await interaction.followUp({ content: `Custom Error Message: ${custom}` }) : null;
                } else {
                    await interaction.reply({ content: `An Error Occurred: \`${error.message}\`!\n\n\`\`\`${error.stack}\`\`\``, ephemeral });
                    return custom ? await interaction.followUp({ content: `Custom Error Message: ${custom}` }) : null;
                };
            } else {
                    await interaction.reply({ content: `An Error Occurred: \`${error.message}\`!\n\n\`\`\`${error.stack}\`\`\`` });
                    return custom ? await interaction.reply({ content: `Custom Error Message: ${custom}` }) : null;

            }

        } catch (error) {
            console.error(error);
        }
    };
}

module.exports = Util;