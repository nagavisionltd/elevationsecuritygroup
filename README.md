# Elevation Security Group — cPanel deployment

This is a self-contained static website with a PHP enquiry endpoint. It is intended for standard cPanel / WHM hosting, not Cloudflare Pages or a Lovable runtime.

## Deploy
1. In cPanel, open **File Manager** and enter the domain's document root (usually `public_html`).
2. Back up the existing website.
3. Upload the ZIP package and extract it directly into that document root. The `index.html` file must sit directly inside the document root, not inside an extra nested folder.
4. Confirm the hosting account runs a supported PHP version (PHP 8.0+ recommended) and that PHP `mail()` is enabled and configured.
5. Submit a test enquiry and confirm delivery to `info@elevationsecuritygroup.co.uk`. Check spam/junk and the hosting mail logs if needed.

## Included
- `index.html` and `gallery.html`
- `assets/site.css`, `assets/site.js`, `assets/gallery.js`
- Existing local `images/` and `gallery/` media
- `send_mail.php` for the contact form
- `.htaccess` basic security and directory-index rules

## Important security note
The previous repository contained an unauthenticated arbitrary file-write endpoint (`bridge.php`) and scripts with a hard-coded WHM API token. Those files have been removed from this deployment. **Rotate/revoke the exposed WHM API token immediately** in WHM; deleting it from the current repository does not erase it from historical Git commits. Review cPanel/WHM access logs for unexpected activity.

## Email
The contact form uses PHP `mail()` and sends to `info@elevationsecuritygroup.co.uk`. Delivery depends on the server's mail configuration and domain authentication (SPF/DKIM/DMARC). The form's success message confirms the server accepted the mail function, not that the recipient inbox has received it. Test delivery before announcing the site.

## Media
All image and video references are local relative paths. Keep the `images/` and `gallery/` directories alongside the HTML files. The hero video is muted and loops; the poster image is used as a fallback.
