// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  env: 'devcf',
  // env: 'cf',
  url_base_site: 'https://devcf.celufio.mx',
  incode_apikey: '0a850696487db9faa536e1f956a138fb8a707012',
  incode_clientid: 'celucenter359',
  incode_apiurl: 'https://demo-api.incodesmile.com',
  incode_flowSaleId: '638a72001c21f556a3572ae1',
  incode_pagoAnticipado: '64d15626ffd479311be70013',
  incode_flow_gt_sale: '65cb85d060d6e13deefc6912',
  process_with_incode: false,
  process_with_nubarium: true,
  process_capture_manual: true,
  url_extends_local: true,
  incode_scoretrue: 90,
  tokensurl: 'bfb3f439053d298f06d221f735ae531cf7e3b',
  url_api_cf: 'https://apidev.celufio.mx',
  //url_api_cf: 'https://api.celufio.mx',
  url_api_cfv: 'https://validate.celufio.mx',
  url_api_cfws: 'https://aplws.celufio.mx',
  url_api_cel: 'https://api.celucenter.com',
  url_ws: 'wss://41n03a2b1e.execute-api.us-east-2.amazonaws.com/production',
  process_with_cc: 0,
  process_with_cc_value: 80,
  process_with_incode_start: 0,
  process_with_conekta: 0,
  version: '2.0.0',
  msg_alert_branch_bool: true,
  COMPANY_NAME: "payphone",
  email_contacto:"mailto:contacto@celufio.mx",
  email_cumplimiento_legal:"mailto:legalcompliance@incode.com"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
