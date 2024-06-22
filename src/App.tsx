import TransferCUSD from "./dApps/TransferCUSD";

export default function App() {
    return (
        <div
            style={{
                marginTop: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                backgroundColor:"#FFFED3",
                height: "100vh"
            }}
        >
            <TransferCUSD />
        </div>
    );
}
