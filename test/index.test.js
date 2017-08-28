import * as module from '../src'
import ValidationIn from '../src/components/ValidationIn'
import ValidationOut from '../src/components/ValidationOut'
import { validate } from '../src/core'

describe('index', () => {
    it('should have 3 members in module', () => {
        expect(Object.keys(module)).toHaveLength(3)
    })

    it('should have ValidationIn, ValidationOut & validate', () => {
        expect(module.ValidationIn).toBe(ValidationIn)
        expect(module.ValidationOut).toBe(ValidationOut)
        expect(module.validate).toBe(validate)
    })
})
