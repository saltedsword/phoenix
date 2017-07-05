'use strict'
const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const path = require('path')
const koaStatic = require('koa-static')
const views = require('koa-views')
const mongoose = require('mongoose')
const bodyParser = require('koa-bodyparser')
const moment = require('moment')
const Promise = require('bluebird');
const convert = require('koa-convert')
const session = require('koa-generic-session')
const MongoStore = require('koa-generic-session-mongo')

//mongodb
mongoose.Promise = Promise
mongoose.connect('mongodb://localhost/phoenix')
mongoose.set('debug', true)

//session
app.keys = ['phoenix'] //cookie签名 密钥
const storeConfig = {
    url: 'mongodb://localhost:27017/phoenix'
}
const cookie = {
    maxAge: 50000 // ms cookie 过期时间
}
app.use(convert(session({
    store: new MongoStore(storeConfig),
    cookie: cookie
})))

//middlewares
app.use(views(__dirname + '/app/views/pages',{
	extension : 'jade'
}))
app.use(koaStatic(path.join(__dirname,'public')))
app.use(bodyParser())

//globel domain init
app.use(async(ctx, next) => {
    //pretty
    ctx.state.pretty = true
    //monent
    ctx.state.moment = moment
    //login status
    let user = ctx.session.user
    if (user) {
        ctx.state.user = user
    }else {
        delete ctx.state.user
    }
    await next()
})

//routes filter
app.use(async (ctx, next)=> {
    if (ctx.url === '/favicon.ico') {
        return
    }
    await next()
})
//routes
require('./config/routes')(router)
app
  .use(router.routes())
  .use(router.allowedMethods())
//routes not match
app.use(async (ctx)=> {
    ctx.body = 'No route matches!!!'
})

//listenning port
app.listen(3000)
console.log('server running in port 3000')