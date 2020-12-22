# Saya
趁手的多功能快速记事本服务

它可以：

- 保存键值对形式的信息
- 在线动态config
- mock接口
- 在线剪贴板
- 缩短网址（设置重定向）
- 发生更改时webhook通知（添加Webhook）

#### 如何部署
```shell
mkdir saya
curl -O https://raw.githubusercontent.com/codedayang/saya/master/docker-compose.yml
docker-compose up -d
```
#### 如何配置
docker-compose内已自带数据库，可通过配置更换

修改docker-compose.yml文件内的environment
- PORT=3000 # 应用启动的端口
- MYSQL_HOST=database # 数据库地址
- MYSQL_PORT=3306 # 数据库端口
- MYSQL_DB=saya # 数据库名
- MYSQL_USERNAME=root # 数据库账号
- MYSQL_PASSWORD=root # 数据库密码

记得端口映射配置
ports:
- 3000:3000 # [应用在容器内端口]:[映射到宿主机端口]

##### 开启https

- 建议使用nginx

- [Deprecated]在docker-compose所在目录新建文件夹`SSLCert`,并放入公钥与私钥文件
`full_chain.pem` 和 `private.key `。
如果存在则启动https，否则使用http

#### 使用说明
KEY应为合法的url字符串

- GET /[KEY]

    返回对应值，键不存在时返回空字符串
```shell
$ curl saya.dayang.link/testkey
testvalue
```
    
- POST /[KEY]
    
    将对应key的值更新为POST Body，成功返回200
    
    若值不存在，则新建一个键值对
```shell
$ curl -d "testvalue" saya.dayang.link/testkey
OK with <testkey, testvalue>
```

- GET /[KEY]/ui

    这是一个带有编辑框的图形化界面
    

- POST /[KEY]/setRedirect

    设置自动重定向地址为POST Body，用于短链接，为空则取消
  
    注意应填写完整链接（包括http://或https://）
```shell
$ curl -d "http://saya.dayang.link/redirectTest" saya.dayang.link/testkey
OK
```
- POST /[KEY]/addWebhook

    追加值更新通知地址为POST Body
  
    注意应填写完整链接（包括http://或https://）
```shell
$ curl -d "http://yourwebhook.url/" saya.dayang.link/testkey/addWebhook
OK
```
webhook通知格式

HTTP POST
```json
{
  "msg": "Changed",
  "key": "123",
  "oldValue": "dddcdf",
  "newValue": "dddcdf"
}
```

