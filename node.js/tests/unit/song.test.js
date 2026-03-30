import { vi, describe, it, expect, beforeEach } from 'vitest'
import * as fs from 'fs'

// Refs: C1; node.js/controller/song.js
vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    readFile: vi.fn(),
    writeFile: vi.fn(),
  }
})

import { get, getById, post } from '../../controller/song.js'

describe('song controller', () => {
  let mockRes
  let statusObj

  beforeEach(() => {
    vi.clearAllMocks()
    statusObj = { send: vi.fn() }
    mockRes = {
      send: vi.fn(),
      status: vi.fn().mockReturnValue(statusObj),
    }
  })

  // ── MUST ─────────────────────────────────────────────────────────────────

  it('C1_U_001 module exports get, getById, and post as functions', () => {
    // Refs: C1; node.js/controller/song.js (exports.get, exports.getById, exports.post)
    expect(typeof get).toBe('function')
    expect(typeof getById).toBe('function')
    expect(typeof post).toBe('function')
  })

  it('C1_U_002 get handler sends parsed song data on successful file read', () => {
    // Refs: C1; node.js/controller/song.js (function get)
    const songs = [{ id: 1, title: 'Song A' }, { id: 2, title: 'Song B' }]
    vi.mocked(fs.readFile).mockImplementation((filePath, options, cb) => {
      cb(null, JSON.stringify(songs))
    })
    get({}, mockRes)
    expect(fs.readFile).toHaveBeenCalledWith('songs.json', 'utf-8', expect.any(Function))
    expect(mockRes.send).toHaveBeenCalledWith(songs)
  })

  it('C1_U_003 get handler responds with 500 when file read fails', () => {
    // Refs: C1; node.js/controller/song.js (function get)
    vi.mocked(fs.readFile).mockImplementation((filePath, options, cb) => {
      cb(new Error('read error'), null)
    })
    get({}, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(500)
    expect(statusObj.send).toHaveBeenCalled()
  })

  // ── SHOULD ────────────────────────────────────────────────────────────────

  it('C1_U_004 getById sends matching song when found by id', () => {
    // Refs: C1; node.js/controller/song.js (exports.getById)
    const songs = [{ id: 1, title: 'Song A' }, { id: 2, title: 'Song B' }]
    vi.mocked(fs.readFile).mockImplementation((filePath, options, cb) => {
      cb(null, JSON.stringify(songs))
    })
    getById({ params: { id: '1' } }, mockRes)
    expect(mockRes.send).toHaveBeenCalledWith({ id: 1, title: 'Song A' })
  })

  it('C1_U_005 getById responds with 500 when song is not found by id', () => {
    // Refs: C1; node.js/controller/song.js (exports.getById)
    const songs = [{ id: 1, title: 'Song A' }]
    vi.mocked(fs.readFile).mockImplementation((filePath, options, cb) => {
      cb(null, JSON.stringify(songs))
    })
    getById({ params: { id: '99' } }, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(500)
    expect(statusObj.send).toHaveBeenCalled()
  })

  // ── CONSIDER ─────────────────────────────────────────────────────────────

  it('C1_U_006 post adds new song and responds with success message', () => {
    // Refs: C1; node.js/controller/song.js (exports.post)
    const existingSongs = [{ id: 1, title: 'Song A' }]
    vi.mocked(fs.readFile).mockImplementation((filePath, options, cb) => {
      cb(null, JSON.stringify(existingSongs))
    })
    vi.mocked(fs.writeFile).mockImplementation((filePath, data, cb) => {
      cb(null)
    })
    post({ body: { id: 2, title: 'Song B' } }, mockRes)
    expect(mockRes.send).toHaveBeenCalledWith('sucess add')
  })

  it('C1_U_007 post responds with 500 when file write fails', () => {
    // Refs: C1; node.js/controller/song.js (exports.post)
    const existingSongs = [{ id: 1, title: 'Song A' }]
    vi.mocked(fs.readFile).mockImplementation((filePath, options, cb) => {
      cb(null, JSON.stringify(existingSongs))
    })
    vi.mocked(fs.writeFile).mockImplementation((filePath, data, cb) => {
      cb(new Error('write error'))
    })
    post({ body: { id: 2, title: 'Song B' } }, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(500)
    expect(statusObj.send).toHaveBeenCalled()
  })
})
