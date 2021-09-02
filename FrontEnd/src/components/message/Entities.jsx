import React, { useState, useEffect, useContext } from 'react';
import { AccessTokenContext } from '../../accessTokenContext';
import ModalTemplate from '../common/ModalTemplate';
import $ from 'jquery';
import entityService from '../../services/entity.service.js';

const Entity = (props) => {
    const handleChange = (e) => {
        const index = props.entities.findIndex(entity => entity.type === e.target.name)
        const entities = [...props.entities];
        if (e.target.type === 'checkbox') {
            entities[index].selected = e.target.checked;
        } else if (e.target.type === 'text') {
            entities[index].name = e.target.value;
        }
        props.setEntities(entities);
    }

    return (
        <React.Fragment>
            <div className="row container">
                <div className="col-md-1">
                    <img className="" src="https://img.icons8.com/ios-filled/20/4a90e2/info.png" aria-hidden="true" data-toggle="tooltip" data-placement="right" title={props.info} />
                </div>
                <div className="col-md-5">
                    <div className="custom-control custom-switch">
                        <input type="checkbox" onChange={handleChange} className="custom-control-input" name={props.type} id={props.type} checked={props.selected} />
                        <label className="custom-control-label" htmlFor={props.type} >{props.type}</label>

                    </div>
                </div>
                <input onChange={handleChange} defaultValue={props.name} name={props.type} className={"col-md-6 form-control " + (props.selected ? "" : "invisible")} />

            </div>
            <br />
        </React.Fragment>
    )
}


const Entities = (props) => {
    const { accessToken, setAccessToken } = useContext(AccessTokenContext);
    useEffect(async () => {
        let intentId = sessionStorage.getItem('intent');
        try {
            let response = await entityService.get(intentId, accessToken, setAccessToken);
            let selectedEntities = response.data;
            const entitiesCopy = [...entities];
            for (let i = 0; i < selectedEntities.length; i++) {
                const index = entities.findIndex(entity => entity.type === selectedEntities[i].type)
                entitiesCopy[index].selected = true;
                entitiesCopy[index].name = selectedEntities[i].name;
            }
            setEntities(entitiesCopy);
        } catch (err) {
            console.log(err);
        }
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })
    }, []);

    const [entities, setEntities] = useState([{
        type: 'name',
        info: "Use in a seperate Intent",
        selected: false,
        name: "",
        order: 7
    },
    {
        type: 'phonenumber',
        info: 'It takes the phone Number from the user message',
        selected: false,
        name: "phonenumber",
        order: 2
    },
    {
        type: 'email',
        info: 'It gets the email from the user message',
        selected: false,
        name: "",
        order: 3
    },
    {
        type: 'date',
        info: 'It gets the date which the user gives in various formats',
        selected: false,
        name: "",
        order: 4
    },
    {
        type: 'number',
        info: 'It finds numbers like 1,2,3 and one, two, three',
        selected: false,
        name: "",
        order: 5
    },
    {
        type: 'ordinal',
        info: 'It gets the ordinal numbers as 1st, 2nd, 3rd, 4th',
        selected: false,
        name: "",
        order: 6
    },
    {
        type: 'other',
        info: 'Create your own Entity Name and use it anywhere.',
        selected: false,
        name: "",
        order: 1
    }]);


    const saveEntities = async (e) => {
        e?.preventDefault();
        let intentId = sessionStorage.getItem('intent');
        let chatbotId = sessionStorage.getItem('chatbot');
        let selectedEntities = [...entities].filter(entity => entity.selected).map(entity => { return { type: entity.type, name: entity.name, order: entity.order } })
        try {
            console.log(selectedEntities);
            await entityService.create(chatbotId, intentId, selectedEntities, accessToken, setAccessToken)
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <React.Fragment >
            <form onSubmit={saveEntities}>
                <ModalTemplate
                    id="entity"
                    title="Entity"
                    buttonName="Save"
                    handleCloseButton={() => saveEntities()} >
                    {entities.map((entity, index) => (
                        <Entity
                            key={entity.type}
                            entities={entities}
                            setEntities={setEntities}
                            type={entity.type}
                            info={entity.info}
                            selected={entity.selected}
                            name={entity.name} />
                    ))}
                </ModalTemplate>
            </form>
        </React.Fragment >
    );
}

export default Entities;