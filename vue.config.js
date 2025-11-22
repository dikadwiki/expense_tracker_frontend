module.exports = {
  devServer: {
    port: 8080,
    host: '0.0.0.0', // Allow access from Docker network
    watchOptions: {
      poll: true // Enable polling for Docker volume mounting
    }
  },
  // Public path for production build
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  // Disable linting on build to avoid Prettier compatibility issues
  lintOnSave: false
}
