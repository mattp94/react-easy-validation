import React from 'react'
import { mount } from 'enzyme'

import ValidationIn from '../../src/components/ValidationIn'

const Select = () => <div>select</div>

const ValidationInWrapper = props => (
    <ValidationIn {...props}>
        <Select name={props.name} val={props.childValue} />
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

        expect(validationIn.prop('error')).toBe('errorText')
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

        expect(wrapper.find(Select).prop('errorText')).toBeUndefined()

        wrapper.setProps({
            childValue: 'Madrid'
        })

        expect(wrapper.find(Select).prop('errorText')).toBeUndefined()

        wrapper.setProps({
            childValue: 'Brussels',
            value: 'val'
        })

        expect(wrapper.find(Select).prop('errorText')).toBe('Only numbers')
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

        expect(wrapper.find(Select).prop('errorText')).toBeUndefined()

        wrapper.setProps({
            childValue: ''
        })

        expect(wrapper.find(Select).prop('errorText')).toBeUndefined()
    })

    it('should pass props to child as well as an error prop', () => {
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
        expect(select.prop('errorText')).toBeUndefined()

        wrapper.setProps({
            childValue: '',
            name: 'city'
        })

        select = wrapper.find(Select)

        expect(select.prop('name')).toBe('city')
        expect(select.prop('errorText')).toBe('Required')

        wrapper.setProps({
            childValue: ''
        })

        select = wrapper.find(Select)

        expect(select.prop('name')).toBe('city')
        expect(select.prop('errorText')).toBe('Required')

        wrapper.setProps({
            name: 'town'
        })

        select = wrapper.find(Select)

        expect(select.prop('name')).toBe('town')
        expect(select.prop('errorText')).toBe('Required')

        wrapper.setProps({
            childValue: 'Lisbon'
        })

        select = wrapper.find(Select)

        expect(select.prop('name')).toBe('town')
        expect(select.prop('errorText')).toBeUndefined()
    })

    it('should test several validators with err as error prop', () => {
        const wrapper = mount(
            <ValidationInWrapper
                childValue="Taipei"
                error="err"
                groups={[]}
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

        expect(wrapper.find(Select).prop('err')).toBeUndefined()

        wrapper.setProps({
            childValue: 'Helsinki'
        })

        expect(wrapper.find(Select).prop('err')).toBe('Too short')

        wrapper.setProps({
            childValue: 'Stockholm'
        })

        expect(wrapper.find(Select).prop('err')).toBe('Only uppercase')

        wrapper.setProps({
            childValue: 'STOCKHOLM'
        })

        expect(wrapper.find(Select).prop('err')).toBeUndefined()
    })

    it('should update validators and error props on the fly', () => {
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

        expect(wrapper.find(Select).prop('errorText')).toBeUndefined()

        wrapper.setProps({
            childValue: 'Buenos Aires'
        })

        expect(wrapper.find(Select).prop('errorText')).toBe('Too long')

        wrapper.setProps({
            error: 'err',
            childValue: 'Riga',
            validators: [{
                rule: value => value.length > 4,
                hint: 'Too short'
            }]
        })

        expect(wrapper.find(Select).prop('err')).toBe('Too short')
    })
})
