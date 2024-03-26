import WidgetBuilder from 'https://cdn.cbd.int/@scbd/self-embedding-component@3.1.0'// jsdeliver not working ?
import Package       from '../package.json'

// load external css for dependant components
const css = []

// ugly but required for context
const callingImportMetaUrl = import.meta.url

/*** DEV RELEASE */
//const cdnUrl = 'https://scbd-components.s3.amazonaws.com'; // only required for releasing to dev
const cdnUrl = 'https://scbd-components.s3.amazonaws.com'; 
new WidgetBuilder({ Package, css, callingImportMetaUrl }, { cdnUrl,  buildWidget: DB_WIDGET_BUILD, buildWidgetMount: DB_WIDGET_MOUNT_BUILD, buildWidgetTest: DB_WIDGET_TEST_BUILD  }) 
/*** DEV RELEASE */

/*** PROD RELEASE */
//new WidgetBuilder({ Package, css, callingImportMetaUrl }) 
/*** PROD RELEASE */