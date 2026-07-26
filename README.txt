PMP OPERATIONS CENTER — PWA v3.55

This package is the current working PMP HTML converted into an installable
Progressive Web App shell.

FILES
- index.html              Existing PMP application
- manifest.webmanifest    App name, icons, and install behavior
- service-worker.js       Offline app-shell caching
- icons/                  Home-screen and app icons

IMPORTANT
The PWA must be hosted on HTTPS. Opening index.html directly from Google Drive
or from the Files app will not activate the service worker or installation.

CURRENT DATA BEHAVIOR
This version still uses browser localStorage, exactly like the current HTML.
Each device will initially maintain its own data. Shared synchronized inventory
will be added in the cloud-data phase after the hosted PWA is confirmed working.

NEXT STEP
Upload this folder to a web host and publish it. Then open the HTTPS address on
the laptop, iPad, and phone.

V3.50 CHANGE
Fixed Count Date / Counted By overlap on iPad portrait Physical Count screen.

V3.51 CHANGE
Fixed Products screen layout overflow on iPad portrait.
Stopped Products search from automatically opening the keyboard.

V3.52 CHANGE
Products table now fits iPad portrait without horizontal scrolling.
Manufacturer, category, and unit appear beneath the product name in portrait.


V3.53 CHANGE
Order Inventory now fits iPad portrait with correctly aligned columns.
Stopped the Order search field from automatically opening the iPad keyboard.

V3.54 CHANGE
Receive Inventory now fits iPad portrait without horizontal scrolling.
Stopped the Receive search field from automatically opening the keyboard.


V3.55 CHANGE
Price Review now fits iPad portrait without horizontal scrolling.
Manufacturer, last-seen date, and order number appear beneath the product name in portrait.
