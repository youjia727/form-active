import loadScript from './loadScript';

const path = '/libs/monaco-editor/vs';

// monaco-editor单例
let monacoEidtor: any;

/**
 * 动态加载monaco-editor cdn资源
 * @param {Function} cb 回调，必填
 */
export default function loadMonaco(cb: Function) {
  if (monacoEidtor) {
    cb(monacoEidtor)
    return
  }

  let newWindow: any = window;

  !newWindow.require && (newWindow.require = {})
  !newWindow.require.paths && (newWindow.require.paths = {})
  newWindow.require.paths.vs = path;

  loadScript(`${path}/loader.js`, () => {
    newWindow.require(['vs/editor/editor.main'], () => {
      monacoEidtor = newWindow.monaco;
      cb(monacoEidtor);
    })
  })
}
