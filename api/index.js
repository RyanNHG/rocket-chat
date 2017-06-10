module.exports = (db) => ({
	users: require('./users')(db.users)
})