import React, { useEffect , useState } from 'react';
import {
    useAnchorWallet,
    useConnection,
    useWallet,
} from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton,
    WalletConnectButton,
} from '@solana/wallet-adapter-react-ui';
import {
    Program, Provider, web3
  } from '@project-serum/anchor'
import idl from "./idl.json"
import { Connection, PublicKey } from '@solana/web3.js';
import FileUploadPage from './FileUpload';

import './page.css'
const { SystemProgram, Keypair } = web3;
const opts = {
    preflightCommitment: "processed"
  }
const programID = new PublicKey(idl.metadata.address);
console.log(programID)
// const network = "http://localhost:8899/";
const network = "https://explorer-api.devnet.solana.com/";

const MyWallet: React.FC = () => {
    const wallet = useAnchorWallet();
    const walletAddress = wallet?.publicKey.toString();
    const [allAccount,setAllAccounts] : [any , any] = useState(null);

    const { connection } = useConnection();
    const baseAccount = Keypair.generate();
    async function getProvider() {
        const connection = new Connection(network, "processed");

        const provider = wallet ? new Provider(
            connection, wallet, {
                preflightCommitment: 'recent',
                commitment: 'recent',
              }
        ):null;
        return provider;
    }
    const jsonString = JSON.stringify(idl);
    const idlJSON = JSON.parse(jsonString);
    async function share(data:any) {
        const provider = await getProvider();
        if(provider && wallet){
            try{
                const program = new Program(idlJSON, idl.metadata.address, provider);
                await program.rpc.shareDocuments(data.title,data.description,data.hash,{
                    accounts: {
                        files:baseAccount.publicKey,
                        user:provider.wallet.publicKey,
                        systemProgram:SystemProgram.programId
                    },
                    signers:[baseAccount]
                  });
                const account = await program.account.files.fetch(baseAccount.publicKey);
                alert("Your Transaction is Completed !")
                console.log("account : ",account);
            }catch(e){
                console.log(e);
            }
            
        }
    }

    const [rerenderedComponent, setRerenderedComponent] = useState(1);

    const forceUpdate = () => {
        return setRerenderedComponent(prev => prev + 1);
    }   

    useEffect(()=>{
        forceUpdate()
    },[allAccount])


    useEffect(()=>{
        const get = async()=>{
            const provider = await getProvider();
            if(provider && wallet){
                const program = new Program(idlJSON, idl.metadata.address, provider);
                try{
                    const connection = new Connection(network, "processed")
                    const accounts  = await connection.getParsedProgramAccounts(programID)
                    const fetched_data =  await accounts.map(async(val,_)=>{
                        return await program.account.files.fetch(val.pubkey.toString());
                    })
                    try{
                        Promise.all(fetched_data).then((data)=>setAllAccounts(data))
                    }catch(e){
                        console.log(e);
                    }
                   
                }catch(e){
                    console.log(e);
                }
                
            }
        }
        get();
    },[wallet])


    return (
        <>
            <div className='wallet-address'>
                {wallet?.publicKey &&
                    <p>Your wallet is {walletAddress}</p> ||
                    <p>Hello! Click the button to connect</p>
                }
            </div>

            <div className="multi-wrapper wallet-button">
                <span className="button-wrapper">
                    <WalletModalProvider>
                        <WalletMultiButton/>
                    </WalletModalProvider>
                </span>
                {wallet?.publicKey && <WalletDisconnectButton />}
            </div>
            <FileUploadPage share={share}/>
            {allAccount && allAccount.length ? allAccount.map((val:any)=>{
                return (
                <div className='shared-documents'>
                    <p>Title : {val.title}</p>
                    <p>Description : {val.description}</p>
                    <p>Documents : <a href={`https://ipfs.infura.io/ipfs/${val.docs}`}>Link</a></p>
                </div>
                )
            }) : null}
        </>
    );
};

export default MyWallet;