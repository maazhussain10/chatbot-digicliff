import React, { useContext, useEffect, useState } from 'react';
import $ from 'jquery';
import { AccessTokenContext } from '../../accessTokenContext.js';
import chipService from '../../services/chip.service.js';

const CreateChip = (props) => {
    const { accessToken, setAccessToken } = useContext(AccessTokenContext);
    const [chip, setChip] = useState("");
    const [useQuery, setUseQuery] = useState(false);

    const handleChange = (e) => {
        if (e.target.type === 'checkbox')
            setUseQuery(e.target.checked);
        else if (e.target.type === 'text')
            setChip(e.target.value);
    }

    const createChip = async (e) => {
        e.preventDefault();
        let intentId = sessionStorage.getItem('intent');
        let order = props.chips.length;
        try {
            console.log(intentId, chip, useQuery);
            await chipService.create(
                intentId,
                chip,
                useQuery,
                order,
                accessToken,
                setAccessToken
            );
            props.setChips([...props.chips, { chipValue: chip, chipOrder: props.chips.length }])
            setChip("");
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <React.Fragment>
            <button type="button" className="btn btn-primary" data-toggle="collapse" data-target="#createChip" disabled={props.disableChip}>
                Add chips
            </button>
            <div className="collapse" id="createChip">
                <form className="card card-body" onSubmit={createChip}>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text"><svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-view-list" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M3 4.5h10a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1H3zM1 2a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 2zm0 12a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 14z" />
                            </svg></span>
                        </div>
                        <input
                            required
                            onChange={handleChange}
                            value={chip}
                            id="input-chipvalue"
                            type="text" className="form-control" aria-label="create chips" />

                    </div>
                    <div className="custom-control custom-switch">
                        <input type="checkbox" onChange={handleChange} className="custom-control-input" checked={useQuery} id="useQueryChip" />
                        <label className="custom-control-label" htmlFor="useQueryChip">Use Query</label>
                    </div>
                </form>
            </div>
        </React.Fragment>
    );
}

export default CreateChip;