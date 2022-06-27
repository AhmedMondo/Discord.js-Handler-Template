const { MessageActionRow, MessageButton } = require('discord.js');


class ButtonPaginator {

    constructor(client) {
        this.client = client;

    }

    init() {
        this.client.classLoader.push('[ClassLoader] ButtonPaginator loaded');
    }

async start (msg, pages, slash = false, timeout = 120000) {
    if (!msg && !msg.channel) throw new Error("Channel is inaccessible.");
    if (!pages) throw new Error("Pages are not given.");
    const button1 = new MessageButton()
    .setCustomId('firstbtn')
    .setLabel('<<')
    .setStyle('SUCCESS');
    const button2 = new MessageButton()
    .setCustomId('backbtn')
    .setLabel('<')
    .setStyle('SUCCESS');
    const button3 = new MessageButton()
    .setCustomId('finishbtn')
    .setLabel('❌') 
   // .setEmoji('❌')
    .setStyle('DANGER');
const button4 = new MessageButton()
    .setCustomId('nextbtn')
    .setLabel('>')
    .setStyle('SUCCESS');
    const button5 = new MessageButton()
    .setCustomId('lastbtn')
    .setLabel('>>')
    .setStyle('SUCCESS');


    let buttonList = [button1, button2, button3 , button4 , button5]

    let page = 0;
  
    const row = new MessageActionRow().addComponents(buttonList);
    const curPage = await msg.reply({
      embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
      components: [row],
    });
  
    const filter = (i) =>
      i.customId === buttonList[0].customId ||
      i.customId === buttonList[1].customId ||
      i.customId === buttonList[2].customId ||
      i.customId === buttonList[3].customId ||
      i.customId === buttonList[4].customId;
      let collector
      if(slash = true) {
       collector = await msg.channel.createMessageComponentCollector({
          filter,
          time: timeout,
        });
      } else {
         collector = await curPage.channel.createMessageComponentCollector({
          filter,
          time: timeout,
        });
      }

  
    collector.on("collect", async (i) => {
      switch (i.customId) {
        case buttonList[0].customId:
          if (page !== 0) {
            page = 0
        }

          break;
        case buttonList[1].customId:
            page = page > 0 ? --page : pages.length - 1;
          break;
          case buttonList[2].customId:
            collector.stop()
          break;
          case buttonList[3].customId:
            page = page + 1 < pages.length ? ++page : 0;
          break;
          case buttonList[4].customId:
            if (page !== pages.length - 1) {
                page = pages.length - 1;
            }
          break;
        default:
          break;
      }
      await i.deferUpdate();
      await i.editReply({
        embeds: [pages[page].setFooter(`${i.customId == 'finishbtn' ? 'Ended!' : `Page ${page + 1} / ${pages.length}`}`)],
        components: [row],
      });
      collector.resetTimer();
    });
  
    collector.on("end", () => {

      
      if (slash == false && !curPage.deleted) {
        const disabledRow = new MessageActionRow().addComponents(
          buttonList[0].setDisabled(true),
          buttonList[1].setDisabled(true),
          buttonList[2].setDisabled(true),
          buttonList[3].setDisabled(true),
          buttonList[4].setDisabled(true)
        );
        if(slash == true) {
          msg.editReply({
            embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length} Ended`)],
            components: [disabledRow],
          });
        } else {
          curPage.edit({
            embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length} Ended`)],
            components: [disabledRow],
          });
        }

      }
    });
  
    return curPage;
  };


}

module.exports = ButtonPaginator