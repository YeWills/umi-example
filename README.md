# dva-example-user-dashboard

详见[《12 步 30 分钟，完成用户管理的 CURD 应用 (react+dva+antd)》](https://github.com/sorrycc/blog/issues/18)。

---

<p align="center">
  <img src="https://zos.alipayobjects.com/rmsportal/bmkNCEoluwGaeGjYjInf.png" />
</p>

## Getting Started
Install dependencies.

```bash
$ npm install
```

Start server.

```bash
$ npm start
```

If success, app will be open in your default browser automatically.


 ## 项目细节

 ### .umi/ 目录
 此目录为验证目录，npm start生成，没有作用，也不推荐在此修改代码，为方便验证而生。

 ### 项目目录
 详见 ./user-dashboard.jpg

 ### 入口页面
 ```
src\pages\.umi\umi.js  ---ReactDOM.render
```
此页面集成了一个项目的两大要素： dva (状态) 和 路由：
```
src\pages\.umi\DvaContainer.js  ---dva (状态)
src\pages\.umi\router.js ---路由
```
### dva 布局
src\pages\.umi\DvaContainer.js
src\pages\users\models\users.js (reducers effects)
src\pages\users\components\Users\Users.js (connect mapStateToProps dispatch) 【dispatch 由connect集成】

### User.js页面分析
#### subscriptions setup
进入User页面后，首先触发 src\pages\users\models\users.js 下的 ，[原因参考dva文档---异步数据初始化](https://dvajs.com/knowledgemap/#%E5%BC%82%E6%AD%A5%E6%95%B0%E6%8D%AE%E5%88%9D%E5%A7%8B%E5%8C%96):
```
subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/users') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
```
在setup 中触发 改js下的 effects fetch

#### effects fetch
在fetch中首先 usersService.fetch 向后台请求数据；
然后将返回的数据，put触发 reducers save;
```
 *fetch({ payload: { page = 1 } }, { call, put }) {
      const { data, headers } = yield call(usersService.fetch, { page });
      yield put({
        type: 'save',
        payload: {
          data,
          total: parseInt(headers['x-total-count'], 10),
          page: parseInt(page, 10),
        },
      });
    },
```
#### reducers save
通过save reducer忘redux上造数据list，total。。。以后User页面使用。
```
 reducers: {
    save(state, { payload: { data: list, total, page } }) {
      return { ...state, list, total, page };
    },
  },
```

### 细节关注点

#### *fetch 与 yield 的 generateor写法
这里的*和yield是 generateor的写法，可到mdn网查询了解。

#### loading

发fetch请求时，通过dva-loading 配合dva中间件，会自动给redux 的store 改变store.loading的state，
在fetch开始和完成时将store.loading置为true或false：

```
//src\pages\.umi\DvaContainer.js
import createLoading from 'dva-loading';
app.use(createLoading());
```

在页面中，通过mapStateToProps拿到这个redux的state.loading值，根据这个值，自行开启或关闭loading组件或效果：
```
//src\pages\users\components\Users\Users.js
<Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey={record => record.id}
          pagination={false}
        />

function mapStateToProps(state) {
  const { list, total, page } = state.users;
  return {
    loading: state.loading.models.users,
    list,
    total,
    page,
  };
}

export default connect(mapStateToProps)(Users);
```

#### import styles from './index.css' 的运用：

```
import styles from './index.css';
console.log(styles)//{normal: "index__normal___3v60A", content: "index__content___14HDd", main: "index__main___nz_0B"}
 <div className={styles.main}>{children}</div>
 ```

### dva与umijs项目中起的作用统筹分析

本节分析参考pages/.umi/下的文件进行。

#### dva
项目中，通过dva，你不用写store与Provider的集成代码，dva帮你把这块实现,dva又将路由这块的逻辑剥离出来，提供类似接口(this.props.children)方式，方便接入项目路由js；(因此，dva只专注做redux相关的状态部分，并剥离路由且提供路由接口，方便接入路由)

而你只需专注于：

1、写reducer；(按dva规定，将reducer写在model下，以便dva能解析)

2、哪个组件需要redux了，给组件包一层connect，写好mapStateToProps，

#### umijs
至于路由，则由umijs处理，umijs可以将pages下的文件自动解析为路由router.js(.umi下的router.js);

至此，一个项目的 redux与路由两大块全部写好。
剩下一个工作就是 如何将redux与路由两大块有机结合起来呢，
这个工作就是umijs做的:
```
function render() {
  const DvaContainer = require('./DvaContainer').default; //dva处理的redux逻辑部分
ReactDOM.render(React.createElement(
  DvaContainer,
  null,
  React.createElement(require('./router').default)  //umijs处理的路由部分逻辑部分
), document.getElementById('root'));
}
```
#### 小结
因此在以上过程umijs做了以下事情：

1、封装路由，按约定会将pages下的文件编译为路由文件；

2、将上面的路由文件与 dva封装好的redux的reducer状态文件有机组合；

3、有机结合路由和redux后，ReactDOM.render生成启动入口js；

由上可知，umijs至始至终没有处理过redux部分，都是dva处理好后，umijs拿过来组合下而已。

整个项目过程，dva只做了一件事情：

封装reducer，处理redux，dva按约定会将model目录下的文件封装成reducer；

另外在整个过程中，umijs顺手还做了 webpack配置，比如module.hot 热更新。

