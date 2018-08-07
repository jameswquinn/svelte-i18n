import { i18n } from '../src/svelte-i18n'
import { Store } from 'svelte/store.umd'
import { capital, title, upper, lower, isObject } from '../src/utils'

const store = new Store()
const locales = {
  'pt-br': {
    test: 'teste',
    phrase: 'adoro banana',
    phrases: ['Frase 1', 'Frase 2'],
    pluralization: 'Zero | Um | Muito!',
    interpolation: {
      key: 'Olá, {0}! Como está {1}?',
      named: 'Olá, {name}! Como está {time}?'
    },
    wow: {
      much: {
        deep: {
          list: [, 'muito profundo']
        }
      }
    },
    obj: {
      a: 'a'
    }
  }
}

i18n(store, [
  locales,
  {
    'pt-br': {
      obj: {
        b: 'b'
      }
    }
  }
])

/**
 * Dummy test
 */
describe('Utilities', () => {
  it('should check if a variable is an object', () => {
    expect(isObject({})).toBe(true)
    expect(isObject(1)).toBe(false)
  })
})

describe('Localization', () => {
  it('should start with a clean store', () => {
    const { _, locale } = store.get()
    expect(locale).toBeFalsy()
    expect(_).toBeFalsy()
  })

  it('should change the locale after a "locale" store event', () => {
    store.fire('locale', 'en')
    const { locale, _ } = store.get()

    expect(locale).toBe('en')
    expect(_).toBeInstanceOf(Function)
  })

  it('should have a .setLocale() method', () => {
    expect(store.setLocale).toBeInstanceOf(Function)

    store.setLocale('pt-br')
    const { locale } = store.get()

    expect(locale).toBe('pt-br')
  })

  it('should return the message id when no message identified by it was found', () => {
    store.setLocale('pt-br')
    const { locale, _ } = store.get()

    expect(_('non.existent')).toBe('non.existent')
  })

  it('should get a message by its id', () => {
    const { _ } = store.get()
    expect(_('test')).toBe(locales['pt-br'].test)
  })

  it('should get a deep nested message by its string path', () => {
    store.setLocale('pt-br')
    const { locale, _ } = store.get()

    expect(_('obj.b')).toBe('b')
  })

  it('should get a message within an array by its index', () => {
    store.setLocale('pt-br')
    const { locale, _ } = store.get()

    expect(_('phrases[1]')).toBe(locales['pt-br'].phrases[1])

    /** Not found */
    expect(_('phrases[2]')).toBe('phrases[2]')
  })

  it('should interpolate with {numeric} placeholders', () => {
    store.setLocale('pt-br')
    const { locale, _ } = store.get()

    expect(_('interpolation.key', ['Chris', 'o dia'])).toBe('Olá, Chris! Como está o dia?')
  })

  it('should interpolate with {named} placeholders', () => {
    store.setLocale('pt-br')
    const { locale, _ } = store.get()

    expect(
      _('interpolation.named', {
        name: 'Chris',
        time: 'o dia'
      })
    ).toBe('Olá, Chris! Como está o dia?')
  })

  it('should handle pluralization with _.plural()', () => {
    store.setLocale('pt-br')
    const { locale, _ } = store.get()

    expect(_.plural('pluralization', 0)).toBe('Zero')
    expect(_.plural('pluralization', 1)).toBe('Um')
    expect(_.plural('pluralization', -1)).toBe('Um')
    expect(_.plural('pluralization', -1000)).toBe('Muito!')
    expect(_.plural('pluralization', 2)).toBe('Muito!')
    expect(_.plural('pluralization', 100)).toBe('Muito!')
  })
})

describe('Localization utilities', () => {
  it('should capital a translated message', () => {
    store.setLocale('pt-br')
    const { _ } = store.get()

    expect(capital(_('phrase'))).toBe('Adoro banana')
  })

  it('should title a translated message', () => {
    store.setLocale('pt-br')
    const { _ } = store.get()

    expect(title(_('phrase'))).toBe('Adoro Banana')
  })

  it('should lowercase a translated message', () => {
    store.setLocale('pt-br')
    const { _ } = store.get()

    expect(lower(_('phrase'))).toBe('adoro banana')
  })

  it('should uppercase a translated message', () => {
    store.setLocale('pt-br')
    const { _ } = store.get()

    expect(upper(_('phrase'))).toBe('ADORO BANANA')
  })
})