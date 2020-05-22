// vue.config.js
module.exports = {
    devServer:{
      proxy:{
		  '/api':{
            target:`http://39.99.173.172:8082/api`,
            changeOrigin:true,
            ws: true,
            pathRewrite:{
              '^/api':'',
            }
		  }
        }
      }
    }
