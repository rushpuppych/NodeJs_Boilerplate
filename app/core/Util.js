const chalk = require("chalk");
const figlet = require("figlet");
const chunk = require("chunk-text");

const Util = function () {
   /**
    * Printing The StreamLine Logo
    */
   this.printLogo = (config) => {
      const logoText = config.logoText;
      const data = figlet.textSync(logoText, {}).split("\r\n");

      console.log(
         chalk.blue.bold(
            "============================================================================================="
         )
      );
      for (let i in data) {
         console.log(chalk.blue(data[i]));
      }
      console.log(
         chalk.blue.bold(
            "============================================================================================="
         )
      );
   };

   /**
    * Printing The StreamLine Description
    */
   this.printDescription = (config) => {
      console.log(
         chalk.white.bold("      AUTHOR: ") +
            config.author +
            " - " +
            config.contact
      );
      console.log(chalk.white.bold("     PRODUCT: ") + config.product);
      console.log(chalk.white.bold("     VERSION: ") + config.version);
      console.log(chalk.white.bold("     LICENCE: ") + config.licence);
      console.log(chalk.white.bold("  REPOSITORY: ") + config.repository);

      const chunks = chunk(config.description, 75);
      for (let i in chunks) {
         if (i == 0) {
            console.log(chalk.white.bold(" DESCRIPTION: ") + chunks[i]);
         } else {
            console.log("              " + chunks[i]);
         }
      }
      console.log(" ");
      for (let i in config.hyperlinks) {
         const link = config.hyperlinks[i];
         const environment =
            link.name + " - " + chalk.underline.green(link.url);
         if (i == 0) {
            console.log(chalk.white.bold("ENVIRONMENTS: ") + environment);
         } else {
            console.log("              " + environment);
         }
      }
      console.log(
         chalk.blue.bold(
            "============================================================================================="
         )
      );
   };
};
module.exports = Util;
