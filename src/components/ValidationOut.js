import Validation from './Validation'

export default class ValidationOut extends Validation {
    componentWillReceiveProps(nextProps) {
        super.componentWillReceiveProps(nextProps, nextProps.value, this.props.value)
    }

    validate(mute, props = this.props) {
        return super.validate(mute, props, props.value)
    }
}
