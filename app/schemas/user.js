'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')
const SALT_WORK_FACTOR = 10
const ObjectId = Schema.Types.ObjectId

const UserSchema = new Schema({
	name: {
		type: String,
		unique: true
	},
	password: String,
	roles: [{
		type: ObjectId,
		ref: 'Role'
	}],
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}

})

UserSchema.pre('save', function(next) {
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	}
	else {
		this.meta.updateAt = Date.now()
	}
	let salt = bcrypt.genSaltSync(SALT_WORK_FACTOR)
	let hash = bcrypt.hashSync(this.password, salt)
	this.password = hash
	next()
})

UserSchema.statics = {
	fetch: function() {
		return this.find({}).sort('-meta.createAt')
	},
	findById: function(id) {
		return this.findOne({_id: id})
	}

}

UserSchema.methods.comparePassword = function(password) {
	return bcrypt.compareSync(password, this.password)
}

module.exports = UserSchema