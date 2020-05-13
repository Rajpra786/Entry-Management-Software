# Entry Management System

## Description:
- An application, which can capture the Name, email address, phone no of the visitor and host on the front end.
- At the back end, once the user enters the information in the form, the backend stores all of the information with time stamp of the entry.
- This triggers an email and an SMS to the host informing him of the details of the visitor.
- At checkout time, an emails to the guest with the complete form which includes:
    1. Name
    2. Phone
    3. Check-in time,
    4. Check-out time,
    5. Host name
    6. Address visited.

### Tech Stack
##### Front-End
* HTML
* CSS
* JS
##### Backend
* Nodejs(express,body-parser,ejs,nodemailer)
* nexmo API (To send sms)
* sqlite3(To store data)
### How to use

* Use git clone to download the template from github

```sh
$ git clone https://github.com/Rajpra786/Entry-Management-Software.git
$ cd Entry-Management-Software
```
* or Download the zip file from github
* After downloading the repo, install requirements with npm
* Update credentials in server.js
** To get nexmo api key signup here(https://dashboard.nexmo.com/sign-up)
** Allow less secure apps in your google security, To know more check this [https://support.google.com/accounts/answer/6010255]
* then run server.js
```
$ node server.js
```
* now go to [http://localhost:3000/] and you will see main page.
### Contributers
- Rajendra Prajapat(https://github.com/rajpra786)
