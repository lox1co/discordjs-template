/* eslint-disable quotes */
/* eslint-disable no-eval */
const { Command } = require("../../client");
const { codeBlock } = require("discord.js");
const { inspect } = require("util");

module.exports = class EvalCommand extends Command {
  constructor(client) {
    super(client, (data) =>
      data
        .setName("eval")
        .setDescription("Evalua codigo.")
        .addStringOption((opt) => opt.setName("codigo").setDescription("El codigo a evaluar.").setRequired(true))
        .addBooleanOption((opt) => opt.setName("async").setDescription("El codigo es asyncrono?").setRequired(false))
        .addBooleanOption((opt) => opt.setName("return").setDescription("Añadir return a la ultima linea?").setRequired(false))
    );
  }

  async run(interaction) {
    if (!this.client.config.owners.includes(interaction.user.id)) {
      return await interaction.reply({ content: "No eres un dueño del bot para usar este comando!" });
    }
    const code = interaction.options.getString("codigo", true);
    const asyncCode = interaction.options.getBoolean("async") ?? false;
    const addReturn = interaction.options.getBoolean("return");
    const codeToEvaluate = code
      .replace(/[“”]/gim, '"')
      .replace(/[‘’]/gim, "'")
      .split(/;\s/g)
      .map((ln, i, a) => {
        if (Boolean(addReturn) && i === a.length - 1 && !ln.includes("return")) return "return " + ln.trim();
        return ln.trim();
      })
      .join(";\n");
    const evaluated = asyncCode
      ? eval(`(async () => { try { ${codeToEvaluate} } catch(err) { return err }})()`)
      : eval(`(() => { try { ${codeToEvaluate} } catch(err) { return err }})()`);

    const content = await this.inspect(evaluated, interaction.createdTimestamp);
    return await interaction.reply({ content });
  }

  async inspect(content, timestamp, err = false) {
    let isPromise = false;
    if (content instanceof Promise) {
      isPromise = true;
      content = await content;
    }
    const time = Date.now() - timestamp;
    const constructor = isPromise ? `Promise<${content?.constructor?.name}>` : content?.constructor?.name;
    const bar = `\`${constructor}\` - \`${time}ms\`\n`;
    const maxLength = 2000 - bar.length;
    if (typeof content !== "string") content = inspect(content, { depth: 0 });
    content = content.replace(this.client.token, "[noTokenForYou]");
    this.client.token?.split(".").forEach((t) => (content = content.replace(t, "[noTokenForYou]")));
    content.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    content = content.slice(0, maxLength);
    return bar + codeBlock(err ? "prolog" : "js", content);
  }
};
