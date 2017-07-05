'use strict'
const Movie = require('../models/movie')

exports.index = async(ctx)=> {
	    let movies = await Movie.fetch()
	    let user = ctx.session.user
	    if (user) {
	        console.log('user in sesssion ')
	    } else {
	        console.log('user not in session')
	    }
	    await ctx.render('index',{
	    	title: '传之人首页',
	    	movies: movies
	    })
	}