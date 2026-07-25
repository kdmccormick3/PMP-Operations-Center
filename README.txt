PMP OPERATIONS CENTER — PWA v3.49

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
