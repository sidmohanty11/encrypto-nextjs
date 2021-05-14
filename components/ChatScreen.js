import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { useRouter } from 'next/router';
import { Avatar, IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttacFileIcon from '@material-ui/icons/AttachFile';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon'
import MicIcon from '@material-ui/icons/Mic';
import { useCollection } from 'react-firebase-hooks/firestore';
import Message from './Message';
import firebase from 'firebase';
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from 'timeago-react';

const ChatScreen = ({chat, messages}) => {
    const [user] = useAuthState(auth);
    const [input, setInput] = useState("");
    const router = useRouter();
    const endofmsgref = useRef(null);
    const [messagesSnapshot] = useCollection(db
        .collection('chats')
        .doc(router.query.id)
        .collection('messages')
        .orderBy('timestamp', 'asc'));
    
    
    const [recipientSnapshot] = useCollection(
        db.collection('users').where('email', '==', getRecipientEmail(chat.users, user))
    );

    const showMessages = () => {
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map(msg => (<Message
                key={msg.id}
                user={msg.data().user}
                message={
                    {
                        ...msg.data(),
                        timestamp: msg.data().timestamp?.toDate().getTime()
                    }
                }/>))
        } else {
            return JSON.parse(messages).map(message => (<Message 
                key={ message.id }
                user={ message.user }
                message={message}
                />))
        }
    }

    const scrollToBottom = () => {
        endofmsgref.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const sendMessage = (e) => {
        e.preventDefault();

        db.collection('users').doc(user.uid).set({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        },
            { merge: true });
        
        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL,
        });

        setInput("");
        scrollToBottom();
    };

    const recipient = recipientSnapshot?.docs?.[0]?.data();

    const recipientEmail = getRecipientEmail(chat.users, user);

    return (
        <Container>
            <Header>
                {recipient ? (<Avatar src={recipient?.photoURL} />) : (<Avatar src={recipientEmail[0]} />)}
                <HeaderInfo>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p>Last Active:{" "}
                            {recipient?.lastSeen?.toDate() ? (<TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                            ) : ("Unavailable")}
                        </p>
                    ) : (<p>Loading last active...</p>)}
                </HeaderInfo>

                <HeaderIcons>
                    <IconButton><AttacFileIcon /></IconButton>
                    <IconButton><MoreVertIcon /></IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                 {showMessages()}
                <EndOfMessage ref={endofmsgref} />
            </MessageContainer>

            <InputContainer>
                <InsertEmoticonIcon />
                <Input value={input} onChange={e=>setInput(e.target.value)}/>
                <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send Message</button>
                <MicIcon />
            </InputContainer>
        </Container>
    )
}

export default ChatScreen;

const Container = styled.div``;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding:10px;
    position:sticky;
    bottom:0;
    background-color: #252422;
    z-index: 100;
`;


const Input = styled.input`
    flex:1;
    outline:0;
    border:none;
    border-radius:10px;
    padding:20px;
    background-color: white;
    margin-left:15px;
    margin-right:15px;
`;

const Header = styled.div`
    position: sticky;
    background-color:#0b090a;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px;
    height:80px;
    align-items: center;
    border-bottom:1px solid #212529;
    color: #641220;

     @media (max-width: 768px) {
        font-size:10px;
  }
`;

const HeaderInfo = styled.div`
    margin-left:15px;
    flex:1;

    >h3{
        margin-bottom:3px;
    }

    >p{
        font-size:14px;
        color:gray;
    }
`;

const HeaderIcons = styled.div`

    @media (max-width: 768px) {
        display:none;
  }
`;

const MessageContainer = styled.div`
    padding:30px;
    background-color:#252422;
    min-height:90vh;
`;

const EndOfMessage = styled.div`
    margin-bottom:50px;
`;



