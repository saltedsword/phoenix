'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
// const ObjectId = mongoose.Schema.Types.ObjectId

const MovieSchema = new Schema({
	director: String,
	title: String,
	country: String,
	summary: String,
	flash: String,
	language: String,
	poster: String,
	year: Number,
	director: String,
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

MovieSchema.pre('save', function(next) {
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	}
	else {
		this.meta.updateAt = Date.now()
	}
	next()
})

MovieSchema.statics = {
	fetch: function() {
		return this.find({}).sort('-meta.updateAt')
	},
	findById: function(id) {
		return this.findOne({_id: id})
	}

}

module.exports = MovieSchema