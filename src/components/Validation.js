import PropTypes from 'prop-types'
import shallowequal from 'shallowequal'
import { cloneElement, Component } from 'react'

import { elements } from '../core'

export default class Validation extends Component {
    constructor(props) {
        super(props)

        this.state = {
            child: props.children
        }
    }

    componentWillMount() {
        elements.add(this)
    }

    componentWillReceiveProps(nextProps, nextValue, value) {
        const { children, error, helper } = nextProps

        if (nextValue !== value)
            this.validate(false, nextProps)
        else if (!shallowequal(children.props, this.props.children.props))
            this.renderChild(children, error, helper, this.hint)
    }

    componentWillUnmount() {
        elements.delete(this)
    }

    validate(mute, props, value) {
        const { children, error, helper, validators } = props

        for (const { rule, hint } of validators)
            if (!rule(value)) {
                this.renderChild(children, error, helper, mute ? this.hint : hint)
                return false
            }

        this.renderChild(children)
        return true
    }

    renderChild(child, error, helper, hint) {
        this.setState({
            child: hint === undefined ? child : cloneElement(child, {
                [error]: true,
                [helper]: hint
            })
        })

        this.hint = hint
    }

    render() {
        return this.state.child
    }
}

Validation.defaultProps = {
    error: 'error',
    helper: 'helperText'
}

Validation.propTypes = {
    children: PropTypes.element.isRequired,
    error: PropTypes.string.isRequired,
    groups: PropTypes.array.isRequired,
    helper: PropTypes.string.isRequired,
    validators: PropTypes.arrayOf(PropTypes.shape({
        rule: PropTypes.func.isRequired
    })).isRequired
}
