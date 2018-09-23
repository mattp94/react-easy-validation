import * as module from '../src'
import ValidationIn from '../src/components/ValidationIn'
import ValidationOut from '../src/components/ValidationOut'
import { clear, validate } from '../src/core'

describe('index', () => {
    it('should have 4 members in module', () => {
        expect(Object.keys(module)).toHaveLength(4)
    })

    it('should have ValidationIn, ValidationOut, clear & validate', () => {
        expect(module.ValidationIn).toBe(ValidationIn)
        expect(module.ValidationOut).toBe(ValidationOut)
        expect(module.clear).toBe(clear)
        expect(module.validate).toBe(validate)
    })
})
