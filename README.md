# gene-page

### Requirements
* Node.js v16

### Installation
```
$ git clone git@github.com:orthordf/gene-page.git
$ cd gene-page
$ npm ci
```

### SQLize
```
$ npx sequelize db:migrate
$ npx sequelize db:seed:all
```
`sequelize` use the following files
* config/config.json
* migrations/*.js
* seeders/*.js
* models/*.js

### Start service
```
$ npm start
```

Access to localhost:8100.
