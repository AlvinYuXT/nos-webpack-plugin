const NosClient = require('nos-node-sdk')
const path = require('path')

class NosWebpackPlugin {
  constructor(options) {
    this.accessKey = options.accessKey
    this.accessSecret = options.accessSecret
    this.nosHost = options.nosHost
    this.port = options.port || '80'
    this.nosPrefix = options.nosPrefix || ''
    this.bucketName = options.bucketName || ''
    this.realHost = options.realHost || ''

    if (!this.accessKey || !this.accessSecret || !this.nosHost) {
      throw new Error('Please setup the NOS config')
    }

    this.nosclient = new NosClient()
    this.nosclient.setAccessId(this.accessKey)
    this.nosclient.setSecretKey(this.accessSecret)
    this.nosclient.setEndpoint(this.nosHost)
    this.nosclient.setPort(this.port)
  }
  apply(compiler) {
    // emit is asynchronous hook, tapping into it using tapAsync, you can use tapPromise/tap(synchronous) as well
    compiler.hooks.done.tapAsync('NosWebpackPlugin', (stats, callback) => {
      const files = []
      const fileNames = []
      for (let filename in stats.compilation.assets) {
        files.push(`${compiler.outputPath}/${filename}`)
        fileNames.push(filename)
      }
      files.map((item, index) => {
        if (
          process.env.NODE_ENV === 'production' &&
          path.extname(item) === '.map'
        )
          return false

        const map = {
          bucket: this.bucketName,
          key: path.join(this.nosPrefix, fileNames[index]),
          filepath: item
        }
        let fileURL

        try {
          this.nosclient.put_file(map, res => {
            fileURL =
              'http://' +
              this.bucketName + '.' +
              this.realHost +
              path.relative(
                this.nosPrefix,
                decodeURIComponent(res.headers['x-nos-object-name'])
              )
            console.log(fileURL)
          })
        } catch (err) {
          console.log(err)
          console.log('Failed with code:' + err.code)
        }
      })
      callback()
    })
  }
}

module.exports = NosWebpackPlugin
