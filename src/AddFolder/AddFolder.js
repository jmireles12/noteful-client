import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import ValidationError from "../ValidationError.js";
import config from '../config'
import './AddFolder.css'

export default class AddFolder extends Component {
  static defaultProps = {
    history: {
      push: () => { }
    },
  }
  static contextType = ApiContext

  state = {
    name: {
      value: ''
    },
    error: null,
  };

  handleSubmit = e => {
    const { name } = e.target;
    this.setState({ error: null })
    e.preventDefault()
    const folder = {
      name: e.target['folder-name'].value
    }
    fetch(`${config.API_ENDPOINT}/folders`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(folder),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(folder => {
        name.value = '';
        this.context.addFolder(folder)
        this.props.history.push(`/folder/${folder.id}`)
      })
      .catch(error => {
        console.error({ error })
        this.setState({ error })
      })
  }

  validateName() {
    const name = this.state.name.value.trim();
    if (name.length === 0) {
      return "Name is required";
    } else if (name.length < 3) {
      return "Name must be at least 3 characters long";
    }
  }


  render() {
    const nameError = this.validateName();
    return (
      <section className='AddFolder'>
        <h2>Create a folder</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='Noteful__error' role='alert'>
            {this.state.error && <p>Something didn't work, please try again</p>}
          </div>
          <div className='field'>
            <label htmlFor='folder-name-input'>
              Name
            </label>
            <input type='text' id='folder-name-input' name='folder-name' />
            {this.state.name.touched && <ValidationError message={nameError} />}
          </div>
          <div className='buttons'>
            <button type='submit'>
              Add folder
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}