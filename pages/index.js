import Head from 'next/head';
import Sidebar from '../components/Sidebar';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Encrypto</title>
        <meta name="description" content="talk fully encrypted!" />
        <link rel="icon" href="/chat.ico" />
      </Head>
      <Sidebar />
    </div>
  )
}
