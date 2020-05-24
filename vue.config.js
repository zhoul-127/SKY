// vue.config.js
module.exports = {
	lintOnSave: false,
	devServer: {
		overlay: {
			warnings: false,
			errors: false
		},
		proxy: {
			'/api': {
				target: `http://39.99.173.172:8082/api`,
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					'^/api': '',
				}
			}
		}
	}
}
