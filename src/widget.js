import WidgetBuilder from 'https://cdn.cbd.int/@scbd/self-embedding-component@3.1.0'// jsdeliver not working ?
import Package       from '../package.json'

// load external css for dependant components
const css = []

// ugly but required for context
const callingImportMetaUrl = import.meta.url

/*** DEV RELEASE */
const cdnUrl = 'https://scbd-components.s3.amazonaws.com'; // only required for releasing to dev

new WidgetBuilder({ Package, css, callingImportMetaUrl }, { cdnUrl }) 
/*** DEV RELEASE */

/*** PROD RELEASE */
//new WidgetBuilder({ Package, css, callingImportMetaUrl }) 
/*** PROD RELEASE */