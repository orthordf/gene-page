# gene-page

### Requirements
* Node.js v16

## Installation
```
$ git clone git@github.com:orthordf/gene-page.git
$ cd gene-page
$ npm ci
```

## Data preparation

### SQLite file
The SQLite file `data.sqlite3` is created by:
```
$ npm run recreate-db
```

The SQLite file `data.sqlite3` is updated by:
```
$ npx sequelize db:migrate
$ npx sequelize db:seed:all
```
(The `sequelize` command use the following files)
* config/config.json
* migrations/*.js
* seeders/*.js
* models/*.js


### Files for scores
Prepare `gene_data/blast.scores/*.scores.txt`

(These files are not included in the git repository)

## Start service

```
$ npm start
```

Access to localhost:8100/resource/genes/6348

(The port number is configured in `config/config.json`)
