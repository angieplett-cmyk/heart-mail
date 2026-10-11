# Heart Mail 💌

A simple classroom check-in kiosk for one iPad. Students tap to report a recess or classroom problem, or use quick buttons (hungry, need to talk, upset with the teacher, don't feel well, something good).

- Static files only. No accounts, no analytics, **no student data in this repo**.
- Messages are stored only on the iPad, encrypted (RSA-OAEP + AES-GCM) with a key locked by the teacher passcode (PBKDF2).
- Optional email alert: a ping with **no names and no message content** ("New Heart Mail waiting 💌 (1 urgent)" + time) via FormSubmit or the teacher's own Google Apps Script (`relay/heart-mail-alert.gs`).
- Works offline (service worker).
