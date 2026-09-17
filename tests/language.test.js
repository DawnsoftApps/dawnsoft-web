import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveLanguage } from '../src/tabskeeper/privacy/language.js'

test('URL language wins, browser languages auto-match, and English is the fallback', () => {
  assert.equal(resolveLanguage('?lang=ja', ['de-DE']), 'ja')
  assert.equal(resolveLanguage('?lang=unknown', ['de-DE']), 'en')
  assert.equal(resolveLanguage('', ['es-ES', 'zh-TW']), 'zh-Hant')
  assert.equal(resolveLanguage('', ['zh-CN']), 'zh-Hans')
  assert.equal(resolveLanguage('', ['de-AT']), 'de')
  assert.equal(resolveLanguage('', ['es-ES']), 'en')
})
