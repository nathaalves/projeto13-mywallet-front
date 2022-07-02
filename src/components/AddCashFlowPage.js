import Button from "../shared/Button";
import Input from "../shared/Input";
import Page from "../shared/Page";
import Title from "../shared/Title";
import axios from 'axios';
import { useState, useContext } from "react";
import UserContext from "../contexts/UserContext";
import { useParams } from "react-router-dom";
import Form from "../shared/Form";
import dotenv from 'dotenv';

dotenv.config();

export default function AddCashFlowPage () {


    const { type } = useParams();
    const { session } = useContext(UserContext);
    
    const [register, setRegister] = useState({
        value: 'R$ 0,00',
        description: ''
    });

    let pageName = null;
    if (type === 'cash-in') pageName = 'entrada';
    if (type === 'cash-out') pageName = 'saída';

    function handleForm (e) {

        

        if (e.target.name === 'value') {

            const formatCurrency = function(amount) {
                return "R$ " + parseFloat(amount).toFixed(2).replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
            };

            let value = e.target.value;
            if (value.length <= 20 && !/[a-zA-Z]/.test(value.slice(3, 20))) {

                value = value?.replace('.', '');
                value = value?.replace(',', '');
                value = value?.replace('R$ ', '');
                value = Number(value)/100;
                value = formatCurrency(value)
            } else {
                value = register.value;
            };
            

            setRegister({
                ...register,
                [e.target.name]: value
            });
        } else {
            setRegister({
                ...register,
                [e.target.name]: e.target.value
            });
        };

        
    };

    function submitForm (e) {

        e.preventDefault();

        const API_URI = process.env.API_URI;
        const API_ROUTE = '/cash-flow';
        
        const body = {
            ...register,
            type
        };
        const header = {
            headers: {
                Authorization: `Bearer ${session.token}`
            }
        };

        const promise = axios.post(`${API_URI}${API_ROUTE}`, body, header);

        promise
            .then( response => {
                //console.log(response.data)
            })
            .catch( error => {
                //console.log(error.response.data)
            })

            setRegister({
                value: 'R$ 0,00',
                description: ''
            });
    };

    return (
        <Page >
            <Title action='back'>{`Nova ${pageName}`}</Title>
            <Form onSubmit={submitForm}>
                <Input placeholder="Valor" name='value' value={register.value} onChange={handleForm} required />
                <Input placeholder="Descrição" name='description' value={register.description} onChange={handleForm} required />
                <Button>{`Salvar ${pageName}`}</Button>
            </Form>
        </Page>
    );
}