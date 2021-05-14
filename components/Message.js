import React from 'react';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import moment from 'moment';

const Message = ({ message, user }) => {
    const [userLoggedIn] = useAuthState(auth);

    const TypeOfMsg = user === userLoggedIn.email ? Sender : Receiver;

    return (
        <Container>
            <TypeOfMsg>{message.message}
                <TimeStamp>
                    {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
                </TimeStamp>
            </TypeOfMsg>
        </Container>
    )
}

export default Message;

const Container = styled.div``;

const MessageEl = styled.div`
    width: fit-content;
    padding:15px;
    border-radius:8px;
    margin:10px;
    min-width:60px;
    padding-bottom:26px;
    position:relative;
    text-align:right;
`;

const Sender = styled(MessageEl)`
    margin-left:auto;
    background-color:#641220;
    color:whitesmoke;
`;

const Receiver = styled(MessageEl)`
    background-color:whitesmoke;
    text-align:left;
`;

const TimeStamp = styled.span`
    color:gray;
    padding:10px;
    font-size:9px;
    position:absolute;
    bottom:0;
    text-align:right;
    right:0;
`;