// src/lib/logger.ts
// ─────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Structured Logging Engine
// Production v1.0.0
// ─────────────────────────────────────────────────────────────────────

import * as Sentry from '@sentry/nextjs'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical'

export interface LogContext {
  category: 'API' | 'PAYMENT' | 'BOOKING' | 'DATABASE' | 'SYSTEM'
  entityId?: string
  userId?: string
  meta?: Record<string, any>
}

export class Logger {
  private static isProduction = process.env.NODE_ENV === 'production'

  /**
   * Core routing pipeline for tracking and dispatching application logs.
   */
  private static out(level: LogLevel, message: string, context: LogContext, errorInstance?: Error) {
    const timestamp = new Date().toISOString()
    
    // 1. Structure log payload for standardized ingestion engines (Datadog/Logflare/Vercel)
    const payload = {
      timestamp,
      level: level.toUpperCase(),
      category: context.category,
      message,
      entityId: context.entityId || null,
      userId: context.userId || null,
      metadata: context.meta || {},
      error: errorInstance ? {
        name: errorInstance.name,
        message: errorInstance.message,
        stack: errorInstance.stack
      } : null
    }

    if (this.isProduction) {
      console.log(JSON.stringify(payload))
    } else {
      // Clean readable format for local development sandboxes
      const color = 
        level === 'error' || level === 'critical' ? '\x1b[31m' : 
        level === 'warn' ? '\x1b[33m' : '\x1b[32m'
      console.log(`[${timestamp}] ${color}${level.toUpperCase()}\x1b[0m [${context.category}]: ${message}`, context.meta || '')
    }

    // 2. Escalate dangerous anomalies automatically to Sentry with strict tag mapping
    if (level === 'error' || level === 'critical') {
      Sentry.withScope((scope) => {
        scope.setLevel(level === 'critical' ? 'fatal' : 'error')
        scope.setTag('category', context.category)
        
        if (context.entityId) scope.setTag('entity_id', context.entityId)
        if (context.userId) scope.setUser({ id: context.userId })
        if (context.meta) scope.setContext('operational_metadata', context.meta)

        if (errorInstance) {
          Sentry.captureException(errorInstance)
        } else {
          Sentry.captureMessage(`[${context.category}] ${message}`)
        }
      })
    }
  }

  static debug(message: string, context: LogContext) { this.out('debug', message, context) }
  static info(message: string, context: LogContext) { this.out('info', message, context) }
  static warn(message: string, context: LogContext) { this.out('warn', message, context) }
  
  static error(message: string, context: LogContext, error?: Error) { 
    this.out('error', message, context, error) 
  }
  
  static critical(message: string, context: LogContext, error?: Error) { 
    this.out('critical', message, context, error) 
  }
}