'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const RoleSchema = new Schema({
	name: String,
	menus: [{
		menu: {
			type: ObjectId,
			ref: 'Menu'
		},
		options: [Number]
	}]
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

RoleSchema.pre('save', function(next) {
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	}
	else {
		this.meta.updateAt = Date.now()
	}
	next()
})

RoleSchema.statics = {
	fetch: function() {
		return this.find({}).sort('-meta.updateAt')
	},
	findById: function(id) {
		return this.findOne({_id: id})
	}


}

module.exports = RoleSchema