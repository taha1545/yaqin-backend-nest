import { BadRequestException } from '@nestjs/common'
import type { ValidationError } from 'class-validator'

export class ValidationException extends BadRequestException {
  constructor(errors: ValidationError[]) {
    const details: Record<string, string> = {}
    flattenErrors(errors, details, '')
    super({
      message: 'Validation error',
      details,
    })
  }
}

function flattenErrors(errors: ValidationError[], target: Record<string, string>, prefix: string): void {
  for (const error of errors) {
    const key = prefix ? `${prefix}.${error.property}` : error.property
    if (error.constraints) {
      target[key] = Object.values(error.constraints).join(', ')
    }
    if (error.children && error.children.length > 0) {
      flattenErrors(error.children, target, key)
    }
  }
}