## nos-webpack-plugin

用于将静态资源上传到nos

### 使用方法

```javascript
const NosWebpackPlugin = require('nos-webpack-plugin')

module.exports = {
  plugins: [new NosWebpackPlugin({
    accessKey: 'xxx',
    accessSecret: 'xxx',
    nosHost: 'xxx',
    port: '80',
    nosPrefix: 'xxx',
    bucketName: 'xxx'
    realHost: 'xxx'
  })]
}
```

### options

#### accessKey
*required* NOS的accessId

#### accessSecret
*required* NOS的secretKey

#### nosHost
*required* NOS的endpoint

#### port
*default: 80* NOS的端口号


#### nosPrefix
*default: ''* NOS的前缀， 真是的静态资源路径http://bucketName.realHost/nosPrefix/filePath


#### bucketName
*default: ''* NOS的三级域


#### realHost
*required* NOS可能有多个可用域，所以这里请手动设置