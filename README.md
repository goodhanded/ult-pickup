# ult-pickup

The pages Uplift Laundry Truck's Rapid Response emails link to:

- `confirm/#<token>`: a participant confirms they still need laundry help, or says they don't.
- `site/#<token>`: a partner laundromat's private page, listing only its own requests (first name and last initial), one line each, where it marks a card ready and records a pickup.
- `pickup/#<code>`: the page a participant's pickup QR code opens. It shows that one request and asks them to show the screen to the laundromat staff, who record the pickup with their name.

These are static files with no data in them. Everything is read from and written to Uplift's Google Sheet through an Apps Script web app (the `uplift-rapid-response` project), whose address is the one setting in `assets/config.js`.

## Why the pages live here and not on script.google.com

Apps Script can serve pages itself, but on phones signed into Google accounts they fail with "Sorry, unable to open the file at this time." These pages call the Apps Script API without cookies, so Google sees every visitor as signed out, which works.

## Privacy

- The token is in the `#fragment`, which browsers never send to this host or in a Referer header.
- Opening a page changes nothing. Only pressing a button does, so email link scanners can't confirm anything.
- Laundromats see first name and last initial, never a full name, email, or any part of a phone number.
- A pickup code opens one request and nothing else. A laundromat page remembers its own link in the phone's browser storage, and the pickup page sends it along when a pickup is recorded, so Uplift can tell a pickup confirmed on the laundromat's phone from one confirmed on any other. Nothing depends on it.

## Branding

The pages use Uplift's own look, taken from its current logo (the washer and "Uplift" script, an image on upliftlaundrytruck.org's home page) and its site: gold `#f7a70a`, sky `#11a2fc` and sun `#ffde59`, with Manrope for headings and Poppins for text. `assets/uplift-logo.png` is that logo without its tagline; it sits on a white header in both themes because the washer window is transparent. White text is unreadable on gold or sky, so buttons are gold with dark text and headings and links use a deeper sky. The fonts are served from `assets/fonts/` (SIL Open Font License, copies beside them) rather than Google Fonts, so opening a page sends nothing to a third party. The colors are set once at the top of `assets/style.css`, for light and dark mode. (The oval "ULT" logo is older; the site still uses it as its link-preview image.)

## Moving to Uplift

1. Change `apiUrl` in `assets/config.js` to Uplift's own Apps Script deployment.
2. Optionally serve the site from Uplift's domain: add a `CNAME` file with, for example, `pickup.upliftlaundrytruck.org`, and point that name at GitHub Pages in Uplift's DNS.
3. Set `PAGES_URL` in the sheet's Settings tab to the new address.
