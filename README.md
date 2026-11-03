# ult-pickup

The pages Uplift Laundry Truck's Rapid Response emails link to:

- `confirm/#<token>`: a participant confirms they still need laundry help, or says they don't.
- `site/#<token>`: a partner laundromat's private page, listing only its own requests (first name and last initial), where it marks a card ready and records a pickup.

These are static files with no data in them. Everything is read from and written to Uplift's Google Sheet through an Apps Script web app (the `uplift-rapid-response` project), whose address is the one setting in `assets/config.js`.

## Why the pages live here and not on script.google.com

Apps Script can serve pages itself, but on phones signed into Google accounts they fail with "Sorry, unable to open the file at this time." These pages call the Apps Script API without cookies, so Google sees every visitor as signed out, which works.

## Privacy

- The token is in the `#fragment`, which browsers never send to this host or in a Referer header.
- Opening a page changes nothing. Only pressing a button does, so email link scanners can't confirm anything.
- Laundromats see first name and last initial, never a full name, email, or phone number (the page filters by the last 4 digits of a phone without displaying them).

## Moving to Uplift

1. Change `apiUrl` in `assets/config.js` to Uplift's own Apps Script deployment.
2. Optionally serve the site from Uplift's domain: add a `CNAME` file with, for example, `pickup.upliftlaundrytruck.org`, and point that name at GitHub Pages in Uplift's DNS.
3. Set `PAGES_URL` in the sheet's Settings tab to the new address.
