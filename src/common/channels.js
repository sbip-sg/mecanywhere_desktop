const Channels = {
  OPEN_LINK_PLEASE: 'openLinkPlease',
  OPEN_WINDOW: 'message:loginShow',
  STORE_GET: 'electron-store-get',
  STORE_SET: 'electron-store-set',
  APP_CLOSE_INITIATED: 'app-close-initiated',
  APP_CLOSE_CONFIRMED: 'app-close-confirmed',
  APP_RELOAD_INITIATED: 'app-reload-initiated',
  APP_RELOAD_CONFIRMED: 'app-reload-confirmed',
  START_CONSUMER: 'start-consumer',
  STOP_CONSUMER: 'stop-consumer',
  JOB_RECEIVED: 'job-received',
  JOB_RESULTS_RECEIVED: 'job-results-received',
  REGISTER_CLIENT: 'register-client',
  CLIENT_REGISTERED: 'client-registered',
  DEREGISTER_CLIENT: 'deregister-client',
  OFFLOAD_JOB: 'offload-job',
};

export default Channels;
