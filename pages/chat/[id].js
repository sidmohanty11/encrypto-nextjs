import Head from 'next/head';
import React from 'react';
import styled from 'styled-components';
import Sidebar from '../../components/Sidebar';
import ChatScreen from '../../components/ChatScreen';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import getRecipientEmail from '../../utils/getRecipientEmail';

const Chat = ({ chat, messages }) => {
    const [user] = useAuthState(auth);
    return (
        <Container>
            <Head>
                <title>Chatting with {getRecipientEmail(chat.users,user)}</title>
            </Head>
            <WrapperSidebar>
                <Sidebar />
            </WrapperSidebar>
            <ChatContainer>
                <ChatScreen chat={chat} messages={messages} />
            </ChatContainer>
        </Container>
    )
}

export default Chat;

export async function getServerSideProps(context) {
    const ref = db.collection("chats").doc(context.query.id);

    const messagesRes = await ref.collection('messages').orderBy('timestamp', 'asc').get();

    const messages = messagesRes.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime()
    }))

    const chatRes = await ref.get();
    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    }

    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat
        }
    }
}


const Container = styled.div`
    display:flex;
`;

const ChatContainer = styled.div`
    flex:1;
    overflow:scroll;
    height:100vh;

    ::-webkit-scrollbar{
        display: none;
    }
    --ms-overflow-style:none;
    scrollbar-width:none;
`;

const WrapperSidebar = styled.div`
         @media (max-width: 768px) {
        display:none;
  }
`;