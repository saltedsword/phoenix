'use strict'
const Menu = require('../models/menu')
const settings = require('../../settings')
const _ = require('lodash')

module.exports = {
	new: async(ctx)=> {
			let tree = await Menu.fetchForTree()
			tree.unshift({text: '请选择'})
		    await ctx.render('menu/form',{
		    	title:"菜单录入页",
		    	menu: {
		    		name: '',
		    		parent: '',
		    		url: '',
		    		order: '',
		    		options: []
		    	},
		    	menuOptions: settings.menuOptions,
		    	tree: tree
		    })
		},
	update: async(ctx)=> {
		    let id = ctx.params.id
		    let menu = await Menu.findById(id).populate({path:'parent', select: 'name'})
		    let tree = await Menu.fetchForTree()
		    tree.unshift({text: '请选择'})
		    await ctx.render('menu/form',{
		        title: menu.name + "后台更新页",
		        menu: menu,
		    	menuOptions: settings.menuOptions,
		    	tree: tree
		    })
		},	
	save: async(ctx) => {
		    let menu = ctx.request.body.menu
		    let id = menu._id
	    	if (!menu.parent) {
	    		menu.parent = null
	    	}	
		    if (id !== 'undefined') {
		    	if (await Menu.isAncestors(menu._id, menu.parent)) {
		    		console.log('不能将目标菜单及其子孙菜单作为目标菜单的父菜单！')
		    		return
		    	}
		        let _menu = await Menu.findById(id)
		        menu = _.assign(_menu, menu)
		        menu = await menu.save()
		    } else {
		    	delete menu._id
		        menu = new Menu(menu)
		        menu = await menu.save()
		    }
		    ctx.response.redirect('/admin/menu/list')
		},
	del: async(ctx) => {
		    let id = ctx.request.query.id
		    let result = {}
		    if (id) {
		    	if (await Menu.hasChildren(id)) {
		    		result.success = 0
		    		result.msg = '该菜单有子菜单，无法删除'
		    	} else {
		        	let menu = await Menu.remove({_id: id})
		        	result.success = 1
		    	}
		    }
	        ctx.body = result
		},
	list: async(ctx)=> {
		    let menus = await Menu.fetch()
		    await ctx.render('menu/list',{
		    	title:"菜单列表",
		    	menus: menus
		    })
		}	
}