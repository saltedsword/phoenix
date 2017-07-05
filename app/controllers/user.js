'use strict'
const User = require('../models/user')

exports.list = async(ctx)=> {
	    let users = await User.fetch()
	    await ctx.render('user/list',{
	        title:"用户列表",
	        users: users
	    })
	}

exports.signup = async(ctx)=> {
	    let user = ctx.request.body.user
	    let mUser = await User.findOne({name: user.name})

	    if (mUser) {
	        console.log('user name can not be repeat!')
	        ctx.response.redirect('/')
	    } else {
	        await new User(user).save()
	        ctx.response.redirect('/admin/user/list')
	    }
	}

exports.signin = async(ctx)=> {
	    let user = ctx.request.body.user
	    let mUser = await User.findOne({name: user.name})

	    if (mUser) {
	        if (mUser.comparePassword(user.password)) {
	            console.log('password matches!')
	            ctx.session.user = mUser
	            ctx.response.redirect('/')
	        }else {
	            console.log('password not match!')
	            ctx.response.redirect('/')
	        }
	    } else {
	        console.log('user not found by name')
	        ctx.response.redirect('/')
	    }
	}	

exports.logout = async(ctx)=> {
	    delete ctx.session.user
	    delete ctx.state.user
	    ctx.response.redirect('/')
	}	