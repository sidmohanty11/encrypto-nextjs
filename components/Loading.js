import React from 'react';
import { Circle } from 'better-react-spinkit';

const Loading = () => {
    return (
        <center style={{display:'grid', placeItems:'center', height: '100vh'}}>
            <div>
                <img src="./logo.png"
                    alt=""
                    style={{ marginBottom: 10, borderRadius: '50%'}}
                    height={200}
                />
                <Circle color='#14213d' size={60} />
            </div>
        </center>
    )
}

export default Loading;
