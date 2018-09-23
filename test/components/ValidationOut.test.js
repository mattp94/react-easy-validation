import React from 'react'
import { mount } from 'enzyme'

import ValidationOut from '../../src/components/ValidationOut'

const Input = () => <div>input</div>

const ValidationOutWrapper = ({ disabled, ...other }) => (
    <ValidationOut {...other}>
        <Input disabled={disabled} />
    </ValidationOut>
)

describe('<ValidationOut />', () => {
    it('should have a default prop', () => {
        const wrapper = mount(
            <ValidationOutWrapper
                groups={[]}
                validators={[]}
                value="Paris"
            />
        )

        const validationOut = wrapper.find(ValidationOut)

        expect(validationOut.prop('error')).toBe('error')
        expect(validationOut.prop('helper')).toBe('helperText')
    })

    it('should render an input', () => {
        const wrapper = mount(
            <ValidationOutWrapper
                groups={[]}
                validators={[]}
                value="Hong Kong"
            />
        )

        expect(wrapper.find('div').text()).toBe('input')
    })

    it('should validate nothing as there is no validator', () => {
        const wrapper = mount(
            <ValidationOutWrapper
                groups={[]}
                validators={[]}
                value="New Delhi"
            />
        )

        let input = wrapper.find(Input)

        expect(input.prop('error')).toBeUndefined()
        expect(input.prop('helperText')).toBeUndefined()

        wrapper.setProps({
            value: ''
        })

        input = wrapper.find(Input)

        expect(input.prop('error')).toBeUndefined()
        expect(input.prop('helperText')).toBeUndefined()
    })

    it('should pass props to child as well as error / helperText props', () => {
        const wrapper = mount(
            <ValidationOutWrapper
                groups={[]}
                validators={[{
                    rule: value => value,
                    hint: 'Required'
                }]}
                value="London"
            />
        )

        let input = wrapper.find(Input)

        expect(input.prop('disabled')).toBeUndefined()
        expect(input.prop('error')).toBeUndefined()
        expect(input.prop('helperText')).toBeUndefined()

        wrapper.setProps({
            disabled: false,
            value: ''
        })

        input = wrapper.find(Input)

        expect(input.prop('disabled')).toBe(false)
        expect(input.prop('error')).toBe(true)
        expect(input.prop('helperText')).toBe('Required')

        wrapper.setProps({
            disabled: false
        })

        input = wrapper.find(Input)

        expect(input.prop('disabled')).toBe(false)
        expect(input.prop('error')).toBe(true)
        expect(input.prop('helperText')).toBe('Required')

        wrapper.setProps({
            disabled: true
        })

        input = wrapper.find(Input)

        expect(input.prop('disabled')).toBe(true)
        expect(input.prop('error')).toBe(true)
        expect(input.prop('helperText')).toBe('Required')

        wrapper.setProps({
            value: 'Berlin'
        })

        input = wrapper.find(Input)

        expect(input.prop('disabled')).toBe(true)
        expect(input.prop('error')).toBeUndefined()
        expect(input.prop('helperText')).toBeUndefined()
    })

    it('should test several validators with err / msg as error / helper props', () => {
        const wrapper = mount(
            <ValidationOutWrapper
                error="err"
                groups={[]}
                helper="msg"
                validators={[{
                    rule: value => value,
                    hint: 'Required'
                }, {
                    rule: value => value.length < 5,
                    hint: 'Too long'
                }, {
                    rule: value => /^\d+$/.test(value),
                    hint: 'Only numbers'
                }]}
                value="Tokyo"
            />
        )

        let input = wrapper.find(Input)

        expect(input.prop('err')).toBeUndefined()
        expect(input.prop('msg')).toBeUndefined()

        wrapper.setProps({
            value: ''
        })

        input = wrapper.find(Input)

        expect(input.prop('err')).toBe(true)
        expect(input.prop('msg')).toBe('Required')

        wrapper.setProps({
            value: 'Singapore'
        })

        input = wrapper.find(Input)

        expect(input.prop('err')).toBe(true)
        expect(input.prop('msg')).toBe('Too long')

        wrapper.setProps({
            value: 'Rome'
        })

        input = wrapper.find(Input)

        expect(input.prop('err')).toBe(true)
        expect(input.prop('msg')).toBe('Only numbers')

        wrapper.setProps({
            value: '1234'
        })

        input = wrapper.find(Input)

        expect(input.prop('err')).toBeUndefined()
        expect(input.prop('msg')).toBeUndefined()
    })

    it('should update validators, error and helper props on the fly', () => {
        const wrapper = mount(
            <ValidationOutWrapper
                groups={[]}
                validators={[{
                    rule: value => value,
                    hint: 'Required'
                }]}
                value="Prague"
            />
        )

        let input = wrapper.find(Input)

        expect(input.prop('error')).toBeUndefined()
        expect(input.prop('helperText')).toBeUndefined()

        wrapper.setProps({
            value: ''
        })

        input = wrapper.find(Input)

        expect(input.prop('error')).toBe(true)
        expect(input.prop('helperText')).toBe('Required')

        wrapper.setProps({
            error: 'err',
            helper: 'msg',
            value: 'Kiev',
            validators: [{
                rule: value => /^\d+$/.test(value),
                hint: 'Only numbers'
            }]
        })

        input = wrapper.find(Input)

        expect(input.prop('err')).toBe(true)
        expect(input.prop('msg')).toBe('Only numbers')
    })
})
