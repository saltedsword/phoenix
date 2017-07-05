'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const MenuSchema = new Schema({
	name: String,
	url: String,
	parent: {
		type: ObjectId,
		ref: 'Menu'
	},
	order: Number,
	options: [Number],
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

MenuSchema.pre('save', function(next) {
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	}
	else {
		this.meta.updateAt = Date.now()
	}
	next()
})


MenuSchema.statics = {
	fetch: function() {
		return this.find({}).populate({path:'parent', select: 'name'}).sort('-meta.updateAt')
	},
	fetchOffspring: async function(id) {
		let self = this
		async function initOffspring(id, result) {
			let menus = await self.fetchChildren(id) 			
			for (let i=0; i < menus.length; i++) {
				result.push(menus[i])
				await initOffspring(menus[i]._id, result)
			}
		}
		let result = []
		await initOffspring(id, result)
		return result
	},
	fetchAncestors: async function(id) {
		let self = this
		async function initAncestors(id, result) {
			let menu = await self.findParent(id) 			
			if (menu) {
				result.push(menu)
				await initAncestors(menu._id, result)
			}	
		}
		let result = []
		await initAncestors(id, result)
		return result
	},
	isAncestors: async function(pid, cid) {
		let self = this
		async function initAncestors(cid) {
			if (!cid) {
				return false
			}
			if (pid == cid) {
				return true
			}
			let menu = await self.findParent(cid) 			
			if (menu) {
				if (menu._id == pid) {
					return true
				}
				return await initAncestors(menu._id)
			}
			return false	
		}
		return await initAncestors(cid)
	},
	fetchForTree: async function() {//- 返回的数据格式为 [{第一棵树：_id,name,children:[...]},{第二棵树：_id,name,children:[...]}],经典递归，子节点无限延伸
		let self = this
		async function initMenus(parent, result) {
			let menus = await self.fetchChildren(parent._id)
			if (!menus || menus.length === 0) {
				delete parent.nodes
			}
			for (let i=0; i < menus.length; i++) {
				let node = {
					_id: menus[i]._id,
					text: menus[i].name,
					icon: "glyphicon glyphicon-stop",
				  	selectedIcon: "glyphicon glyphicon-stop",
				  	color: "#000000",
				  	backColor: "#FFFFFF",
				  	// href: "#node-1",
				  	selectable: true,
				  	// state: {
					  //   checked: true,
					  //   disabled: true,
					  //   expanded: true,
					  //   selected: true
				  	// },
				  	// tags: ['xxx'],
				  	nodes: []
				}
				parent.nodes[i] = node
				if (!parent._id) {
					result.push(node)
				}
				await initMenus(node)
			}
		}
		let parent = {
			_id: null,
			nodes: []
		}
		let result = []
		await initMenus(parent, result)
		return result
	},
	findById: function(id) {
		return this.findOne({_id: id})
	},
	findParent: async function(id) {
		let menu = await this.findOne({_id: id})
		return this.findOne({_id: menu.parent})
	},
	fetchChildren: function(parent) {
		return this.find({parent: parent}).sort('order')
	},
	hasChildren: async function(parent) {
		if (await this.findOne({parent: parent})) {
			return true
		}
		return false
	},
	fetchForDepth: async function() {//- 返回的数据格式为 [{_id,name,depth:1},{_id,name,depth:2}...,{_id,name,depth:1}...],按照深度和order排序（参照左右值）
		let self = this
		async function initMenus(parent, depth, result) {
			let menus = await self.fetchChildren(parent)
			for (let i=0; i < menus.length; i++) {
				let menu = menus[i]
				menu.depth = depth
				result.push(menu)
				if (await self.hasChildren(menu._id)) {
					await initMenus(menu._id, depth+1, result)
				}
			}
		}
		let parent = null
		let depth = 1
		let result = []
		await initMenus(parent, depth, result)
		return result
	}
}

module.exports = MenuSchema