const fs = require('fs')

module.exports = ((dbFile) => {

  const loadDb = () =>
    JSON.parse(fs.readFileSync(dbFile))

  const saveDb = (obj) =>
    fs.writeFileSync(dbFile, JSON.stringify(obj))

  const getNextId = (collection) =>
    collection
      .map(obj => obj._id)
      .reduce((maxId, id) => id > maxId ? id : maxId, 0) + 1

  if (fs.existsSync(dbFile) === false) {
    saveDb({})
  }

  return {
    init: (obj) => {
      saveDb(obj)
    },
    isEmpty: () =>
      Object.keys(loadDb()).length === 0
    ,
    add: (collectionName, obj) => {
      let db = loadDb()
      const collection = db[collectionName] || []
      obj._id = getNextId(collection)
      db[collectionName] = collection.concat([ obj ])
      saveDb(db)
    },
    get: (collectionName) => {
      const db = loadDb()
      return db[collectionName]
    },
    getById: (collectionName, id) => {
      const db = loadDb()
      return db[collectionName].filter(obj => obj._id === id)
    },
    getByQuery: (collectionName, queryObj) => {
      const db = loadDb()
      return db[collectionName]
        .filter(obj =>
          Object.keys(queryObj)
            .filter(queryKey => obj[queryKey] === queryObj[queryKey])
            .length > 0
        )
    },
    remove: (collectionName) => {
      let db = loadDb()
      delete db[collectionName]
      saveDb(db)
    },
    removeById: (collectionName, id) => {
      let db = loadDb()
      const collection = db[collectionName] || []
      db[collectionName] = collection.filter(obj => obj._id !== id)
      saveDb(db)
    }
  }
})(process.env.DB_FILE || './data/db.json')