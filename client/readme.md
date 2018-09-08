

## React 16新特性

> react + react-dom在gzipped后小了10k左右。其次整个代码都用Fiber重写了。

codesandbox 在线代码编辑器 https://codesandbox.io/s/new

* error boundary

帮助我们在react整个渲染过程中捕获一些错误，包含错误的堆栈信息便于排查。

* New render return types

支持返回一个字符串

```js
class App extends React.Component{
    render(){
        return 'this is a App'
    }
}
```

或者返回一个数组

```js
class App extends React.Component{
    render(){
        return [
            'this is a App',
            'this is a App',
        ]
    }
}
```

* Portals

* Better server-side rendering

组件

jss material-ui团队开发的css in js的实现
react-jss 用jss链接react的工具
jss-preset-default 用来在服务端生成样式的工具
