import React, { Component } from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';

// Store
const todoStore = createStore((state, action) => {
    console.log(action);
    switch (action.type) {
        case 'add':
            state.items.push({
                name: action.name,
                done: false
            });
            return state;
        case 'remove':
            state.items.splice(action.index, 1);
            return state;
        case 'done':
            state.items[action.index].done = !state.items[action.index].done;
            return state;
        case 'filter':
            state.filter = action.filter;
            return state;
    }
    return state;
}, {
    items: [
        { name: 'Task 1', done: true },
        { name: 'Task 2', done: false },
        { name: 'Task 3', done: false }
    ],
    filter: null
});

/**
 * @class TodoItem
 */
class TodoItem extends Component {
    get defaultProps () {
        return {
            name: null,
            index: null,
            done: false
        };
    }

    _handleDoneChange () {
        todoStore.dispatch({ type: 'done', index: this.props.index });
    }

    _handleRemoveClick () {
        todoStore.dispatch({ type: 'remove', index: this.props.index });
    }

    render () {
        return (
            <label>
                <input type="checkbox" onChange={ this._handleDoneChange.bind(this) } checked={ this.props.done } />
                { this.props.name }
                <button onClick={ this._handleRemoveClick.bind(this) }>&times;</button>
            </label>
        );
    }
}

/**
 * @class TodoList
 */
class TodoList extends Component {
    get defaultProps () {
        return {
            items: []
        };
    }

    render () {
        if (this.props.items.length===0) {
            return (
                <div>List is empty!</div>
            );
        }
        return (
            <ul>
                { this.props.items.map((item, index) =>
                    <li key={ index }>
                        <TodoItem { ...item } index={ index } />
                    </li>
                ) }
            </ul>
        );
    }
}

/**
 * @class TodoForm
 */
class TodoForm extends Component {
    get defaultProps () {
        return {
            name: null
        };
    }

    _handleSubmit (event) {
        event.preventDefault();
        todoStore.dispatch({ type: 'add', name: this.refs.name.value });
        this.refs.form.reset();
    }

    render () {
        return (
            <form onSubmit={ this._handleSubmit.bind(this) } ref="form">
                <input type="text" value={ this.props.name } ref="name"  />
                <input type="submit" />
            </form>
        );
    }
}

/**
 * @class TodoApp
 */
class TodoApp extends Component {
    constructor (props) {
        super(props);
        this.state = todoStore.getState();
        todoStore.subscribe(this._handleStoreChange.bind(this));
    }

    _handleStoreChange () {
        this.setState(todoStore.getState());
    }

    render () {
        return (
            <div>
                <TodoForm />
                <TodoList items={ this.state.items } />
            </div>
        );
    }
}

// Run
render(
    <TodoApp />,
    document.getElementById('root')
);
