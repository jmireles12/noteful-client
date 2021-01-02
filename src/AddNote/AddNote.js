import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import ValidationError from "../ValidationError.js";
import config from '../config'
import './AddNote.css'

export default class AddNote extends Component {

  static defaultProps = {
    history: {
      push: () => { }
    },
  }
  static contextType = ApiContext;

  state = {
    name: {
      value: '',
      touched: false,
    },
    content: {
      value: '',
      touched: false,
    },
    folderid: {
      value: '',
      touched: false,
    },
    error: null,
  }

  updateName(name) {
    this.setState({ name: { value: name, touched: true } });
  }

 updateContent(content) {
    this.setState({ content: { value: content, touched: true } });
  }

  updateFolderSelected(folder) {
     this.setState({ folderChoice: { value: folder, touched: true } });
  }

  handleSubmit = e => {
    e.preventDefault()

    const {name, content, folderid} = e.target;

    const newNote = {
      name: e.target['note-name'].value,
      content: e.target['note-content'].value,
      folderid: e.target['note-folder-id'].value,
      modified: new Date(),
    }

    this.setState({ error: null })

    fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newNote),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(note => {
        name.value = ''
        content.value = ''
        folderid.value = ''
        this.context.addNote(note)
        this.props.history.push(`/folder/${note.folderid}`)
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

  validateContent() {
      const content = this.state.content.value.trim();
      if (content.length === 0) {
          return "Content is required";
      } 
    }

  validateFolderId() {
      const folderid = this.state.folderid.value;
      if (!folderid) {
          return "Please choose a folder to put your new note in";
      } 
    }

  render() {
    const nameError = this.validateName();
    const contentError = this.validateContent();
    const { folders=[] } = this.context
    return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='Noteful__error' role='alert'>
            {this.state.error && <p>Something didn't work, please try again</p>}
          </div>
          <div className='field'>
            <label htmlFor='note-name-input'>
              Name
            </label>
            <input type='text' id='note-name-input' name='note-name' onChange={e => this.updateName(e.target.value)}/>
            {this.state.name.touched && <ValidationError message={nameError} />}
          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>
              Content
            </label>
            <textarea id='note-content-input' name='note-content' onChange={e => this.updateContent(e.target.value)}/>
            {this.state.content.touched && <ValidationError message={contentError} />}
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>
              Folder
            </label>
            <select id='note-folder-select' name='note-folder-id' onChange={e => this.updateFolderSelected(e.target.value)}>>
              <option value={null}>...</option>
              {folders.map(folder =>
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              )}
            </select>
          </div>
          <div className='buttons'>
            <button type='submit'>
              Add note
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}