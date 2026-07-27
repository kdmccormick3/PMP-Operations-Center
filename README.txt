PMP OPERATIONS CENTER — PWA v3.63

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

V3.56 CHANGE
Physical Count table now fits iPad portrait without horizontal scrolling.
Count columns align correctly and action buttons fit the screen.

V3.57 CHANGE
Minimums table now fits iPad portrait without horizontal scrolling.
Manufacturer, category, and unit appear beneath the product name in portrait.
Stopped the Minimums search field from automatically opening the keyboard.


V3.58 CHANGE
Technician Checkout now fits iPad portrait without horizontal scrolling.
The PDF review controls, checkout table, technician cards, and action button fit the screen.
Laptop/Desktop Technician Checkout functionality remains unchanged.


V3.59 CHANGE
Inventory History now fits iPad portrait without horizontal scrolling.
Stopped the history search field from automatically opening the iPad keyboard.

V3.60 CHANGE
Inventory History date filters now show Start Date and End Date labels.
Fixed blank-looking filter fields and Clear Filters overlap on iPad portrait and landscape.


V3.62 CHANGE
Inventory History date filters now use a stable two-row iPad landscape layout and a single-column portrait layout. Start Date, End Date, and Clear Filters no longer overlap.


V3.62 CHANGE
Constrained Inventory History date controls to their grid columns on iPad.
Clear Filters now occupies its own full-width row in landscape and portrait.


V3.63 CHANGE
Inventory History filters now use dedicated full-width rows on iPad portrait and landscape.
This removes Safari date-field overflow and keeps Clear Filters separate from End Date.

V3.64 CHANGE
Inventory History now scrolls vertically on iPad so the data table remains reachable.
Date fields keep rounded contained styling, and landscape filters fit without overlap.

V3.65 CHANGE
Added automatic iPad Warehouse Mode while preserving the full laptop/desktop application.
On iPad, Technician Usage is read-only (totals, technician directory, and checkout history); PDF upload, checkout review, and posting are hidden.
Price Review and Master Data Review are hidden on iPad because they are office workflows. Products, Order, Receive, Physical Count, Minimums, Technician Usage history, and Inventory History remain available.
Laptop and desktop retain 100% of the existing functionality.

V3.68 CHANGE
Truck Inventory now displays a dedicated button for every technician, matching the Technician Usage directory. Each technician button opens that technician's truck inventory history, including an empty-state message when no snapshots have been posted.


v3.77: Truck Inventory now opens with technician buttons first. Each technician has a dedicated upload, review, posting, value, and history workspace.


v3.71: Renamed the Technician Inventory “Technician Usage” module to “Orders” for clearer navigation. Functionality is unchanged.

v3.77: Truck Inventory now resets to the technician list whenever you leave and reopen the module, matching the Orders navigation behavior.
