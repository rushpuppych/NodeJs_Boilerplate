/**
 * Jitsi Wrapper
 * This Simple Jitsi Wrapper is using the Jitsi RTC Service to establish a easy way for HTML5 WebCam Meetings.
 * https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-ljm-api
 * https://github.com/jitsi/lib-jitsi-meet/blob/master/doc/example/example.js
 */
const JitsiClient = function (opt) {
   let $this = this;
   let _private = {
      isConnected: false,
      connection: null,
      room: null,
      tracks: {
         local: null,
         users: null,
         moderator: null,
      },
   };
   let options = Object.assign(
      {
         prefix: "",
         displayName: "test",
         token: null,
         connectionOptions: {
            hosts: {
               domain: "localhost:8443",
               muc: "conference.",
            },
            bosh: "https://localhost:8443/http-bind",
            clientNode: "https://localhost:8443/jitsimeet",
         },
         roomOptions: {},
      },
      typeof opt == "undefined" ? {} : opt
   );

   // Constructor
   this.init = () => {
      window.JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
      window.JitsiMeetJS.init();
   };

   /**
    * Connect to Jitsi
    */
   this.connect = () => {
      let connection = new JitsiMeetJS.JitsiConnection(
         null,
         options.token,
         options.connectionOptions
      );
      connection.addEventListener(
         JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
         $this.onConnectionSuccess
      );
      connection.addEventListener(
         JitsiMeetJS.events.connection.CONNECTION_FAILED,
         $this.onConnectionFailed
      );
      connection.addEventListener(
         JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
         $this.onDisconnect
      );
      connection.connect();
      _private.connection = connection;
   };

   /**
    * Jitsi Callback OnConnectionSuccess
    */
   this.onConnectionSuccess = () => {
      alert("CONEECTION");
      console.log("Success");
      _private.isConnected = true;
   };

   /**
    * Jitsi Callback OnConnectionFailed
    */
   this.onConnectionFailed = () => {
      console.log("Failed");
      _private.isConnected = false;
   };

   /**
    * Jitsi Callback OnDisconnect
    */
   this.onDisconnect = () => {
      console.log("Disconnect");
      _private.isConnected = false;
   };

   /**
    * Joining a Jitsi Connference
    */
   this.join = (roomName, roomPassword) => {
      if (!_private.isConnected) {
         return false;
      }
      let room = connection.initJitsiConference(
         options.prefix + "_" + roomName,
         options.roomOptions
      );
      room.on(JitsiMeetJS.events.conference.TRACK_ADDED, $onRemoteTrack);
      room.on(
         JitsiMeetJS.events.conference.CONFERENCE_JOINED,
         $onConferenceJoined
      );
      JitsiMeetJS.createLocalTracks().then($onLocalTracks);
      room.join(roomPassword);
      _private.room = room;
      return true;
   };

   /**
    * Jitsi Callback onRemoteTrack
    */
   this.onRemoteTrack = (track) => {
      console.log("Remote Track");
      const userId = track.getParticipantId();
      const type = track.getType();
      if (typeof _private.tracks.users[userId][type] !== "array") {
         _private.tracks.users[userId][type] = [];
      }
      _private.tracks.users[userId][type].push(track);
      _private.tracks.moderator[userId][type].push(track);
   };

   /**
    * Jitsi Callback onLocalTracks
    */
   this.onLocalTracks = (track) => {
      console.log("Local Tracks");
      _private.room.addTrack(track);
      const type = track.getType();
      if (typeof _private.tracks.local[userId][type] !== "array") {
         _private.tracks.local[type] = [];
      }
      _private.tracks.local[type].push(track);
   };

   /**
    * Jitsi Callback onConferenceJoined
    */
   this.onConferenceJoined = () => {
      console.log("Conference Joined");
      alert("CONFERENCE");
      _private.room.setDisplayName(options.displayName);
   };

   $this.init();
};
