/**
 *  WebSocketClient
 * @description
 *
 */
var WebSocketClient = function (options) {
   let $this = this;
   let _private = {};
   let socket = null;
   let cmdEvents = {};

   // CodePirate System Variables
   this.options = $.extend(
      {
         host: "ws://localhost:5505",
      },
      options
   );

   /**
    * Constructor
    */
   _private.init = () => {
      $this.socket = new WebSocket($this.options.host);
      _private.eventManager();
   };

   /**
    * EventManager
    */
   _private.eventManager = () => {
      $this.socket.onopen = function (e) {
         console.log("WebSocket Connection established.");
         const timeout = () => {
            if ($this.socket.readyState == 1) {
               $this.socket.send(JSON.stringify({ type: "KEEP_ALIVE" }));
               setTimeout(timeout, 5000);
            }
         };
         timeout();
      };

      $this.socket.onmessage = function (event) {
         const json = JSON.parse(event.data);
         if (json.type.toUpperCase() === "CMD") {
            console.log(`[CMD] received from server: ${event.data}`);
            _private.emitCmd(json.cmd.toUpperCase(), json.value);
         }
      };

      $this.socket.onclose = function (event) {
         if (event.wasClean) {
            console.log(
               `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
            );
         } else {
            console.log("[close] Connection died");
         }
      };

      $this.socket.onerror = function (error) {
         console.log(`[error] ${error.message}`);
      };
   };

   /**
    * Register CMD Callback Event Listener
    * @param {*} cmd
    * @param {*} callback
    */
   this.registerCmd = (cmd, callback) => {
      if (typeof callback === "function") {
         if (typeof cmd === "object") {
            for (let index in cmd) {
               const key = cmd[index];
               if (typeof cmdEvents[key] === "undefined") {
                  cmdEvents[key] = [];
               }
               cmdEvents[key].push(callback);
            }
         } else {
            if (typeof cmdEvents[cmd] === "undefined") {
               cmdEvents[cmd] = [];
            }
            cmdEvents[cmd].push(callback);
         }
      }
   };

   /**
    * Emit CMD
    * @param {*} cmd
    * @param {*} value
    */
   _private.emitCmd = (cmd, value) => {
      cmd = cmd.toUpperCase();
      if (typeof cmdEvents[cmd] !== "undefined") {
         for (let index in cmdEvents[cmd]) {
            cmdEvents[cmd][index](value, cmd);
         }
      }
   };

   // Constructor Call
   _private.init();
};
