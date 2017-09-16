# react-easy-validation

[![npm](https://img.shields.io/npm/v/react-easy-validation.svg)](https://www.npmjs.com/package/react-easy-validation)
[![build status](https://travis-ci.org/mattp94/react-easy-validation.svg?branch=master)](https://travis-ci.org/mattp94/react-easy-validation)
[![coverage status](https://coveralls.io/repos/github/mattp94/react-easy-validation/badge.svg?branch=master)](https://coveralls.io/github/mattp94/react-easy-validation?branch=master)
[![dependencies](https://david-dm.org/mattp94/react-easy-validation/status.svg)](https://david-dm.org/mattp94/react-easy-validation)
[![devDependencies](https://david-dm.org/mattp94/react-easy-validation/dev-status.svg)](https://david-dm.org/mattp94/react-easy-validation?type=dev)

> This library gives an **easy** way to **validate forms** in [React](https://facebook.github.io/react) by using a **wrapper** on your components.

## Features

- Simple usage by **wrapping** components you want to validate
- Supports components which **handle** an **error prop** whatever prop name
- Supports validation of a **set** of **components** by associating **groups** with these components
- Can **observe** a **value prop** of your component whatever prop name as well as a value **outside** it
- May be used with **libraries** like [Material-UI](http://www.material-ui.com) or [React Toolbox](http://react-toolbox.com)

## Demo

Check out a complete [example](https://codesandbox.io/embed/43o0m77nw4) with **Material-UI**.

## Installation

It requires **React v0.14** or later.

```sh
npm install react-easy-validation --save
```

This assumes that you’re using [npm](https://www.npmjs.com) package manager with a module bundler.

## Getting started

Two wrappers are provided to cover specific cases of validation:

- `<ValidationIn />`
- `<ValidationOut />`

Any wrapper takes an array of validators and an array of groups. It listens to a value and checks it with every validator. If some of them doesn't match with value, it passes an error to component.

On the other side, a method `validate` allows you to validate a set of components by checking a given group. It returns the validation result at the same time.

Now, consider the following component `Input` which can display an error from its props:

```js
const Input = ({ err, val, onChange }) => (
    <div>
        <input onChange={onChange} value={val} /> {err}
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
| `children` | `element` | | ✓ | Component you want to validate |
| `error` | `string` | `errorText` | | Name of the component's prop which receives errors. |
| `groups` | `array` | | ✓ | Groups you want to associate with your component. Any type is allowed because a group is used like a key. |
| `validators` | `array` | | ✓ | Validators whose order is important. Each validator is an `object` like `{ rule: func, hint: any }`. Here, `rule` takes a `value` as parameter and returns a result. If it's falsy, then `hint` is passed to the component. |
| `value` | `string` | `value` | | Name of the component's prop which is validated. |

> **Note:** A library like [validator.js](https://github.com/chriso/validator.js) can easily be used in your validators' rules.

### ValidationOut

In a case where your validation depends on a value outside your component, use that one.

#### Usage

```js
<ValidationOut
    error="err"
    groups={['form']}
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
+ **Description:** Result of the validation

## Example

Here is a basic [example](https://codesandbox.io/embed/oq176zv629) with **ValidationIn**. Be aware that it would have been similar with **ValidationOut**:

```js
import React, { Component } from 'react'
import { ValidationIn, validate } from 'react-easy-validation'

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
