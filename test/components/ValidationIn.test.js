import React from 'react'
import { mount } from 'enzyme'

import ValidationIn from '../../src/components/ValidationIn'

const Select = () => <div>select</div>

const ValidationInWrapper = ({ name, childValue, ...other }) => (
    <ValidationIn {...other}>
        <Select name={name} val={childValue} />
    </ValidationIn>
)

describe('<ValidationIn />', () => {
    it('should have default props', () => {
        const wrapper = mount(
            <ValidationInWrapper
                groups={[]}
                validators={[]}
            />
        )

        const validationIn = wrapper.find(ValidationIn)

        expect(validationIn.prop('error')).toBe('error')
        expect(validationIn.prop('helper')).toBe('helperText')
        expect(validationIn.prop('value')).toBe('value')
    })

    it('should render a select', () => {
        const wrapper = mount(
            <ValidationInWrapper
                groups={[]}
                validators={[]}
            />
        )

        expect(wrapper.find('div').text()).toBe('select')
    })

    it('should not validate select because name of value prop is incorrect', () => {
        const wrapper = mount(
            <ValidationInWrapper
                childValue="Moscow"
                groups={[]}
                validators={[{
                    rule: value => /^\d+$/.test(value),
                    hint: 'Only numbers'
                }]}
            />
        )

        let select = wrapper.find(Select)

        expect(select.prop('error')).toBeUndefined()
        expect(select.prop('helperText')).toBeUndefined()

        wrapper.setProps({
            childValue: 'Madrid'
        })

        select = wrapper.find(Select)

        expect(select.prop('error')).toBeUndefined()
        expect(select.prop('helperText')).toBeUndefined()

        wrapper.setProps({
            childValue: 'Brussels',
            value: 'val'
        })

        select = wrapper.find(Select)

        expect(select.prop('error')).toBe(true)
        expect(select.prop('helperText')).toBe('Only numbers')
    })

    it('should validate nothing as there is no validator', () => {
        const wrapper = mount(
            <ValidationInWrapper
                childValue="Canberra"
                groups={[]}
                validators={[]}
                value="val"
            />
        )

        let select = wrapper.find(Select)

        expect(select.prop('error')).toBeUndefined()
        expect(select.prop('helperText')).toBeUndefined()

        wrapper.setProps({
            childValue: ''
        })

        select = wrapper.find(Select)

        expect(select.prop('error')).toBeUndefined()
        expect(select.prop('helperText')).toBeUndefined()
    })

    it('should pass props to child as well as error / helperText props', () => {
        const wrapper = mount(
            <ValidationInWrapper
                childValue="Seoul"
                groups={[]}
                validators={[{
                    rule: value => value,
                    hint: 'Required'
                }]}
                value="val"
            />
        )

        let select = wrapper.find(Select)

        expect(select.prop('name')).toBeUndefined()
        expect(select.prop('error')).toBeUndefined()
        expect(select.prop('helperText')).toBeUndefined()

        wrapper.setProps({
            childValue: '',
            name: 'city'
        })

        select = wrapper.find(Select)

        expect(select.prop('name')).toBe('city')
        expect(select.prop('error')).toBe(true)
        expect(select.prop('helperText')).toBe('Required')

        wrapper.setProps({
            childValue: ''
        })

        select = wrapper.find(Select)

        expect(select.prop('name')).toBe('city')
        expect(select.prop('error')).toBe(true)
        expect(select.prop('helperText')).toBe('Required')

        wrapper.setProps({
            name: 'town'
        })

        select = wrapper.find(Select)

        expect(select.prop('name')).toBe('town')
        expect(select.prop('error')).toBe(true)
        expect(select.prop('helperText')).toBe('Required')

        wrapper.setProps({
            childValue: 'Lisbon'
        })

        select = wrapper.find(Select)

        expect(select.prop('name')).toBe('town')
        expect(select.prop('error')).toBeUndefined()
        expect(select.prop('helperText')).toBeUndefined()
    })

    it('should test several validators with err / msg as error / helper props', () => {
        const wrapper = mount(
            <ValidationInWrapper
                childValue="Taipei"
                error="err"
                groups={[]}
                helper="msg"
                validators={[{
                    rule: value => value.length > 8,
                    hint: 'Too short'
                }, {
                    rule: value => /^[A-Z]+$/.test(value),
                    hint: 'Only uppercase'
                }]}
                value="val"
            />
        )

        let select = wrapper.find(Select)

        expect(select.prop('err')).toBeUndefined()
        expect(select.prop('msg')).toBeUndefined()

        wrapper.setProps({
            childValue: 'Helsinki'
        })

        select = wrapper.find(Select)

        expect(select.prop('err')).toBe(true)
        expect(select.prop('msg')).toBe('Too short')

        wrapper.setProps({
            childValue: 'Stockholm'
        })

        select = wrapper.find(Select)

        expect(select.prop('err')).toBe(true)
        expect(select.prop('msg')).toBe('Only uppercase')

        wrapper.setProps({
            childValue: 'STOCKHOLM'
        })

        select = wrapper.find(Select)

        expect(select.prop('err')).toBeUndefined()
        expect(select.prop('msg')).toBeUndefined()
    })

    it('should update validators, error and helper props on the fly', () => {
        const wrapper = mount(
            <ValidationInWrapper
                childValue=""
                groups={[]}
                validators={[{
                    rule: value => value.length < 5,
                    hint: 'Too long'
                }]}
                value="val"
            />
        )

        let select = wrapper.find(Select)

        expect(select.prop('error')).toBeUndefined()
        expect(select.prop('helperText')).toBeUndefined()

        wrapper.setProps({
            childValue: 'Buenos Aires'
        })

        select = wrapper.find(Select)

        expect(select.prop('error')).toBe(true)
        expect(select.prop('helperText')).toBe('Too long')

        wrapper.setProps({
            childValue: 'Riga',
            error: 'err',
            helper: 'msg',
            validators: [{
                rule: value => value.length > 4,
                hint: 'Too short'
            }]
        })

        select = wrapper.find(Select)

        expect(select.prop('err')).toBe(true)
        expect(select.prop('msg')).toBe('Too short')
    })
})
