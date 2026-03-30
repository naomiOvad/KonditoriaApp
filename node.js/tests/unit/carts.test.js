// Refs: C1; node.js/controller/carts.js (module-level exports + all handlers)
// Change: comment-only noop addition — minimal regression coverage for touched module
import { vi, describe, it, expect, beforeEach } from 'vitest'
import * as fs from 'fs'
import cartsController from '../../controller/carts.js'

vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    readFile: vi.fn(),
    writeFile: vi.fn()
  }
})

/** Creates fresh req/res mocks for each test. */
function makeReqRes(params = {}, body = {}) {
  const sendAfterStatus = vi.fn()
  const req = { params, body }
  const res = {
    send: vi.fn(),
    status: vi.fn().mockReturnValue({ send: sendAfterStatus })
  }
  return { req, res, sendAfterStatus }
}

describe('carts controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ─── MUST ────────────────────────────────────────────────────────────────

  it('C1_U_001 module loads without throwing and exposes all expected exports', () => {
    // Refs: C1; node.js/controller/carts.js (module-level exports)
    expect(typeof cartsController.get).toBe('function')
    expect(typeof cartsController.getById).toBe('function')
    expect(typeof cartsController.post).toBe('function')
    expect(typeof cartsController.put).toBe('function')
    expect(typeof cartsController.delete).toBe('function')
    expect(typeof cartsController.addProductToCart).toBe('function')
    expect(typeof cartsController.updateProductQuantity).toBe('function')
    expect(typeof cartsController.removeProductFromCart).toBe('function')
  })

  describe('get', () => {
    it('C1_U_002 get handler responds with parsed JSON array on fs.readFile success', () => {
      // Refs: C1; node.js/controller/carts.js (exports.get)
      const carts = [{ userId: 1, cart: [] }]
      vi.mocked(fs.readFile).mockImplementation((_path, _enc, cb) => {
        cb(null, JSON.stringify(carts))
      })
      const { req, res } = makeReqRes()
      cartsController.get(req, res)
      expect(res.send).toHaveBeenCalledWith(carts)
    })

    it('C1_U_003 get handler responds with HTTP 500 when fs.readFile returns an error', () => {
      // Refs: C1; node.js/controller/carts.js (exports.get, error branch)
      vi.mocked(fs.readFile).mockImplementation((_path, _enc, cb) => {
        cb(new Error('disk error'))
      })
      const { req, res, sendAfterStatus } = makeReqRes()
      cartsController.get(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(sendAfterStatus).toHaveBeenCalled()
    })
  })

  // ─── SHOULD ──────────────────────────────────────────────────────────────

  describe('getById', () => {
    it('C1_U_004 getById returns empty cart object when no matching cart exists for userId', () => {
      // Refs: C1; node.js/controller/carts.js (exports.getById, not-found branch)
      vi.mocked(fs.readFile).mockImplementation((_path, _enc, cb) => {
        cb(null, JSON.stringify([]))
      })
      const { req, res } = makeReqRes({ id: '42' })
      cartsController.getById(req, res)
      expect(res.send).toHaveBeenCalledWith({ userId: 42, cart: [] })
    })
  })

  describe('post', () => {
    it('C1_U_005 post returns 400 when a cart with the same userId already exists', () => {
      // Refs: C1; node.js/controller/carts.js (exports.post, duplicate-cart guard)
      const existing = { userId: 5, cart: [] }
      vi.mocked(fs.readFile).mockImplementation((_path, _enc, cb) => {
        cb(null, JSON.stringify([existing]))
      })
      const { req, res, sendAfterStatus } = makeReqRes({}, { userId: 5, cart: [] })
      cartsController.post(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(sendAfterStatus).toHaveBeenCalled()
    })
  })

  describe('addProductToCart', () => {
    it('C1_U_006 addProductToCart accumulates quantity when product already exists in cart', () => {
      // Refs: C1; node.js/controller/carts.js (exports.addProductToCart, existing-product branch)
      const initial = { userId: 3, cart: [{ id: 10, name: 'cake', quantity: 2 }] }
      vi.mocked(fs.readFile).mockImplementation((_path, _enc, cb) => {
        cb(null, JSON.stringify([initial]))
      })
      vi.mocked(fs.writeFile).mockImplementation((_path, _data, cb) => {
        cb(null)
      })
      const { req, res } = makeReqRes({ id: '3' }, { id: 10, name: 'cake', quantity: 3 })
      cartsController.addProductToCart(req, res)
      const writtenCarts = JSON.parse(vi.mocked(fs.writeFile).mock.calls[0][1])
      expect(writtenCarts[0].cart[0].quantity).toBe(5)
    })
  })

  // ─── CONSIDER ────────────────────────────────────────────────────────────

  describe('put', () => {
    it('C1_U_007 put returns 404 when userId is not found in carts', () => {
      // Refs: C1; node.js/controller/carts.js (exports.put)
      vi.mocked(fs.readFile).mockImplementation((_path, _enc, cb) => {
        cb(null, JSON.stringify([]))
      })
      const { req, res, sendAfterStatus } = makeReqRes({ id: '99' }, { cart: [] })
      cartsController.put(req, res)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(sendAfterStatus).toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('C1_U_008 delete removes the cart entry and responds with the deleted item', () => {
      // Refs: C1; node.js/controller/carts.js (exports.delete)
      const cart = { userId: 7, cart: [] }
      vi.mocked(fs.readFile).mockImplementation((_path, _enc, cb) => {
        cb(null, JSON.stringify([cart]))
      })
      vi.mocked(fs.writeFile).mockImplementation((_path, _data, cb) => {
        cb(null)
      })
      const { req, res } = makeReqRes({ id: '7' })
      cartsController.delete(req, res)
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ deleted: cart }))
    })
  })

  describe('updateProductQuantity', () => {
    it('C1_U_009 updateProductQuantity returns 404 when the product is not in the cart', () => {
      // Refs: C1; node.js/controller/carts.js (exports.updateProductQuantity)
      const cart = { userId: 2, cart: [{ id: 1, quantity: 1 }] }
      vi.mocked(fs.readFile).mockImplementation((_path, _enc, cb) => {
        cb(null, JSON.stringify([cart]))
      })
      const { req, res, sendAfterStatus } = makeReqRes({ userId: '2', productId: '999' }, { quantity: 5 })
      cartsController.updateProductQuantity(req, res)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(sendAfterStatus).toHaveBeenCalled()
    })
  })

  describe('removeProductFromCart', () => {
    it('C1_U_010 removeProductFromCart returns 404 when the product is not found in cart', () => {
      // Refs: C1; node.js/controller/carts.js (exports.removeProductFromCart)
      const cart = { userId: 4, cart: [{ id: 1 }] }
      vi.mocked(fs.readFile).mockImplementation((_path, _enc, cb) => {
        cb(null, JSON.stringify([cart]))
      })
      const { req, res, sendAfterStatus } = makeReqRes({ userId: '4', productId: '999' })
      cartsController.removeProductFromCart(req, res)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(sendAfterStatus).toHaveBeenCalled()
    })
  })
})
