import { type Client, BaseCommand, registerCommands, registerEvents } from "../../core";
import { type ChatInputCommandInteraction } from "../../core/types";
import { postSlashCommands } from "../../core/util";

export default class extends BaseCommand {
  constructor(client: Client) {
    super(client, (data) =>
      data
        .setName("reload")
        .setDescription("Reload command")
        .addSubcommand((subCommand) => subCommand.setName("commands").setDescription("Reload commands"))
        .addSubcommand((subCommand) => subCommand.setName("events").setDescription("Reload events"))
        .addSubcommand((subCommand) => subCommand.setName("post").setDescription("Reload Posting commands"))
    );
  }

  async run(interaction: ChatInputCommandInteraction): Promise<void> {
    const subCmd = interaction.options.getSubcommand(true);
    await interaction.deferReply({ ephemeral: true });

    switch (subCmd) {
      case "commands":
        try {
          await registerCommands(this.client);
          interaction.editReply({ content: "Se recargaron los comandos exitosamente" });
        } catch (err) {
          console.error(err);
          interaction.editReply({ content: "Ocurrio algo inesperado al recargar los comandos" });
        }
        break;
      case "events":
        try {
          await registerEvents(this.client);
          interaction.editReply({ content: "Se recargaron los eventos exitosamente" });
        } catch (err) {
          console.error(err);
          interaction.editReply({ content: "Ocurrio algo inesperado al recargar los eventos" });
        }
        break;
      case "post":
        try {
          postSlashCommands(this.client);
          interaction.editReply({ content: "Se se recargaron los comandos(post) exitosamente" });
        } catch (err) {
          console.error(err);
          interaction.editReply({ content: "Ocurrio algo inesperado al recargar los comandos(post)" });
        }
        break;
    }
  }
}
