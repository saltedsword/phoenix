'use strict'
const Index = require('../app/controllers/index')
const Movie = require('../app/controllers/movie')
const User = require('../app/controllers/user')
const Menu = require('../app/controllers/menu')

module.exports = (router) => {
	//index
	router.get('/', Index.index)

	//movie
	router.get('/admin/movie/new', Movie.new)
	router.get('/admin/movie/update/:id', Movie.update)
	router.post('/admin/movie/save', Movie.save)   
	router.delete('/admin/movie/del', Movie.del)
	router.get('/movie/:id', Movie.detail)
	router.get('/admin/movie/list', Movie.list)    
	
	//user
	router.post('/user/signup', User.signup) 
	router.post('/user/signin', User.signin) 
	router.get('/admin/user/list', User.list)  
	router.get('/logout', User.logout) 	

	//movie
	router.get('/admin/menu/new', Menu.new)
	router.get('/admin/menu/update/:id', Menu.update)
	router.post('/admin/menu/save', Menu.save)   
	router.delete('/admin/menu/del', Menu.del)
	router.get('/admin/menu/list', Menu.list)  

	//index
	router.get('/admin/', async (ctx)=> {
		await ctx.render('admin/index',{
	    	title: '传之人首页'
	    })
	})
}