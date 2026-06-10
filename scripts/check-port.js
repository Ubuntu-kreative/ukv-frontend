#!/usr/bin/env node

/**
 * check-port.js — Port Availability Guard
 * 
 * Checks if port 3000 is already in use before starting dev server.
 * Exits with clear error message if port is taken, preventing duplicate instances.
 */

const net = require('net')
const PORT = 3000

function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer()

    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false) // Port in use
      } else {
        resolve(true) // Other error, allow start
      }
    })

    server.once('listening', () => {
      server.close()
      resolve(true) // Port available
    })

    server.listen(port, '127.0.0.1')
  })
}

async function main() {
  console.log(`🔍 Checking if port ${PORT} is available...`)

  const available = await checkPort(PORT)

  if (!available) {
    console.error(`
╔════════════════════════════════════════════════════════════════╗
║                    ⚠️  PORT ${PORT} IN USE                      ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Another Next.js dev server is already running on port ${PORT}.  ║
║                                                                ║
║  🛑 BLOCKED: Cannot start duplicate dev server instance.      ║
║                                                                ║
║  ✅ FIX:  Run one of these commands:                          ║
║                                                                ║
║    1. Kill the existing process:                             ║
║       lsof -ti:${PORT} | xargs kill -9                           ║
║                                                                ║
║    2. Or use a different port:                               ║
║       npm run dev -- -p 3001                                 ║
║                                                                ║
║  💡 To prevent this in future, use VS Code terminal:         ║
║     - Only one "npm run dev" per workspace                   ║
║     - Kill server before restarting (Ctrl+C)                 ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`)
    process.exit(1)
  }

  console.log(`✅ Port ${PORT} is available. Starting dev server...\n`)
  process.exit(0)
}

main().catch((err) => {
  console.error('Port check failed:', err)
  process.exit(1)
})
