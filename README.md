# gene-page

### Requirements

- Node.js v16

## Installation

```
$ git clone git@github.com:orthordf/gene-page.git
$ cd gene-page
$ npm ci
```

## Data preparation

### Environment variables

Copy `.env.sample` to `.env` and edit the content if necessary.

```
$ cp .env.sample .env
$ vi .env # Edit in your favorite editor
```

### Files for initial data

Prepare `gene_data/gene_info` and `gene_data/gene2refseqs`

(These files are not included in the git repository)

### SQLite file

The SQLite file `sequelize/data.sqlite3` is created by:

```
$ npm run recreate-db
```

The SQLite file `sequelize/data.sqlite3` is updated by:

```
$ npx sequelize db:migrate
$ npx sequelize db:seed:all
```

(The `sequelize` command use the following files)

- sequelize/config/config.json
- sequelize/migrations/\*.js
- sequelize/seeders/\*.js

### Files for scores

Prepare `gene_data/blast.scores/*.scores.txt`

(These files are not included in the git repository)

## Start service

```
$ npm start
```

Access to localhost:8100/resource/genes/6348

(The port number is configured in `.env`)

## Implementation

- `sequelize/models/*.js` is used by the `sequelize` module
