'use strict'
const Movie = require('../models/movie')
const _ = require('lodash')

exports.new = async(ctx)=> {
	    await ctx.render('movie/form',{
	    	title:"后台录入页",
	    	movie: {
	    		director: '',
	    		country: '',
	    		title: '',
	    		year: '',
	    		poster: '',
	    		language: '',
	    		flash: '',
	    		summary: ''
	    	}
	    })
	}

exports.update = async(ctx)=> {
	    let id = ctx.params.id
	    let movie = await Movie.findById(id)
	    await ctx.render('movie/form',{
	        title: movie.title + "后台更新页",
	        movie: movie
	    })
	}	

exports.save = 	async(ctx)=> {
	    let movie = ctx.request.body.movie
	    let id = movie._id
	    if (id !== 'undefined') {
	        let _movie = await Movie.findById(id)
	        movie = _.assign(_movie, movie)
	        movie = await movie.save()
	    } else {
	        movie = new Movie(_.omit(movie, '_id'))
	        movie = await movie.save()
	    }
	    await ctx.render('movie/detail',{
	        title: movie.title + "详情",
	        movie: movie
	    })
	}

exports.detail = async(ctx)=> {
	    let id = ctx.params.id
	    let movie = await Movie.findById(id)
	    await ctx.render('movie/detail',{
	    	title: movie.title + "详情",
	    	movie: movie
	    })
	}
exports.del = async (ctx) => {
	    let id = ctx.request.query.id
	    if (id) {
	        let movie = await Movie.remove({_id: id})
	        ctx.body = {success: 1}
	    }
	}

exports.list = async(ctx)=> {
	    let movies = await Movie.fetch()
	    await ctx.render('movie/list',{
	    	title:"影片列表",
	    	movies: movies
	    })
	}	