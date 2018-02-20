import {ipcRenderer, clipboard} from 'electron'

export default () => {
  ipcRenderer.on('copy', () => {
    const selectionObj = window.getSelection()
    const selectedText = selectionObj.toString()
    clipboard.writeText(selectedText)
  })
}
