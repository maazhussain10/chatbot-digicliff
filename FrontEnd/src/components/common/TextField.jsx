import React from 'react';
import { Field } from 'formik';

const TextField = (props) => {
    return (
        <div className="form-group mb-2 text-left">
            {props.label ? <label htmlFor={props.name}>{props.label}</label> : null}

            <div className="input-group">
                {props.icon ?
                    <div className="input-group-prepend">
                        <span className="input-group-text input-icon mb-0" id="basic-addon1">
                            {props.icon}
                        </span>
                    </div>
                    : null}

                <Field
                    as={props.as}
                    rows={props.rows}
                    id={props.name}
                    name={props.name}
                    type={props.type}
                    className={"form-control shadow-none w-75 mb-0 " + (props.errorMessage ? "error-border" : "")}
                    placeholder={props.placeholder}
                    aria-label={props.placeholder}
                    aria-describedby="basic-addon1"
                />

                {props.errorMessage ?
                    <small id="lastName" className="form-text error">{props.errorMessage}</small>
                    :
                    null
                }
            </div>

            {props.subText ?
                <small id="emailHelp" className="form-text text-muted">We'll never share your information with anyone else.</small>
                :
                undefined}
        </div>);
}

export default TextField;