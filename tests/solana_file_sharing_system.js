const anchor = require("@project-serum/anchor");
const assert = require("assert");
const {SystemProgram} = anchor.web3;

describe("solana_file_sharing_system", () => {
  // Configure the client to use the local cluster.
  let provider = anchor.AnchorProvider.local();
  const files = anchor.web3.Keypair.generate();
  anchor.setProvider(provider);
  const program = anchor.workspace.SolanaFileSharingSystem;

  it("Is initialized!", async () => {
      await program.rpc.initialize({
        accounts:{
          files:files.publicKey,
          user:provider.wallet.publicKey,
          systemProgram:SystemProgram.programId
        },
        signers:[files]
      })
      const account = await program.account.files.fetch(files.publicKey);
      assert.equal(account.docs[0],new anchor.BN(1))
  });
});
