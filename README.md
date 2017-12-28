# react-easy-validation

[![build status](https://travis-ci.org/mattp94/react-easy-validation.svg?branch=v2)](https://travis-ci.org/mattp94/react-easy-validation)
[![coverage status](https://coveralls.io/repos/github/mattp94/react-easy-validation/badge.svg?branch=v2)](https://coveralls.io/github/mattp94/react-easy-validation?branch=v2)

> This library gives an **easy** way to **validate forms** in [React](https://facebook.github.io/react) by using a **wrapper** on your components.

## Features

- Simple usage by **wrapping** components you want to validate.
- Supports components which **manage errors** from props.
- Supports validation of a **set** of **components** by associating **groups** with these components.
- Can **observe** a **value prop** of your component as well as a value **outside** it.
- **Compatible** with [Material-UI v1](https://material-ui-next.com).

## Demo

Check out a [complete example](https://codesandbox.io/embed/2jx75m2qnr) with **Material-UI v1**.

## Installation

It requires **React v0.14** or later.

```sh
npm install react-easy-validation@next --save
```

This assumes that you’re using [npm](https://www.npmjs.com) package manager with a module bundler.

## Getting started

Two wrappers are provided to cover specific cases of validation:

- `<ValidationIn />`
- `<ValidationOut />`

Any wrapper takes an array of validators and an array of groups. It listens to a value and checks it with every validator. If some of them doesn't match with value, an error flag and an error message are passed to the component.

On the other side, a method `validate` allows you to validate a set of components by checking a given group. It returns the validation result at the same time.

Now, consider the following component `Input`:

```js
const Input = ({ err, msg, val, onChange }) => (
    <div>
        <input onChange={onChange} value={val} />
        {err && <div>{msg}</div>}
    </div>
)
```

## Documentation

### ValidationIn

Use this wrapper if your validation depends on a value inside the component you want to validate. In most of the cases, you'll use this one.

#### Usage

```js
<ValidationIn
    error="err"
    groups={['form']}
    helper="msg"
    validators={[{
        rule: value => value,
        hint: 'Required'
    }, {
        rule: value => value.startsWith('P'),
        hint: 'Must start with P'
    }]}
    value="val">
    <Input val="Paris" />
</ValidationIn>
```

#### Props

All of these can be changed on the fly:

| Name | Type | Default | Required | Description |
| ---- | ---- | ------- | :------: | ----------- |
| `children` | `element` | | ✓ | Component you want to validate. |
| `error` | `string` | `error` | | Name of the component's prop which receives error flags. |
| `groups` | `array` | | ✓ | Groups you want to associate with your component. Any type is allowed because a group is used like a key. |
| `helper` | `string` | `helperText` | | Name of the component's prop which receives error messages. |
| `validators` | `array` | | ✓ | Validators whose order is important. Each validator is an `object` like `{ rule: func, hint: any }`. Here, `rule` takes a `value` as parameter and returns a result. If it's falsy, then `hint` is passed to the component as well as a flag containing `true`. |
| `value` | `string` | `value` | | Name of the component's prop which is validated. |

> **Note:** A library like [validator.js](https://github.com/chriso/validator.js) can easily be used in your validators' rules.

### ValidationOut

In a case where your validation depends on a value outside your component, use that one.

#### Usage

```js
<ValidationOut
    error="err"
    groups={['form']}
    helper="msg"
    validators={[{
        rule: value => value.length > 4,
        hint: 'Must be longer'
    }, {
        rule: value => value.endsWith('g'),
        hint: 'Must end with g'
    }]}
    value="Hong Kong">
    <Input />
</ValidationOut>
```

#### Props

It has exactly the same props than previous wrapper, except for:

| Name | Type | Default | Required | Description |
| ---- | ---- | ------- | :------: | ----------- |
| `value` | `any` | | | Value which is validated. |

### Validate a group

Use the method `validate` to check if a group of components is valid or not.

#### Syntax

```js
const result = validate(group[, mute])
```

#### Parameters

| Name | Type | Default | Optional | Description |
| ---- | ---- | ------- | :------: | ----------- |
| `group` | `any` | | | Group you want to validate. |
| `mute` | `boolean` | `false` | ✓ | Flag which enables to silently validate a group. |

#### Return value

+ **Type:** `boolean`
+ **Description:** Result of the validation.

## Example

Here is a [basic example](https://codesandbox.io/embed/mm3pm4p7y) with `<ValidationIn />`:

```js
import React, { Component } from 'react'
import { validate, ValidationIn } from 'react-easy-validation'

import Input from './Input'

class Example extends Component {
    constructor(props) {
        super(props)

        this.state = {
            value: ''
        }

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange({ target: { value } }) {
        this.setState({
            value
        })
    }

    handleSubmit(event) {
        event.preventDefault()

        if (validate('form'))
            alert('Your form is valid!')
        else
            alert('Your form is invalid...')
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <ValidationIn
                    error="err"
                    groups={['form']}
                    helper="msg"
                    validators={[{
                        rule: value => value,
                        hint: 'Required'
                    }, {
                        rule: value => value.startsWith('P'),
                        hint: 'Must start with P'
                    }]}
                    value="val">
                    <Input
                        onChange={this.handleChange}
                        val={this.state.value}
                    />
                </ValidationIn>

                <button type="submit">
                    Validate
                </button>
            </form>
        )
    }
}
```

> **Note:** Be aware that it would have been similar with `<ValidationOut />`.

## Unit testing

You can easily test your form validation with [Enzyme](http://airbnb.io/enzyme). Just make sure to follow these two points:

- It requires a full rendering of your components by using `mount`.
- Because this library is built with a singleton pattern, don't forget to `unmount` your wrapper after using it.
