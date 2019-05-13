## with-dva

本例源自官网 [with-dva示例](https://github.com/umijs/umi-examples/tree/master/with-dva)，在此整理此示例的一些笔记。

## 项目细节

### _layout.js 与 嵌套路由
[umi 里约定目录下有 _layout.js 时会生成嵌套路由，以 _layout.js 为该目录的 layout 。](https://umijs.org/zh/guide/router.html#%E5%B5%8C%E5%A5%97%E8%B7%AF%E7%94%B1)

本例的src\pages\list\_layout.js 是嵌套路由。

### 全局 layout
与上相应的是，全局路由，[参考官网](https://umijs.org/zh/guide/router.html#%E5%85%A8%E5%B1%80-layout)。
本例的src\layouts\index.js 是 全局路由。

### model.js 与 models/ 目录
[参考官网--快速上手-定义model](https://dvajs.com/guide/getting-started.html#%E5%AE%9A%E4%B9%89-model)
```
本例的 src\pages\list\search\model.js
本例的 src\pages\list\models\
```
以上两种情况都会被dva用来解析成reducer，组装store.getState().[nameSpace],也就是组装全局state的key值；
任何组件都可以通过store.getState()获取

这里想说的是，项目中，在不同位置定义的model，看起来没有什么区别或特殊，任意一个地方定义了model后，任何组件都可以凭model的nameSpace获取该状态。

### src\pages\index路由说明
在目录的 src\pages\index下有以下文件：
```
+ pages/
  + index/
    - components/
      - Count.js
    - model.js
    - index.js
```
按照umijs约定，输入以下路由到浏览器url上，应该是可以显示Count页面的：
```
http://localhost:8000/#/index/components/Count
```
但是却不行，原因是src\pages\index是主目录路由，src\pages\index\目录下定义的文件都将不被解析为路由，此目录下的index.js为默认主域名下的页面：
```
http://localhost:8000/#/
```

### 本例具有hot-loader功能
本例具有热更新功能，有兴趣可以研究底层配置实现。

### effects
Effect 被称为副作用，在我们的应用中，最常见的就是异步操作。
项目的异步请求，以及异步请求后根据接口数据，发起action，都是写在effects中。
effects定义了一些关键字(put\call\select..)用来处理比如发送action：
```
yield put({ type: 'reload' });

```
[参考dva--指南-dva概念-models-Effect](https://dvajs.com/guide/concepts.html#effect)
[参考dva--知识地图-Effect-effects](https://dvajs.com/knowledgemap/#effects)

### effects与reducers
effects跟reducers定义相似，二者都是用来定义action的reducer操作，不同的是，effects用来定义异步action，当action要发起post请求时，一般用effects；
相对的，reducer用来定义同步：[参考示例user-dashboard---src\pages\users\models\users.js](https://github.com/YeWills/dva-example/tree/user-dashboard)


### 参考文档：

[参考dva--指南-快速上手-定义model](https://dvajs.com/guide/getting-started.html#%E5%AE%9A%E4%B9%89-model)
[参考dva--指南-dva概念-models-Effect](https://dvajs.com/guide/concepts.html#effect)
[参考dva--知识地图-Effect-effects](https://dvajs.com/knowledgemap/#effects)

[参考umi--指南-路由-约定式路由](https://umijs.org/zh/guide/router.html#%E5%B5%8C%E5%A5%97%E8%B7%AF%E7%94%B1)