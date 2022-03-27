# passcheck
This is the project repository for the WinHacks 2022 hackathon.

## Inspiration
Every time a data breach happens, potentially millions of passwords and account information can be leaked into the open. Those passwords can then be used to access people's accounts, and if the password is common or if the same password is used for multiple services then hackers can try to access those too.

## What it does
It takes the problem of data breaches and turns it into a way to encourage people to set better passwords. Using a large dataset of previously breached passwords, it tells the user how common their password is as they are typing it in during a login or signup process on any website.

## How we built it
passcheck was built as a browser extension. Using JavaScript, we wrote a script to read and create a SHA1 hash of the password. Then, we make an HTTP request to query the exposed passwords API with the hashed password to retrieve its popularity. Finally, we built a small HTML & CSS tooltip to be injected beside the password input on the website. 
