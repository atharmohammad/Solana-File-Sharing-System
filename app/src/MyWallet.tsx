import React from 'react';
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

const MyWallet: React.FC = () => {
    const wallet = useAnchorWallet();
    const walletAddress = wallet?.publicKey.toString();
    const { connection } = useConnection();
    const baseAccount = Keypair.generate();
    async function getProvider() {
        const network = "http://localhost:8899/";
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
    async function share(hash:String) {
        const provider = await getProvider();
        if(provider && wallet){
            try{
                const program = new Program(idlJSON, idl.metadata.address, provider);
                await program.rpc.shareDocuments("title","description",hash,{
                    accounts: {
                        files:baseAccount.publicKey,
                        user:provider.wallet.publicKey,
                        systemProgram:SystemProgram.programId
                    },
                    signers:[baseAccount]
                  });
                const account = await program.account.files.fetch(baseAccount.publicKey);
                console.log("account : ",account);
            }catch(e){
                console.log(e);
            }
            
        }
      }

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
        </>
    );
};

export default MyWallet;