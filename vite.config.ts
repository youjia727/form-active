import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react-swc';
const imageRegExp = /\.(jpe?g|png|svg|gif)(\?[a-z0-9=.]+)?$/;
const fontRegExp = /\.(eot|woff|woff2|ttf)(\?.*)?$/;
const cssRegExp = /\.(css)(\?.*)?$/;

// https://vitejs.dev/config/
export default defineConfig({
	// 修改引入的路径可以使用@
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src')
		}
	},
	// 插件使用
	plugins: [react()],
	// 配置css
	css: {
		devSourcemap: true,
		preprocessorOptions: {
			less: {
				javascriptEnabled: true,
				additionalData: `@import "./src/assets/style/global.less";`
			}
		}
	},
	// 开发环境下面的配置
	server: {
		host: '0.0.0.0',
		port: 3001,
		hmr: {
			overlay: false
		}
	},
	// 生产环境下面的配置
	build: {
		outDir: "dist",
		minify: "esbuild",
		rollupOptions: {
			output: {
				entryFileNames: "js/[name].[hash].chunk.js",
				chunkFileNames: "js/[name].[hash].chunk.js",
				assetFileNames: (assetInfo) => {
					if (assetInfo.name && imageRegExp.test(assetInfo.name)) {
						return "image/[name].[hash].[ext]";
					} else if (assetInfo.name && fontRegExp.test(assetInfo.name)) {
						return "font/[name].[hash].[ext]";
					}
					else if (assetInfo.name && cssRegExp.test(assetInfo.name)) {
						return "css/[name].[hash].[ext]";
					}
					return "[name].[hash].chunk.[ext]";
				},
			}
		}
	}
})
