use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod solana_file_sharing_system {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let share = &mut ctx.accounts.files;
        share.docs[0] = 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init,payer=user,space=264)]
    pub files: Account<'info,Files>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program : Program<'info,System>
}

#[account]
pub struct Files{
    pub docs : [u8;1] //just for testing , will change later
}
