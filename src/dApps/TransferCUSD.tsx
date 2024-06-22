import { utils } from "ethers";
import { useState } from "react";


// Testnet address of cUSD
const CUSD_ADDRESS = "0x874069fa1eb16d44d622f2e0ca25eea172369bc1";

// DApp to quickly test transfer of cUSD to a specific address using the cUSD contract.
export default function TransferCUSD() {
    async function transferCUSD() {
        if (window.ethereum) {
            // Get connected accounts, if not connected request connnection.
            // returns an array of accounts
            let accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            })

            // The current selected account out of the connected accounts.
            let userAddress = accounts[0];

            let iface = new utils.Interface([
                "function transfer(address to, uint256 value)",
            ]);

            let calldata = iface.encodeFunctionData("transfer", [
                formData.accountTo,
                utils.parseEther(formData.amount), // amount to send(cUSD) - This amount is in wei
            ]);


            // Send transaction to the injected wallet to be confirmed by the user.
            await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [
                    {
                        from: userAddress,
                        to: CUSD_ADDRESS, // We need to call the transfer function on the cUSD token contract
                        data: calldata, // Information about which function to call and what values to pass as parameters
                    },
                ],
            }).then((tx: string) => {
                let answer = document.getElementById("receipt");
                if (answer) {
                    answer.innerHTML = "Success. Transaction ID: " + tx;
                }
            }).catch((error: { code: any, message: string; }) => {
                let answer = document.getElementById("receipt");
                if (answer) {
                    answer.innerHTML = "Error: " + error.message;
                }
            });
        }
    }

    interface SendFundsFormState  {
        accountTo: string;
        amount: string
    }

    const [formData, setFormData] = useState<SendFundsFormState> ({
        accountTo: '',
        amount: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prevData => ({...prevData, [name]: value}))
    }

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
          transferCUSD();
        }catch (error) {
          console.error(error);
        }
    }
  
    return (
        <div style={{marginTop: "20px", textAlign:"center"}}>
            <h1>MiniPay Send cUSD</h1>
            <form onSubmit={handleSubmit}>
                <div style={{
                    marginTop: "10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                }}>
                    <label htmlFor="accountTo">Send to:</label>
                    <input type="text" id="accountTo" name="accountTo" required
                        onChange={handleChange} value={formData.accountTo} 
                        placeholder="Enter public address(0x) or ENS name"
                        style={{width:350, height:30, textAlign:"center"}}/>
                    <label htmlFor="amount">Amount (cUSD):</label>
                    <input type="text" id="amount" name="amount" 
                        onChange={handleChange} value={formData.amount} required
                        style={{width:350, height:30, textAlign:"center"}}/>
                    <br></br>
                    <button style={{ 
                        backgroundColor: "green", borderRadius: 10,
                        color: "white", 
                        padding: 20, 
                        fontWeight: "bold" }}>
                        Transfer cUSD
                    </button>
                </div>
            </form>
            <div id="receipt" style={{
                    marginTop: "20px",
                    alignItems: "center"
                }}></div>
        </div>
    )
}
