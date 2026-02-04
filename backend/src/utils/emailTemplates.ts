
/**
 * Premium Email Templates for Asset Index
 * Stone/Brown Aesthetic - #D6D0C7 / #1A110D
 */

const STYLES = {
  body: `background-color: #D6D0C7; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 40px 0; -webkit-text-size-adjust: none;`,
  container: `max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(26, 17, 13, 0.05);`,
  header: `padding: 40px; background-color: #1A110D; text-align: center;`,
  headerLogo: `color: #D6D0C7; font-size: 24px; font-weight: 800; letter-spacing: -0.05em; margin: 0; text-transform: uppercase;`,
  content: `padding: 40px;`,
  h1: `color: #1A110D; font-size: 28px; font-weight: 700; line-height: 1.2; margin: 0 0 20px 0; letter-spacing: -0.02em;`,
  p: `color: #3A2A22; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;`,
  buttonContainer: `text-align: center; margin: 32px 0;`,
  button: `background-color: #1A110D; color: #D6D0C7; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block; letter-spacing: 0.05em; text-transform: uppercase;`,
  assetBox: `background-color: #F7F6F4; border-radius: 16px; padding: 24px; margin-bottom: 24px; list-style: none;`,
  assetItem: `margin-bottom: 16px; border-bottom: 1px solid #E8E5E0; padding-bottom: 16px;`,
  assetItemLast: `margin-bottom: 0; border-bottom: none; padding-bottom: 0;`,
  assetTitle: `font-weight: 700; color: #1A110D; margin-bottom: 4px; display: block;`,
  assetDesc: `font-size: 14px; color: #6B5D55; margin: 0;`,
  footer: `padding: 32px 40px; background-color: #F7F6F4; text-align: center;`,
  footerText: `color: #9C928D; font-size: 12px; line-height: 1.5; margin: 0;`,
};

function EmailWrapper(content: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Asset Index</title>
    </head>
    <body style="${STYLES.body}">
      <div style="${STYLES.container}">
        <div style="${STYLES.header}">
          <h1 style="${STYLES.headerLogo}">Asset Index</h1>
        </div>
        <div style="${STYLES.content}">
          ${content}
        </div>
        <div style="${STYLES.footer}">
          <p style="${STYLES.footerText}">
            &copy; ${new Date().getFullYear()} Asset Index Protocol. All rights reserved.<br>
            Secure documentation and digital legacy management.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Template for inactivity warning
 */
export const getWarningEmail = (userName: string, checkInUrl: string) => {
  const content = `
    <h1 style="${STYLES.h1}">Action Required: <br/>Security Verification</h1>
    <p style="${STYLES.p}">Hello ${userName},</p>
    <p style="${STYLES.p}">This is an automated security protocol from Asset Index. We noticed you haven't checked in recently according to your security schedule.</p>
    <p style="${STYLES.p}">Please confirm your status to ensure your asset disclosure remains secure and inactive.</p>
    <div style="${STYLES.buttonContainer}">
      <a href="${checkInUrl}" style="${STYLES.button}">Validate Activity</a>
    </div>
    <p style="${STYLES.p}">If you do not check in within your specified grace period, your designated legacy protocol will be initialized.</p>
  `;
  return EmailWrapper(content);
};

/**
 * Template for asset disclosure
 */
export const getDisclosureEmail = (ownerName: string, assets: { name: string, instructions: string, level: string }[]) => {
  const assetItems = assets.map((asset, index) => `
    <li style="${index === assets.length - 1 ? STYLES.assetItemLast : STYLES.assetItem}">
      <span style="${STYLES.assetTitle}">${asset.name}</span>
      <p style="${STYLES.p}; font-size: 13px; margin-bottom: 8px;">Permisson: <strong>${asset.level}</strong></p>
      <p style="${STYLES.assetDesc}">${asset.instructions}</p>
    </li>
  `).join('');

  const content = `
    <h1 style="${STYLES.h1}">Legacy Protocol Initialized</h1>
    <p style="${STYLES.p}">You are receiving this communication because you have been designated as a trusted contact by <strong>${ownerName}</strong>.</p>
    <p style="${STYLES.p}">Due to extended inactivity, the following asset access protocols have been released to you as instructed:</p>
    <ul style="${STYLES.assetBox}">
      ${assetItems}
    </ul>
    <p style="${STYLES.p}">Please treat this information with extreme confidentiality. These instructions are provided as part of a pre-defined legacy plan.</p>
  `;
  return EmailWrapper(content);
};
