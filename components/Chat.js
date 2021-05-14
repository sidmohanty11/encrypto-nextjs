import { Avatar } from '@material-ui/core';
import React from 'react';
import getRecipientEmail from '../utils/getRecipientEmail';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import styled from 'styled-components';
import { useRouter } from 'next/router';

const Chat = ({ id, users }) => {
    const router = useRouter();
    const [user] = useAuthState(auth);
    const [recipientSnap] = useCollection(
        db.collection('users').where('email', '==', getRecipientEmail(users, user))
    );
    const recipient = recipientSnap?.docs?.[0]?.data();

    const enterChat = () => {
        router.push(`/chat/${id}`);
    }
    
    const recipientEmail = getRecipientEmail(users, user);
    return (
        <Container onClick={enterChat}>
            {recipient ? (<UserAvatar src={recipient?.photoURL} />) : (<UserAvatar>{recipientEmail[0]}</UserAvatar>)}
            <EmailHolder>{recipientEmail}</EmailHolder>
        </Container>
    )
}

export default Chat;

const Container = styled.div`
    display:flex;
    align-items:center;
    cursor:pointer;
    padding:15px;
    word-break: break-word;
    color: white;
    :hover{
        background-color: #641220;
    }
`;

const UserAvatar = styled(Avatar)`
    margin:5px;
    margin-right:15px;
`;

const EmailHolder = styled.div`
@media (max-width: 768px) {
        display:none;
}
`;