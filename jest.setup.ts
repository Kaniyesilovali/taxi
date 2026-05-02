import '@testing-library/jest-dom'
import vm from 'vm'

// jest-environment-jsdom runs tests in a jsdom VM sandbox that does not include
// Node 18+ built-in fetch globals (fetch, Response, Request, Headers).
// We use vm.runInThisContext() to reach outside the sandbox into Node's actual
// global context and copy the constructors into the jsdom global.
for (const name of ['fetch', 'Response', 'Request', 'Headers'] as const) {
  if (typeof (global as Record<string, unknown>)[name] === 'undefined') {
    try {
      const value = vm.runInThisContext(name)
      if (value !== undefined) {
        ;(global as Record<string, unknown>)[name] = value
      }
    } catch {
      // Not available in this Node version — skip silently
    }
  }
}
