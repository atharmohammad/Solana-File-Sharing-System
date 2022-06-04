const anchor = require("@project-serum/anchor");
const assert = require("assert");
const {SystemProgram} = anchor.web3;

describe("solana_file_sharing_system", () => {
  // Configure the client to use the local cluster.
  let provider = anchor.AnchorProvider.local();
  const files = anchor.web3.Keypair.generate();
  anchor.setProvider(provider);
  const program = anchor.workspace.SolanaFileSharingSystem;

  it("share documents", async () => {
      await program.rpc.shareDocuments("test_title","test_description","test_doc_hash",{
        accounts:{
          files:files.publicKey,
          user:provider.wallet.publicKey,
          systemProgram:SystemProgram.programId
        },
        signers:[files]
      })
      const account = await program.account.files.fetch(files.publicKey);
      assert.equal(account.title,"test_title")
      assert.equal(account.description,"test_description")
      assert.equal(account.docs,"test_doc_hash")
  });
  it("sharing multiple documents",async()=>{
    const other_files = anchor.web3.Keypair.generate();
    await program.rpc.shareDocuments("new_title","new_description","new_doc_hash",{
      accounts:{
        files:other_files.publicKey,
        user:provider.wallet.publicKey,
        systemProgram:SystemProgram.programId
      },
      signers:[other_files]
    })
    //previous files
    const account1 = await program.account.files.fetch(files.publicKey);
    assert.equal(account1.title,"test_title")
    assert.equal(account1.description,"test_description")
    assert.equal(account1.docs,"test_doc_hash")

    const account2 = await program.account.files.fetch(other_files.publicKey);
    assert.equal(account2.title,"new_title")
    assert.equal(account2.description,"new_description")
    assert.equal(account2.docs,"new_doc_hash")
  })
});
