import PropTypes from 'prop-types'

import Validation from './Validation'

export default class ValidationIn extends Validation {
    componentWillReceiveProps(nextProps) {
        const { children, value } = nextProps

        super.componentWillReceiveProps(
            nextProps,
            children.props[value],
            this.props.children.props[this.props.value]
        )
    }

    validate(mute, props = this.props) {
        const { children, value } = props

        return super.validate(mute, props, children.props[value])
    }
}

ValidationIn.defaultProps = Object.assign({
    value: 'value'
}, ValidationIn.defaultProps)

ValidationIn.propTypes = Object.assign({
    value: PropTypes.string.isRequired
}, ValidationIn.propTypes)
