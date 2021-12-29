module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
		proxy: {
			'^/scenes': {
				target: 'http://localhost:8080',
				changeOrigin: true,
			},
		},
	},
  pluginOptions: {
    compression:{
      gzip: {
        filename: '[file].gz[query]',
        algorithm: 'gzip',
        include: /\.(js|css|html|svg|json)(\?.*)?$/i,
        minRatio: 0.8,
      }
    }
  }
}
