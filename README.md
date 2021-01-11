# github-contributors

Technologies: Node.js

---

# Project explanation:

Application that receives repo URL and returns an object that contains the services detected from the repo + the files and the files' owners.

---
# input example:

http://localhost:3000?url=https://github.com/orelmoshe/monorepo-example

---

# Output example:

{url:"https://....", services: [{name: "ServiceName", files: [{path: "/src/test.js", devOwner: [ {name: "contributerName", email: 'israel@gmail.com',date:'2020-11-10'}]}]}]}

---

# GitHub Limit

The Github API has a 60-requests-per-hour rate-limit for non-authenticated use. If you need some more then a scope-limited Github OAuth token can be used to boost the limit to 5000.
