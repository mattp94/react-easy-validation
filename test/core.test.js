import React, { Fragment } from 'react'
import { mount } from 'enzyme'

import ValidationIn from '../src/components/ValidationIn'
import ValidationOut from '../src/components/ValidationOut'
import { clear, elements, validate } from '../src/core'

const Textarea = () => <div>textarea</div>

const CoreWrapper = props => (
    <Fragment>
        <ValidationOut
            groups={props.groups0}
            validators={props.validators0}
            value={props.value0}>
            <Textarea />
        </ValidationOut>
        <ValidationIn
            groups={props.groups1}
            validators={props.validators1}>
            <Textarea value={props.childValue1} />
        </ValidationIn>
        <ValidationOut
            groups={props.groups2}
            validators={props.validators2}
            value={props.value2}>
            <Textarea />
        </ValidationOut>
        <ValidationIn
            groups={props.groups3}
            validators={props.validators3}>
            <Textarea value={props.childValue3} />
        </ValidationIn>
    </Fragment>
)

describe('core', () => {
    beforeEach(() => {
        elements.clear()
    })

    it('should validate nothing in group as there is no element', () => {
        expect(elements.size).toBe(0)
        expect(validate('group')).toBe(true)
    })

    it('should add elements and delete them after unmounting', () => {
        const wrapper = mount(
            <CoreWrapper
                groups0={['groupA']}
                groups1={['groupA']}
                groups2={['groupB']}
                groups3={['groupA', 'groupB']}
                validators0={[]}
                validators1={[]}
                validators2={[]}
                validators3={[]}
                value0="Copenhagen"
                childValue1="Hanoi"
                value2="Ottawa"
                childValue3="Bucharest"
            />
        )

        expect(elements.size).toBe(4)

        expect(elements.has(wrapper.find(ValidationOut).at(0).instance())).toBe(true)
        expect(elements.has(wrapper.find(ValidationIn).at(0).instance())).toBe(true)
        expect(elements.has(wrapper.find(ValidationOut).at(1).instance())).toBe(true)
        expect(elements.has(wrapper.find(ValidationIn).at(1).instance())).toBe(true)

        wrapper.unmount()

        expect(elements.size).toBe(0)
    })

    it('should loudly validate groups', () => {
        const wrapper = mount(
            <CoreWrapper
                groups0={['groupA', 'groupC']}
                groups1={['groupA']}
                groups2={['groupA', 'groupB']}
                groups3={['groupB']}
                validators0={[{
                    rule: value => /^\d+$/.test(value),
                    hint: 'Only numbers'
                }]}
                validators1={[{
                    rule: value => value,
                    hint: 'Required'
                }]}
                validators2={[]}
                validators3={[{
                    rule: value => value.length > 6,
                    hint: 'Too short'
                }]}
                value0="Bratislava"
                childValue1=""
                value2="Lima"
                childValue3="Dublin"
            />
        )

        let textarea0 = wrapper.find(Textarea).at(0)
        let textarea1 = wrapper.find(Textarea).at(1)
        let textarea2 = wrapper.find(Textarea).at(2)
        let textarea3 = wrapper.find(Textarea).at(3)

        expect(textarea0.prop('error')).toBeUndefined()
        expect(textarea0.prop('helperText')).toBeUndefined()

        expect(textarea1.prop('error')).toBeUndefined()
        expect(textarea1.prop('helperText')).toBeUndefined()

        expect(textarea2.prop('error')).toBeUndefined()
        expect(textarea2.prop('helperText')).toBeUndefined()

        expect(textarea3.prop('error')).toBeUndefined()
        expect(textarea3.prop('helperText')).toBeUndefined()

        expect(validate('groupA')).toBe(false)
        expect(validate('groupB')).toBe(false)
        expect(validate('groupC')).toBe(false)

        wrapper.update()

        textarea0 = wrapper.find(Textarea).at(0)
        textarea1 = wrapper.find(Textarea).at(1)
        textarea2 = wrapper.find(Textarea).at(2)
        textarea3 = wrapper.find(Textarea).at(3)

        expect(textarea0.prop('error')).toBe(true)
        expect(textarea0.prop('helperText')).toBe('Only numbers')

        expect(textarea1.prop('error')).toBe(true)
        expect(textarea1.prop('helperText')).toBe('Required')

        expect(textarea2.prop('error')).toBeUndefined()
        expect(textarea2.prop('helperText')).toBeUndefined()

        expect(textarea3.prop('error')).toBe(true)
        expect(textarea3.prop('helperText')).toBe('Too short')

        wrapper.setProps({
            value0: '9876'
        })

        textarea0 = wrapper.find(Textarea).at(0)

        expect(textarea0.prop('error')).toBeUndefined()
        expect(textarea0.prop('helperText')).toBeUndefined()

        expect(validate('groupA')).toBe(false)
        expect(validate('groupB')).toBe(false)
        expect(validate('groupC')).toBe(true)

        wrapper.update()

        textarea0 = wrapper.find(Textarea).at(0)
        textarea1 = wrapper.find(Textarea).at(1)
        textarea2 = wrapper.find(Textarea).at(2)
        textarea3 = wrapper.find(Textarea).at(3)

        expect(textarea0.prop('error')).toBeUndefined()
        expect(textarea0.prop('helperText')).toBeUndefined()

        expect(textarea1.prop('error')).toBe(true)
        expect(textarea1.prop('helperText')).toBe('Required')

        expect(textarea2.prop('error')).toBeUndefined()
        expect(textarea2.prop('helperText')).toBeUndefined()

        expect(textarea3.prop('error')).toBe(true)
        expect(textarea3.prop('helperText')).toBe('Too short')

        wrapper.setProps({
            childValue1: 'Oslo'
        })

        textarea1 = wrapper.find(Textarea).at(1)

        expect(textarea1.prop('error')).toBeUndefined()
        expect(textarea1.prop('helperText')).toBeUndefined()

        expect(validate('groupA')).toBe(true)
        expect(validate('groupB')).toBe(false)
        expect(validate('groupC')).toBe(true)

        wrapper.update()

        textarea0 = wrapper.find(Textarea).at(0)
        textarea1 = wrapper.find(Textarea).at(1)
        textarea2 = wrapper.find(Textarea).at(2)
        textarea3 = wrapper.find(Textarea).at(3)

        expect(textarea0.prop('error')).toBeUndefined()
        expect(textarea0.prop('helperText')).toBeUndefined()

        expect(textarea1.prop('error')).toBeUndefined()
        expect(textarea1.prop('helperText')).toBeUndefined()

        expect(textarea2.prop('error')).toBeUndefined()
        expect(textarea2.prop('helperText')).toBeUndefined()

        expect(textarea3.prop('error')).toBe(true)
        expect(textarea3.prop('helperText')).toBe('Too short')

        wrapper.setProps({
            value2: ''
        })

        textarea2 = wrapper.find(Textarea).at(2)

        expect(textarea2.prop('error')).toBeUndefined()
        expect(textarea2.prop('helperText')).toBeUndefined()

        expect(validate('groupA')).toBe(true)
        expect(validate('groupB')).toBe(false)
        expect(validate('groupC')).toBe(true)

        wrapper.update()

        textarea0 = wrapper.find(Textarea).at(0)
        textarea1 = wrapper.find(Textarea).at(1)
        textarea2 = wrapper.find(Textarea).at(2)
        textarea3 = wrapper.find(Textarea).at(3)

        expect(textarea0.prop('error')).toBeUndefined()
        expect(textarea0.prop('helperText')).toBeUndefined()

        expect(textarea1.prop('error')).toBeUndefined()
        expect(textarea1.prop('helperText')).toBeUndefined()

        expect(textarea2.prop('error')).toBeUndefined()
        expect(textarea2.prop('helperText')).toBeUndefined()

        expect(textarea3.prop('error')).toBe(true)
        expect(textarea3.prop('helperText')).toBe('Too short')

        wrapper.setProps({
            childValue3: 'Kuala Lumpur'
        })

        textarea3 = wrapper.find(Textarea).at(3)

        expect(textarea3.prop('error')).toBeUndefined()
        expect(textarea3.prop('helperText')).toBeUndefined()

        expect(validate('groupA')).toBe(true)
        expect(validate('groupB')).toBe(true)
        expect(validate('groupC')).toBe(true)

        wrapper.update()

        textarea0 = wrapper.find(Textarea).at(0)
        textarea1 = wrapper.find(Textarea).at(1)
        textarea2 = wrapper.find(Textarea).at(2)
        textarea3 = wrapper.find(Textarea).at(3)

        expect(textarea0.prop('error')).toBeUndefined()
        expect(textarea0.prop('helperText')).toBeUndefined()

        expect(textarea1.prop('error')).toBeUndefined()
        expect(textarea1.prop('helperText')).toBeUndefined()

        expect(textarea2.prop('error')).toBeUndefined()
        expect(textarea2.prop('helperText')).toBeUndefined()

        expect(textarea3.prop('error')).toBeUndefined()
        expect(textarea3.prop('helperText')).toBeUndefined()
    })

    it('should silently validate groups', () => {
        const wrapper = mount(
            <CoreWrapper
                groups0={['groupB']}
                groups1={['groupA', 'groupB']}
                groups2={['groupB']}
                groups3={['groupA']}
                validators0={[{
                    rule: value => value.endsWith('e'),
                    hint: 'Must finish with e'
                }]}
                validators1={[{
                    rule: value => value.length < 5,
                    hint: 'Too long'
                }]}
                validators2={[{
                    rule: value => /^[a-z]+$/i.test(value),
                    hint: 'Only letters'
                }]}
                validators3={[{
                    rule: value => value.startsWith('T'),
                    hint: 'Must start with T'
                }]}
                value0="Jakarta"
                childValue1="Luxembourg"
                value2="5678"
                childValue3="Bangkok"
            />
        )

        let textarea0 = wrapper.find(Textarea).at(0)
        let textarea1 = wrapper.find(Textarea).at(1)
        let textarea2 = wrapper.find(Textarea).at(2)
        let textarea3 = wrapper.find(Textarea).at(3)

        expect(textarea0.prop('error')).toBeUndefined()
        expect(textarea0.prop('helperText')).toBeUndefined()

        expect(textarea1.prop('error')).toBeUndefined()
        expect(textarea1.prop('helperText')).toBeUndefined()

        expect(textarea2.prop('error')).toBeUndefined()
        expect(textarea2.prop('helperText')).toBeUndefined()

        expect(textarea3.prop('error')).toBeUndefined()
        expect(textarea3.prop('helperText')).toBeUndefined()

        expect(validate('groupA', true)).toBe(false)
        expect(validate('groupB', true)).toBe(false)

        wrapper.update()

        textarea0 = wrapper.find(Textarea).at(0)
        textarea1 = wrapper.find(Textarea).at(1)
        textarea2 = wrapper.find(Textarea).at(2)
        textarea3 = wrapper.find(Textarea).at(3)

        expect(textarea0.prop('error')).toBeUndefined()
        expect(textarea0.prop('helperText')).toBeUndefined()

        expect(textarea1.prop('error')).toBeUndefined()
        expect(textarea1.prop('helperText')).toBeUndefined()

        expect(textarea2.prop('error')).toBeUndefined()
        expect(textarea2.prop('helperText')).toBeUndefined()

        expect(textarea3.prop('error')).toBeUndefined()
        expect(textarea3.prop('helperText')).toBeUndefined()

        wrapper.setProps({
            value0: 'Rabat',
            childValue1: 'Phnom Penh',
            value2: '9876',
            childValue3: 'Sofia'
        })

        textarea0 = wrapper.find(Textarea).at(0)
        textarea1 = wrapper.find(Textarea).at(1)
        textarea2 = wrapper.find(Textarea).at(2)
        textarea3 = wrapper.find(Textarea).at(3)

        expect(textarea0.prop('error')).toBe(true)
        expect(textarea0.prop('helperText')).toBe('Must finish with e')

        expect(textarea1.prop('error')).toBe(true)
        expect(textarea1.prop('helperText')).toBe('Too long')

        expect(textarea2.prop('error')).toBe(true)
        expect(textarea2.prop('helperText')).toBe('Only letters')

        expect(textarea3.prop('error')).toBe(true)
        expect(textarea3.prop('helperText')).toBe('Must start with T')

        expect(validate('groupA', true)).toBe(false)
        expect(validate('groupB', true)).toBe(false)

        wrapper.update()

        textarea0 = wrapper.find(Textarea).at(0)
        textarea1 = wrapper.find(Textarea).at(1)
        textarea2 = wrapper.find(Textarea).at(2)
        textarea3 = wrapper.find(Textarea).at(3)

        expect(textarea0.prop('error')).toBe(true)
        expect(textarea0.prop('helperText')).toBe('Must finish with e')

        expect(textarea1.prop('error')).toBe(true)
        expect(textarea1.prop('helperText')).toBe('Too long')

        expect(textarea2.prop('error')).toBe(true)
        expect(textarea2.prop('helperText')).toBe('Only letters')

        expect(textarea3.prop('error')).toBe(true)
        expect(textarea3.prop('helperText')).toBe('Must start with T')

        wrapper.setProps({
            value0: 'Belgrade'
        })

        textarea0 = wrapper.find(Textarea).at(0)

        expect(textarea0.prop('error')).toBeUndefined()
        expect(textarea0.prop('helperText')).toBeUndefined()

        expect(validate('groupA', true)).toBe(false)
        expect(validate('groupB', true)).toBe(false)

        wrapper.update()

        textarea0 = wrapper.find(Textarea).at(0)
        textarea1 = wrapper.find(Textarea).at(1)
        textarea2 = wrapper.find(Textarea).at(2)
        textarea3 = wrapper.find(Textarea).at(3)

        expect(textarea0.prop('error')).toBeUndefined()
        expect(textarea0.prop('helperText')).toBeUndefined()

        expect(textarea1.prop('error')).toBe(true)
        expect(textarea1.prop('helperText')).toBe('Too long')

        expect(textarea2.prop('error')).toBe(true)
        expect(textarea2.prop('helperText')).toBe('Only letters')

        expect(textarea3.prop('error')).toBe(true)
        expect(textarea3.prop('helperText')).toBe('Must start with T')

        wrapper.setProps({
            childValue1: 'Bern'
        })

        textarea1 = wrapper.find(Textarea).at(1)

        expect(textarea1.prop('error')).toBeUndefined()
        expect(textarea1.prop('helperText')).toBeUndefined()

        expect(validate('groupA', true)).toBe(false)
        expect(validate('groupB', true)).toBe(false)

        wrapper.update()

        textarea0 = wrapper.find(Textarea).at(0)
        textarea1 = wrapper.find(Textarea).at(1)
        textarea2 = wrapper.find(Textarea).at(2)
        textarea3 = wrapper.find(Textarea).at(3)

        expect(textarea0.prop('error')).toBeUndefined()
        expect(textarea0.prop('helperText')).toBeUndefined()

        expect(textarea1.prop('error')).toBeUndefined()
        expect(textarea1.prop('helperText')).toBeUndefined()

        expect(textarea2.prop('error')).toBe(true)
        expect(textarea2.prop('helperText')).toBe('Only letters')

        expect(textarea3.prop('error')).toBe(true)
        expect(textarea3.prop('helperText')).toBe('Must start with T')

        wrapper.setProps({
            value2: 'Bamako'
        })

        textarea2 = wrapper.find(Textarea).at(2)

        expect(textarea2.prop('error')).toBeUndefined()
        expect(textarea2.prop('helperText')).toBeUndefined()

        expect(validate('groupA', true)).toBe(false)
        expect(validate('groupB', true)).toBe(true)

        wrapper.update()

        textarea0 = wrapper.find(Textarea).at(0)
        textarea1 = wrapper.find(Textarea).at(1)
        textarea2 = wrapper.find(Textarea).at(2)
        textarea3 = wrapper.find(Textarea).at(3)

        expect(textarea0.prop('error')).toBeUndefined()
        expect(textarea0.prop('helperText')).toBeUndefined()

        expect(textarea1.prop('error')).toBeUndefined()
        expect(textarea1.prop('helperText')).toBeUndefined()

        expect(textarea2.prop('error')).toBeUndefined()
        expect(textarea2.prop('helperText')).toBeUndefined()

        expect(textarea3.prop('error')).toBe(true)
        expect(textarea3.prop('helperText')).toBe('Must start with T')

        wrapper.setProps({
            childValue3: 'Tallinn'
        })

        textarea3 = wrapper.find(Textarea).at(3)

        expect(textarea3.prop('error')).toBeUndefined()
        expect(textarea3.prop('helperText')).toBeUndefined()

        expect(validate('groupA', true)).toBe(true)
        expect(validate('groupB', true)).toBe(true)

        wrapper.update()

        textarea0 = wrapper.find(Textarea).at(0)
        textarea1 = wrapper.find(Textarea).at(1)
        textarea2 = wrapper.find(Textarea).at(2)
        textarea3 = wrapper.find(Textarea).at(3)

        expect(textarea0.prop('error')).toBeUndefined()
        expect(textarea0.prop('helperText')).toBeUndefined()

        expect(textarea1.prop('error')).toBeUndefined()
        expect(textarea1.prop('helperText')).toBeUndefined()

        expect(textarea2.prop('error')).toBeUndefined()
        expect(textarea2.prop('helperText')).toBeUndefined()

        expect(textarea3.prop('error')).toBeUndefined()
        expect(textarea3.prop('helperText')).toBeUndefined()
    })

    it('should update groups on the fly', () => {
        const wrapper = mount(
            <CoreWrapper
                groups0={['groupA']}
                groups1={['groupB']}
                groups2={['groupC']}
                groups3={['groupD']}
                validators0={[{
                    rule: value => value.startsWith('A'),
                    hint: 'Must start with A'
                }]}
                validators1={[{
                    rule: value => value,
                    hint: 'Required'
                }]}
                validators2={[{
                    rule: value => /^[a-z]+$/i.test(value),
                    hint: 'Only letters'
                }]}
                validators3={[{
                    rule: value => value.endsWith('a'),
                    hint: 'Must end with a'
                }]}
                value0="Cairo"
                childValue1="Manila"
                value2="Algiers"
                childValue3="Budapest"
            />
        )

        expect(validate('groupA')).toBe(false)
        expect(validate('groupB')).toBe(true)
        expect(validate('groupC')).toBe(true)
        expect(validate('groupD')).toBe(false)

        wrapper.setProps({
            groups0: ['groupB'],
            groups1: ['groupA'],
            groups2: ['groupD'],
            groups3: ['groupC']
        })

        expect(validate('groupA')).toBe(true)
        expect(validate('groupB')).toBe(false)
        expect(validate('groupC')).toBe(false)
        expect(validate('groupD')).toBe(true)
    })

    it('should not validate anything because nothing uses groupZ', () => {
        mount(
            <CoreWrapper
                groups0={['groupC']}
                groups1={['groupA']}
                groups2={['groupD']}
                groups3={['groupB']}
                validators0={[{
                    rule: value => value,
                    hint: 'Required'
                }]}
                validators1={[{
                    rule: value => value.startsWith('J'),
                    hint: 'Must start with J'
                }]}
                validators2={[{
                    rule: value => /^\d+$/.test(value),
                    hint: 'Only numbers'
                }]}
                validators3={[{
                    rule: value => value.length > 10,
                    hint: 'Too short'
                }]}
                value0=""
                childValue1="Nairobi"
                value2="Jerusalem"
                childValue3="Dakar"
            />
        )

        expect(validate('groupZ')).toBe(true)
    })

    it('should clear groups', () => {
        const wrapper = mount(
            <CoreWrapper
                groups0={['groupA']}
                groups1={['groupB']}
                groups2={['groupA']}
                groups3={['groupB']}
                validators0={[{
                    rule: value => value.length < 4,
                    hint: 'Too long'
                }]}
                validators1={[{
                    rule: value => value.startsWith('K'),
                    hint: 'Must start with K'
                }]}
                validators2={[{
                    rule: value => /^\d+$/.test(value),
                    hint: 'Only numbers'
                }]}
                validators3={[{
                    rule: value => value,
                    hint: 'Required'
                }]}
                value0="Vientiane"
                childValue1="Beirut"
                value2="Havana"
                childValue3=""
            />
        )

        let textarea0 = wrapper.find(Textarea).at(0)
        let textarea1 = wrapper.find(Textarea).at(1)
        let textarea2 = wrapper.find(Textarea).at(2)
        let textarea3 = wrapper.find(Textarea).at(3)

        expect(textarea0.prop('error')).toBeUndefined()
        expect(textarea0.prop('helperText')).toBeUndefined()

        expect(textarea1.prop('error')).toBeUndefined()
        expect(textarea1.prop('helperText')).toBeUndefined()

        expect(textarea2.prop('error')).toBeUndefined()
        expect(textarea2.prop('helperText')).toBeUndefined()

        expect(textarea3.prop('error')).toBeUndefined()
        expect(textarea3.prop('helperText')).toBeUndefined()

        validate('groupA')
        validate('groupB')

        wrapper.update()

        textarea0 = wrapper.find(Textarea).at(0)
        textarea1 = wrapper.find(Textarea).at(1)
        textarea2 = wrapper.find(Textarea).at(2)
        textarea3 = wrapper.find(Textarea).at(3)

        expect(textarea0.prop('error')).toBe(true)
        expect(textarea0.prop('helperText')).toBe('Too long')

        expect(textarea1.prop('error')).toBe(true)
        expect(textarea1.prop('helperText')).toBe('Must start with K')

        expect(textarea2.prop('error')).toBe(true)
        expect(textarea2.prop('helperText')).toBe('Only numbers')

        expect(textarea3.prop('error')).toBe(true)
        expect(textarea3.prop('helperText')).toBe('Required')

        clear('groupA')

        wrapper.update()

        textarea0 = wrapper.find(Textarea).at(0)
        textarea1 = wrapper.find(Textarea).at(1)
        textarea2 = wrapper.find(Textarea).at(2)
        textarea3 = wrapper.find(Textarea).at(3)

        expect(textarea0.prop('error')).toBeUndefined()
        expect(textarea0.prop('helperText')).toBeUndefined()

        expect(textarea1.prop('error')).toBe(true)
        expect(textarea1.prop('helperText')).toBe('Must start with K')

        expect(textarea2.prop('error')).toBeUndefined()
        expect(textarea2.prop('helperText')).toBeUndefined()

        expect(textarea3.prop('error')).toBe(true)
        expect(textarea3.prop('helperText')).toBe('Required')

        clear('groupB')

        wrapper.update()

        textarea0 = wrapper.find(Textarea).at(0)
        textarea1 = wrapper.find(Textarea).at(1)
        textarea2 = wrapper.find(Textarea).at(2)
        textarea3 = wrapper.find(Textarea).at(3)

        expect(textarea0.prop('error')).toBeUndefined()
        expect(textarea0.prop('helperText')).toBeUndefined()

        expect(textarea1.prop('error')).toBeUndefined()
        expect(textarea1.prop('helperText')).toBeUndefined()

        expect(textarea2.prop('error')).toBeUndefined()
        expect(textarea2.prop('helperText')).toBeUndefined()

        expect(textarea3.prop('error')).toBeUndefined()
        expect(textarea3.prop('helperText')).toBeUndefined()
    })
})
