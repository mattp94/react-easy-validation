import React from 'react'
import { mount } from 'enzyme'

import ValidationOut from '../../src/components/ValidationOut'

const Input = () => <div>input</div>

const ValidationOutWrapper = props => (
    <ValidationOut {...props}>
        <Input disabled={props.disabled} />
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

        expect(wrapper.find(ValidationOut).prop('error')).toBe('errorText')
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

        const input = wrapper.find(Input)

        expect(input.prop('errorText')).toBeUndefined()

        wrapper.setProps({
            value: ''
        })

        expect(input.prop('errorText')).toBeUndefined()
    })

    it('should pass props to child as well as an error prop', () => {
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

        const input = wrapper.find(Input)

        expect(input.prop('disabled')).toBeUndefined()
        expect(input.prop('errorText')).toBeUndefined()

        wrapper.setProps({
            disabled: false,
            value: ''
        })

        expect(input.prop('disabled')).toBe(false)
        expect(input.prop('errorText')).toBe('Required')

        wrapper.setProps({
            disabled: false
        })

        expect(input.prop('disabled')).toBe(false)
        expect(input.prop('errorText')).toBe('Required')

        wrapper.setProps({
            disabled: true
        })

        expect(input.prop('disabled')).toBe(true)
        expect(input.prop('errorText')).toBe('Required')

        wrapper.setProps({
            value: 'Berlin'
        })

        expect(input.prop('disabled')).toBe(true)
        expect(input.prop('errorText')).toBeUndefined()
    })

    it('should test several validators with err as error prop', () => {
        const wrapper = mount(
            <ValidationOutWrapper
                error="err"
                groups={[]}
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

        const input = wrapper.find(Input)

        expect(input.prop('err')).toBeUndefined()

        wrapper.setProps({
            value: ''
        })

        expect(input.prop('err')).toBe('Required')

        wrapper.setProps({
            value: 'Singapore'
        })

        expect(input.prop('err')).toBe('Too long')

        wrapper.setProps({
            value: 'Rome'
        })

        expect(input.prop('err')).toBe('Only numbers')

        wrapper.setProps({
            value: '1234'
        })

        expect(input.prop('err')).toBeUndefined()
    })

    it('should update validators and error props on the fly', () => {
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

        const input = wrapper.find(Input)

        expect(input.prop('errorText')).toBeUndefined()

        wrapper.setProps({
            value: ''
        })

        expect(input.prop('errorText')).toBe('Required')

        wrapper.setProps({
            error: 'err',
            value: 'Kiev',
            validators: [{
                rule: value => /^\d+$/.test(value),
                hint: 'Only numbers'
            }]
        })

        expect(input.prop('err')).toBe('Only numbers')
    })
})
