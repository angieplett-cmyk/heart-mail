/**
 * Heart Mail email alert relay (Google Apps Script). Optional backup to FormSubmit.
 * It only ever emails ONE fixed address with a fixed message:
 * "New Heart Mail waiting (N urgent)" + time. It never receives or sends
 * student names or anything a student typed. Nothing is stored.
 *
 * Setup: script.google.com > New project > paste this > Save >
 * Deploy > New deployment > type "Web app" > Execute as: Me >
 * Who has access: Anyone > Deploy > Authorize > copy the Web app URL
 * (ends in /exec) into Heart Mail > Settings > Email alerts > "my Google Script".
 */
const TO = "aplett@greeleyschools.org";   // the only address this script will email
const MAX_PER_DAY = 40;                    // safety limit so nobody can flood your inbox

function doPost(e) {
  let n = 1, u = 0, test = false;
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    n = Math.max(1, Math.min(99, parseInt(d.n, 10) || 1));
    u = Math.max(0, Math.min(n, parseInt(d.u, 10) || 0));
    test = d.test === true;
  } catch (err) {}
  const props = PropertiesService.getScriptProperties();
  const today = Utilities.formatDate(new Date(), "America/Denver", "yyyy-MM-dd");
  const key = "count-" + today, used = parseInt(props.getProperty(key) || "0", 10);
  if (used >= MAX_PER_DAY) return reply({ ok: false, error: "Daily alert limit reached." });
  props.setProperty(key, String(used + 1));
  const when = Utilities.formatDate(new Date(), "America/Denver", "EEE MMM d, h:mm a");
  const subject = test ? "Heart Mail test alert 💌" : "New Heart Mail waiting 💌" + (u ? " (" + u + " urgent)" : "");
  const body = test
    ? "This is a test from Heart Mail. Alerts are working! (" + when + ")"
    : "You have " + n + " new Heart Mail message" + (n === 1 ? "" : "s") + " on the classroom iPad" +
      (u ? " (" + u + " urgent)" : "") + ". Alert sent " + when + ". Open Heart Mail to read " + (n === 1 ? "it" : "them") + ".";
  MailApp.sendEmail({ to: TO, subject: subject, body: body, name: "Heart Mail" });
  return reply({ ok: true });
}
function doGet() { return reply({ ok: true, app: "heart-mail-relay" }); }
function reply(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
