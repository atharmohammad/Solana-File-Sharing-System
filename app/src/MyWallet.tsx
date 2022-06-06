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
} from '@solana/wallet-adapter-react-ui';
import {
    Program, Provider, web3
  } from '@project-serum/anchor'
import idl from "./idl.json"
import { Connection, PublicKey } from '@solana/web3.js';
import FileUploadPage from './FileUpload';

const { SystemProgram, Keypair } = web3;
const opts = {
    preflightCommitment: "processed"
  }
const programID = new PublicKey(idl.metadata.address);

const MyWallet: React.FC = () => {
    const wallet = useAnchorWallet();
    const walletAddress = wallet?.publicKey.toString();
    const { connection } = useConnection();
    const baseAccount = Keypair.generate();
    async function getProvider() {
        const network = "https://explorer-api.devnet.solana.com/";
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
    async function increment() {
        const provider = await getProvider();
        if(provider){
            const program = new Program(idlJSON, programID, provider);
            // await program.rpc.increment({
            //     accounts: {
            //       baseAccount: baseAccount.publicKey
            //     }
            //   });
            //   const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
            console.log(program);
        }
      }

    return (
        <>
            <FileUploadPage/>
            {wallet?.publicKey &&
                <p>Your wallet is {walletAddress}</p> ||
                <p>Hello! Click the button to connect</p>
            }

            <div className="multi-wrapper">
                <span className="button-wrapper">
                    <WalletModalProvider>
                        <WalletMultiButton />
                    </WalletModalProvider>
                </span>
                {wallet?.publicKey && <WalletDisconnectButton />}
            </div>
            <button onClick={increment}>click</button>
        </>
    );
};

export default MyWallet;