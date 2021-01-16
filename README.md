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

data structure:

{url:"https://....", services: [{name: "ServiceName", files: [{path: "/src/test.js", devOwner: [ {name: "contributerName", email: 'israel@gmail.com',date:'2020-11-10'}]}]}]}

```javascript
{
  "data": {
    "url": "https://github.com/orelmoshe/monorepo-example",
    "services": [
      {
        "name": "monorepo-example",
        "files": [
          {
            "path": "lerna.json",
            "devOwner": {
              "name": "orelmoshe",
              "email": "orel@spectory.com",
              "date": "2020-12-06T22:09:30Z"
            }
          },
          {
            "path": "package.json",
            "devOwner": {
              "name": "orelmoshe",
              "email": "orel@spectory.com",
              "date": "2020-12-06T22:09:30Z"
            }
          },
          {
            "path": "README.png",
            "devOwner": {
              "name": "orelmoshe",
              "email": "orel@spectory.com",
              "date": "2021-01-16T15:59:00Z"
            }
          },
          {
            "path": "README.md",
            "devOwner": {
              "name": "orelmoshe",
              "email": "orel@spectory.com",
              "date": "2020-12-06T22:09:30Z"
            }
          },
          {
            "path": "yarn.lock",
            "devOwner": {
              "name": "orelmoshe",
              "email": "orel@spectory.com",
              "date": "2020-12-06T22:09:30Z"
            }
          },
          {
            "path": "src/packages/sayHello/index.js",
            "devOwner": {
              "name": "orelmoshe",
              "email": "orel@spectory.com",
              "date": "2020-12-06T22:09:30Z"
            }
          },
          {
            "path": "src/packages/sayHello/package.json",
            "devOwner": {
              "name": "orelmoshe",
              "email": "orel@spectory.com",
              "date": "2020-12-06T22:09:30Z"
            }
          },
          {
            "path": "src/applications/cli/index.js",
            "devOwner": {
              "name": "orelmoshe",
              "email": "orel@spectory.com",
              "date": "2020-12-06T22:09:30Z"
            }
          },
          {
            "path": "src/applications/cli/package.json",
            "devOwner": {
              "name": "orelmoshe",
              "email": "orel@spectory.com",
              "date": "2020-12-06T22:09:30Z"
            }
          }
        ]
      },
      {
        "name": "@packages/sayHello",
        "files": [
          {
            "path": "src/packages/sayHello/index.js",
            "devOwner": {
              "name": "orelmoshe",
              "email": "orel@spectory.com",
              "date": "2020-12-06T22:09:30Z"
            }
          },
          {
            "path": "src/packages/sayHello/package.json",
            "devOwner": {
              "name": "orelmoshe",
              "email": "orel@spectory.com",
              "date": "2020-12-06T22:09:30Z"
            }
          }
        ]
      },
      {
        "name": "@applications/cli",
        "files": [
          {
            "path": "src/applications/cli/index.js",
            "devOwner": {
              "name": "orelmoshe",
              "email": "orel@spectory.com",
              "date": "2020-12-06T22:09:30Z"
            }
          },
          {
            "path": "src/applications/cli/package.json",
            "devOwner": {
              "name": "orelmoshe",
              "email": "orel@spectory.com",
              "date": "2020-12-06T22:09:30Z"
            }
          }
        ]
      }
    ]
  }
}
```
---

# GitHub Limit

The Github API has a 60-requests-per-hour rate-limit for non-authenticated use. If you need some more then a scope-limited Github OAuth token can be used to boost the limit to 5000.
