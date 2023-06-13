import { ethers } from "ethers";
import { KeylessTransaction } from "../../types/any-evm/deploy-data";

/**
 * Generate a transaction to be sent with a keyless signer.
 *
 * @public
 * @param transaction: Unsigned transaction object
 * @param signature: Signature bytes
 */
export function getKeylessTxn(
  transaction: ethers.UnsignedTransaction,
  signature: string,
): KeylessTransaction {
  // 1. Create serialized txn string
  const digest = ethers.utils.arrayify(
    ethers.utils.keccak256(ethers.utils.serializeTransaction(transaction)),
  );

  // 2. Determine signer address from custom signature + txn
  const signer = ethers.utils.recoverAddress(digest, signature);

  // 3. Create the signed serialized txn string.
  // To be sent directly to the chain using a provider.
  const signedSerializedTx = ethers.utils.serializeTransaction(
    transaction,
    signature,
  );

  return {
    signer: signer,
    transaction: signedSerializedTx,
  };
}