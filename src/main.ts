import pm from 'picomatch'
import { rules } from './builtin'
import './style.css'

const attrPrefix = 'rgfn'

const ruleProperties = Object.keys(rules)

;(() => {
  const rows = document.querySelectorAll('table[aria-labelledby="folders-and-files"] tbody tr.react-directory-row')

  const rowsData = Array.from(rows).map((row) => {
    const id = row.getAttribute('id') || 'unknown'
    const name = row.querySelector('a')?.textContent || 'unknown'
    const fileType = row.querySelector('svg')?.getAttribute('class') === 'icon-directory' ? 'folder' : 'file'

    return {
      id,
      name,
      type: fileType,
      appendTo: '',
    }
  })

  const files = rowsData.filter(row => row.type === 'file')

  files.forEach((row) => {
    const { name } = row
    const findRule = ruleProperties.find((rule) => {
      const matcher = pm(rule)
      return matcher(name)
    })

    if (findRule) {
      const ruleValues = rules[findRule].split(',').map(rule => rule.trim())
      const matchers = ruleValues.map(rule => pm(rule))

      files.forEach((file) => {
        if (file.id !== row.id && matchers.some(matcher => matcher(file.name))) {
          file.appendTo = row.id
        }
      })
    }
  })

  files.forEach((row) => {
    const { id, appendTo } = row

    const rowEl = document.querySelector(`#${id}`) as HTMLElement

    if (appendTo) {
      const appendToEl = document.querySelector(`#${appendTo}`)
      rowEl!.style.display = 'none'
      rowEl?.querySelectorAll('.react-directory-filename-column')?.forEach((el) => {
        el.setAttribute('style', 'position: relative; left: 32px;')
      })
      if (appendToEl && rowEl) {
        appendToEl.after(rowEl)
      }
    }
    else {
      const findAppendTo = files.filter(file => file.appendTo === id)

      if (findAppendTo.length > 0) {
        rowEl.style.cursor = 'pointer'
        rowEl.querySelectorAll('.react-directory-filename-cell a')?.forEach((el) => {
          const content = el.textContent
          el.innerHTML = `${content}  <span class="${attrPrefix}-file-counts">(+${findAppendTo.length})</span>`
        })

        rowEl.querySelectorAll('.react-directory-filename-column')?.forEach((el) => {
          el.setAttribute(`data-${attrPrefix}-toggle`, '0')
        })

        document.querySelector(`#${id}`)?.addEventListener('click', () => {
          const toggleEls = document.querySelector(`#${id}`)?.querySelectorAll(`[data-${attrPrefix}-toggle]`)
          toggleEls?.forEach((el) => {
            el.setAttribute(`data-${attrPrefix}-toggle`, el.getAttribute(`data-${attrPrefix}-toggle`) === '0' ? '1' : '0')
          })
          findAppendTo.forEach((file) => {
            const el = document.querySelector(`#${file.id}`) as HTMLElement
            const currentStyle = el.style.display
            el.style.display = currentStyle === 'none' ? 'table-row' : 'none'
          })
        })
      }
    }
  })
})()
