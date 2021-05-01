/**
 *     _________ __                                .____    .__                   ____. _________
 *   /   _____//  |________   ____ _____    _____ |    |   |__| ____   ____     |    |/   _____/
 *  \ _____  \\   __\_  __ \_/ __ \\__  \  /     \|    |   |  |/    \_/ __ \    |    |\_____  \
 *   /        \|  |  |  | \/\  ___/ / __ \|  Y Y  \    |___|  |   |  \  ___//\__|    |/        \
 * /_______  /|__|  |__|    \___  >____  /__|_|  /_______ \__|___|  /\___  >________/_______  /
 *       \/                   \/     \/      \/        \/       \/     \/                 \/
 */

// StreamlineJS Core Imports
const Util = require("./core/Util.js");
const config = require("./config.json");
const WebServerRestApi = require("./core/WebServerRestApi");

// Start StreamlineJS Server
const util = new Util();
util.printLogo(config.General);
util.printDescription(config.General);

// Start WebServer and REST API
const webServerRestApi = new WebServerRestApi(config.WebServerRestApi);
webServerRestApi.listening(config.WebServerRestApi.port);

webServerRestApi.addRoute("GET", "/", (req, res) => {
   res.render("index", config.General);
});
