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
        const { children, error } = nextProps

        if (nextValue !== value)
            this.validate(false, nextProps)
        else if (!shallowequal(children.props, this.props.children.props))
            this.renderChild(children, error, this.hint)
    }

    componentWillUnmount() {
        elements.delete(this)
    }

    validate(mute, props, value) {
        const { children, validators, error } = props

        for (const { rule, hint } of validators)
            if (!rule(value)) {
                this.renderChild(children, error, mute ? this.hint : hint)
                return false
            }

        this.renderChild(children)
        return true
    }

    renderChild(child, error, hint) {
        this.setState({
            child: hint === undefined ? child : cloneElement(child, {
                [error]: hint
            })
        })

        this.hint = hint
    }

    render() {
        return this.state.child
    }
}

Validation.defaultProps = {
    error: 'errorText'
}

Validation.propTypes = {
    children: PropTypes.element.isRequired,
    error: PropTypes.string.isRequired,
    groups: PropTypes.array.isRequired,
    validators: PropTypes.arrayOf(PropTypes.shape({
        rule: PropTypes.func.isRequired
    })).isRequired
}
