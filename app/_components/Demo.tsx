// "use client";
// import type { ChainInfo } from "@graz-sh/types";
// import { useRef } from "react";
// import {
//   useDisconnect,
//   useAccount,
//   useActiveWalletType,
//   useActiveChains,
//   useBalance,
//   useBalanceStaked,
//   useCheckWallet,
//   useSuggestChainAndConnect,
//   WalletType,
// } from "graz";
// import { CHAINS } from "../_providers/Graz";
// import { weights } from "../../theme/theme.css";
// import { monospaced } from "../../theme/typography.css";

// export const Demo = () => {
//   const { data: account } = useAccount();
//   const activeChains = useActiveChains();

//   return (
//     <>
//       <header style={{ marginBottom: "5rem" }}>
//         <ul style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
//           {CHAINS.map((chain) => (
//             <li key={"wallet" + chain.chainId}>
//               <ConnectCard chain={chain} />
//             </li>
//           ))}
//         </ul>
//       </header>

//       <ul style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
//         {activeChains?.map((chain) => (
//           <li key={"account" + chain.chainId}>
//             <AccountBox address={account?.bech32Address} chain={chain as ChainInfo} />
//           </li>
//         ))}
//       </ul>
//     </>
//   );
// };

// const AccountBox = ({ address, chain }: { address?: string; chain: ChainInfo }) => {
//   const { disconnect } = useDisconnect();
//   const { walletType } = useActiveWalletType();
//   const { data: balance, isLoading: isBalanceLoading } = useBalance({
//     chainId: chain.chainId,
//     denom: chain.currencies[0].coinMinimalDenom,
//     bech32Address: address,
//   });
//   const { data: balanceStaked, isLoading: isBalanceStakedLoading } = useBalanceStaked({
//     bech32Address: address,
//   });

//   if (!address) return null;

//   return (
//     <div>
//       <div style={{ marginBottom: "1rem" }}>
//         <h2 style={{ fontWeight: weights.bold }}>Connected with {walletType}</h2>
//         <button onClick={() => disconnect({ chainId: chain.chainId })}>Disconnect</button>
//       </div>
//       <p>
//         Account: <span className={monospaced}>{address}</span>
//       </p>
//       <p>
//         Balance: {!isBalanceLoading ? <span className={monospaced}>{balance?.amount}</span> : "Fetching balance..."}
//       </p>
//       <p>
//         Balance staked:{" "}
//         {!isBalanceStakedLoading ? (
//           <span className={monospaced}>{balanceStaked?.amount}</span>
//         ) : (
//           "Fetching staked balance..."
//         )}
//       </p>
//     </div>
//   );
// };

// const ConnectCard = ({ chain }: { chain: ChainInfo }) => {
//   const modalRef = useRef<HTMLDialogElement>(null);
//   const { data: account, isConnecting } = useAccount({ chainId: chain.chainId });

//   const { suggestAndConnect } = useSuggestChainAndConnect();
//   const { data: isKeplrSupported } = useCheckWallet(WalletType.KEPLR);
//   const { data: isLeapSupported } = useCheckWallet(WalletType.LEAP);
//   const { data: isMetaMaskSnapSupported } = useCheckWallet(WalletType.METAMASK_SNAP_LEAP);

//   if (!isKeplrSupported && !isLeapSupported && !isMetaMaskSnapSupported) {
//     return <p>No supported wallet found</p>;
//   }

//   if (!account) {
//     return (
//       <>
//         <button onClick={() => modalRef?.current?.showModal()}>Connect to {chain.chainName}</button>
//         <dialog ref={modalRef}>
//           <button onClick={() => modalRef?.current?.close()}>X</button>
//           <ul>
//             {isKeplrSupported && (
//               <li>
//                 <button onClick={() => suggestAndConnect({ chainInfo: chain, walletType: WalletType.KEPLR })}>
//                   {!isConnecting ? "Connect with Keplr" : "Connecting..."}
//                 </button>
//               </li>
//             )}
//             {isLeapSupported && (
//               <li>
//                 <button onClick={() => suggestAndConnect({ chainInfo: chain, walletType: WalletType.LEAP })}>
//                   {!isConnecting ? "Connect with Leap" : "Connecting..."}
//                 </button>
//               </li>
//             )}
//             {isMetaMaskSnapSupported && (
//               <li>
//                 <button
//                   onClick={() => suggestAndConnect({ chainInfo: chain, walletType: WalletType.METAMASK_SNAP_LEAP })}
//                 >
//                   {!isConnecting ? "Connect with MetaMask Snap" : "Connecting..."}
//                 </button>
//               </li>
//             )}
//           </ul>
//         </dialog>
//       </>
//     );
//   }
//   return <p>Connected to {chain.chainName}</p>;
// };
