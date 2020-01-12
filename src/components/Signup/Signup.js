import React from 'react';

import addToMailchimp from 'gatsby-plugin-mailchimp/src';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Signup.css';
import newsLetterLogo from './newsletterLogo.svg';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      listFields: { NAME: '' },
    };
  }

  handleOnChangeEmail = e => {
    this.setState({ email: e.target.value });
  }

  handleOnChangeName = e => {
    this.setState({ listFields: { NAME: e.target.value } });
  }

  handleSubmit = async e => {
    e.preventDefault();
    const { email, listFields } = this.state;
    const result = await addToMailchimp(email, listFields);
    if (result.result === 'error') {
      toast.error(result.msg, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      toast.success(result.msg, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  }

  render() {
    return (
      <form
        className="seva-form formkit-form"
        method="post"
        style={{
          boxShadow: 'var(--form-shadow)',
          backgroundColor: 'var(--bg)',
          borderRadius: '6px',
        }}
        onSubmit={this.handleSubmit}
      >
        <div data-style="full">
          <div
            data-element="column"
            className="formkit-column"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <h1
              className="formkit-header"
              data-element="header"
              style={{
                color: 'var(--textTitle)',
                fontSize: '20px',
                fontWeight: 700,
              }}
            >
              Join the Newsletter
            </h1>
            <div
              data-element="subheader"
              className="formkit-subheader"
              style={{ color: 'var(--textNormal)', fontsize: '15px' }}
            >
              <p>Subscribe to get my latest content by email.</p>
            </div>
            <div className="formkit-image">
              <img
                alt=""
                src={newsLetterLogo}
                style={{ maxWidth: '100%' }}
              />
            </div>
          </div>
          <div data-element="column" className="formkit-column">
            <ul
              className="formkit-alert formkit-alert-error"
              data-element="errors"
              data-group="alert"
            />

            <div data-element="fields" className="seva-fields formkit-fields">
              <div className="formkit-field">
                <input
                  className="formkit-input"
                  aria-label="Your first name"
                  name="fields[first_name]"
                  placeholder="Your first name"
                  type="text"
                  style={{
                    borderColor: 'rgb(227, 227, 227)',
                    borderRadius: '4px',
                    color: 'rgb(0, 0, 0)',
                    fontWeight: 400,
                  }}
                  value={this.state.listFields.NAME}
                  onChange={this.handleOnChangeName}
                />
              </div>
              <div className="formkit-field">
                <input
                  className="formkit-input"
                  name="email_address"
                  aria-label="Your email address"
                  placeholder="Your email address"
                  required=""
                  type="email"
                  style={{
                    borderColor: 'rgb(227, 227, 227)',
                    borderRadius: '4px',
                    color: 'rgb(0, 0, 0)',
                    fontWeight: 400,
                  }}
                  value={this.state.email}
                  onChange={this.handleOnChangeEmail}
                />
              </div>
              <button
                type="submit"
                data-element="submit"
                className="formkit-submit formkit-submit"
                style={{
                  backgroundColor: 'rgb(252, 211, 225)',
                  borderRadius: '24px',
                  color: 'rgb(110, 110, 110)',
                  fontWeight: 700,
                }}
              >
                <div className="formkit-spinner" />
                <span>Subscribe</span>
              </button>
            </div>
            <div
              data-element="guarantee"
              className="formkit-guarantee"
              style={{
                color: 'var(--textNormal)',
                fontSize: '13px',
                fontWeight: 400,
              }}
            >
              <p>I won&apos;t send you spam.</p>
              <p>
                Unsubscribe at&nbsp;
                <em>any</em>
                &nbsp;time.
              </p>
            </div>
          </div>
        </div>
        <ToastContainer />
      </form>
    );
  }
}

export default Signup;
