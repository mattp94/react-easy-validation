export const elements = new Set()

export const validate = (group, mute = false) => {
    let result = true

    for (const element of elements)
        if (element.props.groups.includes(group))
            result = element.validate(mute) && result

    return result
}

export const clear = group => {
    for (const element of elements)
        if (element.props.groups.includes(group))
            element.clear()
}
